import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../_lib/db';
import { conversations, messages } from '../../_lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const conversationId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      const [conversation] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const conversationMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);
      
      return res.status(200).json({ ...conversation, messages: conversationMessages });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await db.delete(messages).where(eq(messages.conversationId, conversationId));
      await db.delete(conversations).where(eq(conversations.id, conversationId));
      return res.status(204).send(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
