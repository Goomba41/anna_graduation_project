import { z } from "zod";
import type {
  RouteLocationAsRelativeGeneric,
  RouteLocationAsPathGeneric,
} from "vue-router";

export const ZSidebarMenuItemBase = z.object({
  id: z.string().uuid(),
  type: z.literal("router-link").optional(),
  to: z.union([
    z.string(),
    z.custom<RouteLocationAsPathGeneric>(),
    z.custom<RouteLocationAsRelativeGeneric>(),
  ]),
  text: z.string(),
  icon: z.string(),
});

export const ZSidebarMenuItem: z.ZodType<TSidebarMenuItem> =
  ZSidebarMenuItemBase.extend({
    children: z.lazy(() => ZSidebarMenuItem.array()).optional(),
  });

type TSidebarMenuItem = z.infer<typeof ZSidebarMenuItemBase> & {
  children?: TSidebarMenuItem[];
};

export const ZSidebarMenuItems = z.array(ZSidebarMenuItem);

export type TSidebarMenuItems = z.infer<typeof ZSidebarMenuItems>;
