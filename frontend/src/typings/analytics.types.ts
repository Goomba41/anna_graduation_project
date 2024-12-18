import z from "zod";

export const ZDoughnutData = z.object({
  labels: z.array(z.string()),
  datasets: z.array(
    z.object({
      data: z.array(z.number()),
      type: z.string().nullish(),
      label: z.string().nullish(),
    }),
  ),
});

export const ZAnalytic = z.record(z.string(), ZDoughnutData);

export type TAnalytic = z.infer<typeof ZAnalytic>;
