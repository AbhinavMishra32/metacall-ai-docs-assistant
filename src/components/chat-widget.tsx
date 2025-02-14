"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages.length])

    const fetchMessages = async (userMessage: string) => {
        const newMessage = { role: "user", content: userMessage }
        setMessages((prev) => [...prev, newMessage])

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, newMessage] }),
            })
            const result = await response.json()
            setMessages(result.messages)
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        fetchMessages(input)
        setInput("")
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col w-[400px] h-[600px] bg-white border border-black"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-black">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-sm font-medium">MetaCall Assistant</h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 transition-colors">
                                    <Minimize2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 text-sm py-8">How can I help you with MetaCall?</div>
                            )}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-start space-x-2 max-w-auto",
                                        message.role === "user" ? "justify-end" : "mr-auto",
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "px-4 py-2 border max-w-full",
                                            message.role === "user" ? "bg-blue-500 text-white border-blue-500" : "bg-white border-black",
                                        )}
                                    >
                                        <MarkdownPreview source={message.content} style={{
                                            background: 'none',
                                            color: message.role === "user" ? 'white' : 'inherit',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.5',
                                            width: 'auto',
                                            whiteSpace: 'normal',
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word',
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-black bg-white">
                            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="flex-1 px-3 py-2 border border-black focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-white border border-black hover:bg-gray-100 transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="flex items-center justify-center w-14 h-14 bg-white border border-black hover:bg-gray-100 transition-colors"
                    >
                        <MessageSquare className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    )
}

