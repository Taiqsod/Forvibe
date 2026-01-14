import { z } from 'zod';
import { insertScoreSchema, Score } from './schema';

export const api = {
  scores: {
    list: {
      method: 'GET' as const,
      path: '/api/scores/:gameName',
      responses: {
        200: z.array(z.custom<Score>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/scores',
      input: insertScoreSchema,
      responses: {
        201: z.custom<Score>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
