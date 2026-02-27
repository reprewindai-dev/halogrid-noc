import { z } from 'zod';

export const slideSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(20),
  badge: z.string().optional(),
  variant: z.string().optional(),
});

export const slidesPayloadSchema = z.object({
  variant: z.string(),
  channel: z.enum(['SERVICES', 'SHOP']),
  slides: z.array(slideSchema),
});
