import type { MenuItem } from "@/components/shared/navbar/Navbar";
import { navItems } from "@/components/shared/navbar/navData";
import { createNode, type MenuNode } from "./menuTree";

/**
 * The site's built-in navigation, reshaped for the menu builder.
 *
 * It serves two purposes: it seeds the Menu structure the first time an admin
 * opens the builder, so they start from the real header rather than a blank
 * page, and it fills the Pages list so any entry can be added back after
 * being removed.
 */

export interface PageOption {
  /** The full path through the tree — labels alone are not unique. */
  id: string;
  label: string;
  url: string;
  depth: number;
  /** Ancestor labels, shown so duplicate names can be told apart. */
  trail: string;
}

/** Every entry in the built-in navigation, depth-first. */
export function flattenNavPages(
  items: MenuItem[] = navItems,
  ancestors: string[] = []
): PageOption[] {
  return items.flatMap((item) => {
    const trail = [...ancestors, item.label];
    const option: PageOption = {
      id: trail.join(" › "),
      label: item.label,
      url: item.href ?? "",
      depth: ancestors.length,
      trail: ancestors.join(" › "),
    };
    return [option, ...flattenNavPages(item.children ?? [], trail)];
  });
}

/** The same navigation as builder nodes, for seeding an unsaved menu. */
export function navPagesAsNodes(items: MenuItem[] = navItems): MenuNode[] {
  return items.map((item) =>
    createNode({
      label: item.label,
      url: item.href ?? "",
      kind: "PAGE",
      children: navPagesAsNodes(item.children ?? []),
    })
  );
}
