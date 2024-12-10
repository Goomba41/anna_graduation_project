import z from "zod";

export const ZOptionItem = z.object({
  id: z.number(),
  name: z.string(),
});

export type TOptionItem = z.infer<typeof ZOptionItem>;

export const ZOptionItems = z.array(ZOptionItem);

export type TOptionItems = z.infer<typeof ZOptionItems>;
