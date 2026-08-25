"use client";

import * as React from "react";
import { ChevronDown, PlusIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CategoryOption } from "@/services/menus/menus";
import { createNode, type MenuNode } from "./menuTree";
import type { PageOption } from "./navSource";

/**
 * Left-hand column: the sources an admin can add menu items from.
 *
 * Everything added lands at the bottom of the menu at top level; nesting is
 * done afterwards by dragging, which is the whole point of the builder.
 */
export function AddItemsPanel({
  pages,
  categories,
  onAdd,
  onCreatePage,
}: {
  /** The site's navigation entries, plus anything created in this session. */
  pages: PageOption[];
  categories: CategoryOption[];
  onAdd: (nodes: MenuNode[]) => void;
  /** Registers a newly created entry so it also appears in this list. */
  onCreatePage: (page: PageOption) => void;
}) {
  const [open, setOpen] = React.useState<string | null>("pages");

  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-semibold text-slate-900">Add menu items</h2>

      <Section id="pages" title="Pages" open={open === "pages"} onToggle={setOpen}>
        <PagesSection pages={pages} onAdd={onAdd} onCreatePage={onCreatePage} />
      </Section>

      <Section
        id="categories"
        title="Categories"
        open={open === "categories"}
        onToggle={setOpen}
      >
        {categories.length === 0 ? (
          <p className="px-1 py-2 text-[12px] text-slate-400">
            No product categories yet.
          </p>
        ) : (
          <CheckboxAdder
            options={categories.map((category) => ({
              id: category.id,
              label: category.name,
              url: `/${slugify(category.name)}`,
              depth: 0,
              trail: "",
            }))}
            onAdd={(picked) =>
              onAdd(
                picked.map((id) => {
                  const category = categories.find((entry) => entry.id === id);
                  return createNode({
                    label: category?.name ?? id,
                    url: `/${slugify(category?.name ?? id)}`,
                    kind: "CATEGORY",
                    categoryId: id,
                  });
                })
              )
            }
          />
        )}
      </Section>
    </div>
  );
}

/** Pages: the existing navigation, searchable, plus a create form. */
function PagesSection({
  pages,
  onAdd,
  onCreatePage,
}: {
  pages: PageOption[];
  onAdd: (nodes: MenuNode[]) => void;
  onCreatePage: (page: PageOption) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const matches = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return pages;
    return pages.filter(
      (page) =>
        page.label.toLowerCase().includes(needle) ||
        page.trail.toLowerCase().includes(needle) ||
        page.url.toLowerCase().includes(needle)
    );
  }, [pages, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          placeholder="Search pages"
          onChange={(event) => setQuery(event.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[13px] outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <CheckboxAdder
        options={matches}
        emptyMessage="No pages match that search."
        onAdd={(picked) =>
          onAdd(
            picked.map((id) => {
              const page = pages.find((entry) => entry.id === id);
              return createNode({
                label: page?.label ?? id,
                url: page?.url ?? "",
                kind: "PAGE",
              });
            })
          )
        }
      />

      <div className="border-t border-slate-200 pt-3">
        {creating ? (
          <CreatePageForm
            onCancel={() => setCreating(false)}
            onCreate={(label, url) => {
              const page: PageOption = {
                id: `new:${label}:${url}`,
                label,
                url,
                depth: 0,
                trail: "Created here",
              };
              onCreatePage(page);
              // Straight into the menu as well, so it is usable immediately.
              onAdd([createNode({ label, url, kind: "PAGE" })]);
              setCreating(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <PlusIcon className="size-3.5" />
            Create new menu item
          </button>
        )}
      </div>
    </div>
  );
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

function Section({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => onToggle(open ? null : id)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-semibold text-slate-800 transition-colors hover:bg-slate-50"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="border-t border-slate-200 px-4 py-3">{children}</div>}
    </div>
  );
}

/** Scrollable checkbox list plus "Select All" and an add button. */
function CheckboxAdder({
  options,
  emptyMessage = "Nothing to add.",
  onAdd,
}: {
  options: PageOption[];
  emptyMessage?: string;
  onAdd: (ids: string[]) => void;
}) {
  const [picked, setPicked] = React.useState<string[]>([]);

  // A search can hide picked rows; only count what is currently visible.
  const visibleIds = options.map((option) => option.id);
  const visiblePicked = picked.filter((id) => visibleIds.includes(id));
  const allPicked = options.length > 0 && visiblePicked.length === options.length;

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id]
    );

  return (
    <div className="space-y-3">
      <div className="max-h-[280px] space-y-0.5 overflow-y-auto rounded-lg border border-slate-200 p-2">
        {options.length === 0 ? (
          <p className="px-1.5 py-2 text-[12px] text-slate-400">{emptyMessage}</p>
        ) : (
          options.map((option) => (
            <label
              key={option.id}
              title={option.trail ? `${option.trail} › ${option.label}` : option.label}
              style={{ paddingLeft: option.depth * 12 }}
              className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[13px] text-slate-700 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={picked.includes(option.id)}
                onChange={() => toggle(option.id)}
                className="size-3.5 shrink-0 rounded border-slate-300 accent-brand"
              />
              <span className="truncate">{option.label}</span>
              {option.trail && (
                <span className="ml-auto shrink-0 truncate text-[10px] text-slate-400">
                  {option.trail}
                </span>
              )}
            </label>
          ))
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600">
          <input
            type="checkbox"
            checked={allPicked}
            disabled={options.length === 0}
            onChange={() =>
              setPicked(allPicked ? [] : options.map((option) => option.id))
            }
            className="size-3.5 rounded border-slate-300 accent-brand"
          />
          Select All
        </label>

        <button
          type="button"
          disabled={visiblePicked.length === 0}
          onClick={() => {
            onAdd(visiblePicked);
            setPicked([]);
          }}
          className="h-9 rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          Add to Menu
        </button>
      </div>
    </div>
  );
}

function CreatePageForm({
  onCreate,
  onCancel,
}: {
  onCreate: (label: string, url: string) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = React.useState("");
  const [url, setUrl] = React.useState("");

  const field =
    "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400";

  const submit = () => {
    if (!label.trim()) return;
    onCreate(label.trim(), url.trim());
  };

  return (
    <div className="space-y-3">
      <label className="block space-y-1.5">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Menu label
        </span>
        <input
          autoFocus
          value={label}
          placeholder="Gift Cards"
          onChange={(event) => setLabel(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          className={field}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          URL
        </span>
        <input
          value={url}
          placeholder="Leave empty for a heading"
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          className={field}
        />
      </label>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!label.trim()}
          onClick={submit}
          className="h-9 flex-1 rounded-lg bg-slate-900 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Create &amp; add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-lg border border-slate-300 px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
