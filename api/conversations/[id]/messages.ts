import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../_lib/db';
import { messages } from '../../_lib/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const conversationId = parseInt(id as string);
  const { content, imageUrl } = req.body;

  try {
    await db.insert(messages).values({
      conversationId,
      role: 'user',
      content: content || '[Image]',
    });

    const conversationMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    const systemMessage = {
      role: 'system' as const,
      content: 'You are a friendly and creative AI assistant on forvibe, a fun creative playground website. Be helpful, playful, and engaging. When users share images, analyze and describe them thoroughly.',
    };

    const chatMessages: any[] = [systemMessage];

    conversationMessages.slice(0, -1).forEach((m) => {
      chatMessages.push({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      });
    });

    if (imageUrl) {
      const messageContent: any[] = [];
      if (content) {
        messageContent.push({ type: 'text', text: content });
      }
      messageContent.push({
        type: 'image_url',
        image_url: { url: imageUrl },
      });
      chatMessages.push({ role: 'user', content: messageContent });
    } else {
      chatMessages.push({ role: 'user', content: content });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      stream: true,
      max_tokens: 2048,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const chunkContent = chunk.choices[0]?.delta?.content || '';
      if (chunkContent) {
        fullResponse += chunkContent;
        res.write(`data: ${JSON.stringify({ content: chunkContent })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId,
      role: 'assistant',
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error sending message:', error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Failed to send message' })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
}
