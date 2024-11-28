import { z } from "zod";

export const ZSubsystem = z.object({
  Id: z.coerce.number(),
  AppName: z.string(),
  Enabled: z.boolean().default(false),
  WorkInProgress: z.boolean().default(true),
  Icon: z.string(),
});

export const ZSubsystems = z.array(ZSubsystem);

export type TSubsystem = z.infer<typeof ZSubsystem>;

export type TSubsystems = z.infer<typeof ZSubsystems>;
