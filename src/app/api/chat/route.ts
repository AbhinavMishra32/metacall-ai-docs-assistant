import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { promises as fs } from 'fs';

export async function POST(req: Request) {
    const { messages } = await req.json();
    const docs = await fs.readFile(process.cwd() + '/src/app/data/README.md', 'utf8');

    const systemMessage = [{
        role: 'system',
        content: 'You are a helpful documentation assistant for MetaCall. Help users understand the documentation and provide relevant code examples when appropriate. Always provide links to the examples when use them, provide the code also. also end the answer by asking something that will want the user to continue the convo, like something that they asked and you end the answer by asking would you like to know about this etc. Keep responses concise and focused. Try to keep the answers a little short. these are the docs: ' + docs
    }];

    const result = await generateText({
        model: google('gemini-1.5-flash'),
        system: systemMessage[0].content,
        messages: messages,
    });


    const message = {
        role: 'assistant',
        content: result.text
    };

    const resultMessages = [...messages, message];
    return NextResponse.json({ messages: resultMessages });
}
