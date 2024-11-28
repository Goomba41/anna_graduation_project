import z from "zod";

export const ZCustomColor = z.object({
  r: z.number().int().max(255),
  g: z.number().int().max(255),
  b: z.number().int().max(255),
});

export type TCustomColor = z.infer<typeof ZCustomColor>;
