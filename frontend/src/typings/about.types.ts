import z from "zod";

export const semverRegex: RegExp =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const ZTechEmployee = z.object({
  id: z.string().uuid(),
  icon: z.string().optional(),
  name: z.string(),
  post: z.string(),
  phone: z.number(),
  email: z.string().email(),
});

export type TTechEmployee = z.infer<typeof ZTechEmployee>;

export const ZTechEmployees = z.array(ZTechEmployee);

export type TTechEmployees = z.infer<typeof ZTechEmployees>;

export const ZPackage = z.object({
  id: z.string().uuid(),
  name: z.string(),
  version: z.string(),
  icon: z.string().optional(),
  position: z.number(),
});

export type TPackage = z.infer<typeof ZPackage>;

export const ZPackages = z.array(ZPackage);

export type TPackages = z.infer<typeof ZPackages>;
