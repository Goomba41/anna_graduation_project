import z from "zod";

export const errorResult = z.object({
  result: z.literal(-1),
  Error: z.string().optional(),
  ErrorMsg: z.string().optional(),
});

export const successResult = z.object({
  result: z.literal(0),
});
