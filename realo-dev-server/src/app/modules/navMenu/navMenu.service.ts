import { NavMenuItemKind, Prisma } from "@prisma/client";

import prisma from "../../../shared/prisma";

/** How deep the storefront header can render. */
const MAX_DEPTH = 3;

export type NavMenuNodeInput = {
  label: string;
  url?: string | null;
  kind?: NavMenuItemKind;
  categoryId?: string | null;
  openInNewTab?: boolean;
  children?: NavMenuNodeInput[];
};

export type NavMenuNode = {
  id: string;
  label: string;
  url: string | null;
  kind: NavMenuItemKind;
  categoryId: string | null;
  openInNewTab: boolean;
  children: NavMenuNode[];
};

type ItemRow = {
  id: string;
  label: string;
  url: string | null;
  kind: NavMenuItemKind;
  categoryId: string | null;
  openInNewTab: boolean;
  parentId: string | null;
  position: number;
};

/** Rebuild the nested shape from the flat rows, ordered by `position`. */
const toTree = (rows: ItemRow[]): NavMenuNode[] => {
  const byParent = new Map<string | null, ItemRow[]>();

  for (const row of rows) {
    const siblings = byParent.get(row.parentId) ?? [];
    siblings.push(row);
    byParent.set(row.parentId, siblings);
  }

  const build = (parentId: string | null): NavMenuNode[] =>
    (byParent.get(parentId) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((row) => ({
        id: row.id,
        label: row.label,
        url: row.url,
        kind: row.kind,
        categoryId: row.categoryId,
        openInNewTab: row.openInNewTab,
        children: build(row.id),
      }));

  return build(null);
};

const getMenu = async (slug: string) => {
  const menu = await prisma.navMenu.findUnique({
    where: { slug },
    include: {
      items: {
        select: {
          id: true,
          label: true,
          url: true,
          kind: true,
          categoryId: true,
          openInNewTab: true,
          parentId: true,
          position: true,
        },
      },
    },
  });

  // A menu that has never been saved is not an error — the storefront falls
  // back to its built-in navigation until an admin saves one.
  if (!menu) return null;

  return {
    id: menu.id,
    slug: menu.slug,
    name: menu.name,
    updatedAt: menu.updatedAt.toISOString(),
    items: toTree(menu.items),
  };
};

/**
 * Replace a menu's contents wholesale.
 *
 * The builder edits a whole tree at once and reordering rewrites almost every
 * row anyway, so deleting and re-inserting inside one transaction is both
 * simpler and less error-prone than diffing. Ids are regenerated on each save,
 * which is fine because nothing else references menu items.
 */
const saveMenu = async (
  slug: string,
  payload: { name?: string; items: NavMenuNodeInput[] },
) => {
  const menu = await prisma.navMenu.upsert({
    where: { slug },
    update: payload.name ? { name: payload.name } : {},
    create: { slug, name: payload.name ?? slug },
    select: { id: true },
  });

  const rows: Prisma.NavMenuItemUncheckedCreateInput[] = [];

  const collect = (
    nodes: NavMenuNodeInput[],
    parentId: string | null,
    depth: number,
  ) => {
    if (depth > MAX_DEPTH) return;

    nodes.forEach((node, position) => {
      const label = node.label?.trim();
      if (!label) return;

      // Ids are minted here so children can point at their parent inside a
      // single createMany, which `createMany` cannot do with nested writes.
      const id = crypto.randomUUID();

      rows.push({
        id,
        menuId: menu.id,
        label,
        url: node.url?.trim() || null,
        kind: node.kind ?? NavMenuItemKind.CUSTOM,
        categoryId: node.categoryId ?? null,
        openInNewTab: node.openInNewTab ?? false,
        parentId,
        position,
      });

      collect(node.children ?? [], id, depth + 1);
    });
  };

  collect(payload.items, null, 0);

  await prisma.$transaction([
    prisma.navMenuItem.deleteMany({ where: { menuId: menu.id } }),
    ...(rows.length ? [prisma.navMenuItem.createMany({ data: rows })] : []),
  ]);

  return getMenu(slug);
};

/** Category tree, so the builder can offer real categories to add. */
const listCategoryOptions = async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, parentId: true },
    orderBy: { name: "asc" },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    parentId: category.parentId,
  }));
};

export const NavMenuService = {
  getMenu,
  saveMenu,
  listCategoryOptions,
  MAX_DEPTH,
};
