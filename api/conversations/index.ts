import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db';
import { conversations } from '../_lib/schema';
import { desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const allConversations = await db
        .select()
        .from(conversations)
        .orderBy(desc(conversations.createdAt));
      
      return res.status(200).json(allConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title } = req.body;
      const [conversation] = await db
        .insert(conversations)
        .values({ title: title || 'New Chat' })
        .returning();
      
      return res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
