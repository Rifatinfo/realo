"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";

import { Toast } from "@/components/shared/Toast/Toast";
import {
  getMenu,
  getMenuCategories,
  saveMenu,
  toSavedTree,
  type CategoryOption,
} from "@/services/menus/menus";
import { AddItemsPanel } from "./AddItemsPanel";
import { MenuStructure } from "./MenuStructure";
import {
  buildTree,
  flattenTree,
  relink,
  type FlatNode,
  type MenuNode,
} from "./menuTree";
import { flattenNavPages, navPagesAsNodes, type PageOption } from "./navSource";

/** The header menu. More slugs can be added once there is a picker for them. */
const MENU_SLUG = "primary";

/**
 * The navigation builder.
 *
 * Everything is edited as a flat list of rows carrying a depth — that is what
 * lets a row be dragged sideways to become a child — and converted back to a
 * tree only when saving.
 */
export function MenusManager() {
  const [items, setItems] = React.useState<FlatNode[]>([]);
  const [menuName, setMenuName] = React.useState("Primary Menu");
  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  /** Entries created in the builder, offered alongside the built-in pages. */
  const [createdPages, setCreatedPages] = React.useState<PageOption[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // The site's own navigation never changes at runtime.
  const navPages = React.useMemo(() => flattenNavPages(), []);
  const pages = React.useMemo(
    () => [...createdPages, ...navPages],
    [createdPages, navPages]
  );

  React.useEffect(() => {
    let cancelled = false;

    Promise.all([getMenu(MENU_SLUG), getMenuCategories()])
      .then(([menu, categoryList]) => {
        if (cancelled) return;

        if (menu.data?.items?.length) {
          setMenuName(menu.data.name);
          setItems(flattenTree(menu.data.items));
        } else {
          // Nothing saved yet: start from the live header so the admin
          // rearranges their real navigation instead of a blank page.
          setItems(flattenTree(navPagesAsNodes()));
        }

        setCategories(categoryList.data);
      })
      .catch((error) =>
        Toast.fire({
          icon: "error",
          title: error instanceof Error ? error.message : "Couldn't load the menu",
        })
      )
      .finally(() => {
        if (cancelled) return;
        // Even if the fetch failed, show the built-in navigation rather than
        // an empty builder.
        setItems((current) =>
          current.length ? current : flattenTree(navPagesAsNodes())
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /** New items land at the end of the menu, at the top level. */
  const addItems = (nodes: MenuNode[]) => {
    setItems((current) => [
      ...current,
      ...nodes.map((node) => ({
        id: node.id,
        label: node.label,
        url: node.url,
        kind: node.kind,
        categoryId: node.categoryId ?? null,
        openInNewTab: node.openInNewTab,
        depth: 0,
        parentId: null,
      })),
    ]);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveMenu(MENU_SLUG, {
        name: menuName.trim() || "Primary Menu",
        items: toSavedTree(buildTree(relink(items))),
      });
      Toast.fire({ icon: "success", title: "Menu saved" });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error instanceof Error ? error.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 px-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-6">
      <AddItemsPanel
        pages={pages}
        categories={categories}
        onAdd={addItems}
        onCreatePage={(page) =>
          setCreatedPages((current) => [page, ...current])
        }
      />

      <div className="space-y-3">
        <h2 className="text-[15px] font-semibold text-slate-900">Menu structure</h2>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <label className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-medium text-slate-700">Menu Name</span>
            <input
              value={menuName}
              onChange={(event) => setMenuName(event.target.value)}
              className="h-9 w-full max-w-[280px] rounded-lg border border-slate-200 px-3 text-[13px] outline-none transition-colors focus:border-slate-400"
            />
          </label>

          <p className="mt-3 text-[12px] text-slate-500">
            Drag the items into the order you prefer. Drag an item to the right to
            make it a sub item of the one above it. Click the arrow on the right of
            an item to edit its label and URL.
          </p>

          <div className="mt-5">
            <MenuStructure
              items={items}
              onChange={setItems}
              expandedId={expandedId}
              onToggleExpanded={setExpandedId}
            />
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving && <Loader2Icon className="size-3.5 animate-spin" />}
              Save Menu
            </button>

            <span className="text-[12px] text-slate-400">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
