import type { MenuItemKind, MenuNode } from "@/components/modules/menus/menuTree";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    credentials: "include",
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

const json = (body: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/**
 * What the API actually returns. It differs from the editor's `MenuNode` in
 * one important way: a heading with no link has `url: null`, whereas the
 * editor's inputs are controlled and need a string.
 */
export type ServerNode = {
  id: string;
  label: string;
  url: string | null;
  kind: MenuItemKind;
  categoryId: string | null;
  openInNewTab: boolean;
  children: ServerNode[];
};

export type NavMenu = {
  id: string;
  slug: string;
  name: string;
  updatedAt: string;
  items: ServerNode[];
};

/** Normalize the API shape into what the editor works with. */
export const fromSavedTree = (nodes: ServerNode[]): MenuNode[] =>
  nodes.map((node) => ({
    id: node.id,
    label: node.label,
    url: node.url ?? "",
    kind: node.kind,
    categoryId: node.categoryId ?? null,
    openInNewTab: node.openInNewTab ?? false,
    children: fromSavedTree(node.children ?? []),
  }));

export type CategoryOption = {
  id: string;
  name: string;
  parentId: string | null;
};

export const getMenu = (slug: string) => request<NavMenu | null>(`/nav-menus/${slug}`);

/** Storefront read — no auth, used by the header. */
export const getPublicMenu = (slug: string) =>
  request<NavMenu | null>(`/nav-menus/public/${slug}`);

export const getMenuCategories = () =>
  request<CategoryOption[]>("/nav-menus/categories");

export const saveMenu = (
  slug: string,
  payload: { name: string; items: SavedNode[] }
) => request<NavMenu>(`/nav-menus/${slug}`, { method: "PUT", ...json(payload) });

/** What the server accepts: the editor's tree minus its local-only ids. */
export type SavedNode = {
  label: string;
  url: string | null;
  kind: MenuItemKind;
  categoryId: string | null;
  openInNewTab: boolean;
  children: SavedNode[];
};

export const toSavedTree = (nodes: MenuNode[]): SavedNode[] =>
  nodes.map((node) => ({
    label: node.label,
    // Tolerate a null slipping in: a blank URL means a heading either way.
    url: (node.url ?? "").trim() || null,
    kind: node.kind,
    categoryId: node.categoryId ?? null,
    openInNewTab: node.openInNewTab,
    children: toSavedTree(node.children),
  }));
