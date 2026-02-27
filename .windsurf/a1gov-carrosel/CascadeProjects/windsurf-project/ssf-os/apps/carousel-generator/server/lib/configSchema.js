import { z } from 'zod';

export const trendSkinEnum = z.enum([
  'CLEAN_MINIMAL_PRO',
  'COOL_BLUE_GLACIER',
  'GUMMY_GLOSS',
  'GLITCHY_GLAM',
  'EDITORIAL_LUXE',
  'CREATOR_DESK',
]);

export const configSchema = z.object({
  schema_id: z.literal('ssf_carousel_v1'),
  channel: z.enum(['SERVICES', 'SHOP']),
  carouselLength: z.union([z.literal(5), z.literal(9)]),
  variantCount: z.union([z.literal(1), z.literal(3), z.literal(5)]),
  trendSkin: trendSkinEnum,
  destinationUrl: z.string().url(),
  serviceName: z.string().min(2).optional(),
  coreProblem: z.string().min(10).optional(),
  flatRatePrice: z.string().optional(),
  buyerType: z.enum(['Agency', 'Coach', 'Podcaster', 'Consultant', 'LocalBiz']).optional(),
  productName: z.string().min(2).optional(),
  offerSummary: z.string().min(10).optional(),
  price: z.string().optional(),
  includesBullets: z.array(z.string().min(2)).optional(),
  whoItsForBullets: z.array(z.string().min(2)).optional(),
});

export function validateConfig(payload) {
  return configSchema.parse(payload);
}
