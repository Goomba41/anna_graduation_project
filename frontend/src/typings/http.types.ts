import z from "zod";

export const errorResult = z.object({
  result: z.literal(-1),
  error: z.string().optional(),
  errorMsg: z.string().optional(),
});

export const successResult = z.object({
  result: z.literal(0),
});
