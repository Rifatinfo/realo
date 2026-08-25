import { z } from "zod";

/** One node of the tree the admin builder posts back. */
const nodeSchema: z.ZodType<{
  label: string;
  url?: string | null;
  kind?: "CUSTOM" | "PAGE" | "CATEGORY";
  categoryId?: string | null;
  openInNewTab?: boolean;
  children?: unknown[];
}> = z.lazy(() =>
  z.object({
    label: z.string().trim().min(1, "Every menu item needs a label").max(120),
    url: z.string().trim().max(2000).nullish(),
    kind: z.enum(["CUSTOM", "PAGE", "CATEGORY"]).optional(),
    categoryId: z.string().nullish(),
    openInNewTab: z.boolean().optional(),
    children: z.array(nodeSchema).optional(),
  }),
);

const saveMenuSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  items: z.array(nodeSchema),
});

export const NavMenuValidation = {
  saveMenuSchema,
};
