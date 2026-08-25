"use client";

import * as React from "react";
import { ChevronDown, GripVertical, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  INDENT_WIDTH,
  applyProjection,
  project,
  relink,
  subtreeLength,
  type FlatNode,
  type Projection,
} from "./menuTree";

const ROW_HEIGHT = 52;

const KIND_LABEL: Record<FlatNode["kind"], string> = {
  CUSTOM: "Custom Link",
  PAGE: "Page",
  CATEGORY: "Category",
};

interface DragState {
  id: string;
  /** Index of the dragged row in the pre-drag list. */
  index: number;
  /** How many rows travel with it. */
  size: number;
  pointerX: number;
  pointerY: number;
  startX: number;
  startY: number;
  overIndex: number;
  projection: Projection;
}

/**
 * The draggable list.
 *
 * Rows are flat with an indent per depth, exactly like the WordPress menu
 * editor: drag up/down to reorder, drag sideways to nest under the row above.
 * A dragged row carries everything nested beneath it.
 */
export function MenuStructure({
  items,
  onChange,
  expandedId,
  onToggleExpanded,
}: {
  items: FlatNode[];
  onChange: (items: FlatNode[]) => void;
  expandedId: string | null;
  onToggleExpanded: (id: string | null) => void;
}) {
  const [drag, setDrag] = React.useState<DragState | null>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Read inside the pointer handlers without re-binding them mid-gesture.
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  });

  const startDrag = (event: React.PointerEvent, index: number) => {
    event.preventDefault();

    const current = itemsRef.current;
    const size = subtreeLength(current, index);
    const startX = event.clientX;
    const startY = event.clientY;

    let latest: DragState = {
      id: current[index].id,
      index,
      size,
      pointerX: startX,
      pointerY: startY,
      startX,
      startY,
      overIndex: index,
      projection: { depth: current[index].depth, parentId: current[index].parentId },
    };
    setDrag(latest);

    const onMove = (move: PointerEvent) => {
      const list = itemsRef.current;
      const offsetY = move.clientY - startY;
      const offsetX = move.clientX - startX;

      // One row of travel per row height, clamped to the list.
      const shift = Math.round(offsetY / ROW_HEIGHT);
      const overIndex = Math.max(
        0,
        Math.min(list.length - 1 - size, index + shift)
      );

      latest = {
        ...latest,
        pointerX: move.clientX,
        pointerY: move.clientY,
        overIndex,
        projection: project(list, index, overIndex, offsetX),
      };
      setDrag(latest);
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);

      const list = itemsRef.current;
      const unchanged =
        latest.overIndex === index &&
        latest.projection.depth === list[index].depth;

      if (!unchanged) {
        onChange(
          relink(applyProjection(list, index, latest.overIndex, latest.projection))
        );
      }
      setDrag(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
        <p className="text-[13px] text-slate-500">
          This menu is empty. Add items from the panel on the left.
        </p>
      </div>
    );
  }

  // While dragging, show the list in its would-be order so the gap follows
  // the cursor — the drop is only committed on release.
  const preview = drag
    ? relink(applyProjection(items, drag.index, drag.overIndex, drag.projection))
    : items;

  return (
    <div ref={listRef} className="select-none space-y-1.5">
      {preview.map((item, index) => {
        const isDragging = drag?.id === item.id;
        const inDraggedBlock =
          drag !== null &&
          preview.findIndex((row) => row.id === drag.id) < index &&
          index <= preview.findIndex((row) => row.id === drag.id) + drag.size;

        return (
          <div
            key={item.id}
            style={{ marginLeft: item.depth * INDENT_WIDTH }}
            className={cn(
              "transition-[margin] duration-100",
              (isDragging || inDraggedBlock) && "opacity-60"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5",
                isDragging
                  ? "border-slate-400 shadow-md"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <button
                type="button"
                aria-label={`Reorder ${item.label}`}
                onPointerDown={(event) => startDrag(event, index)}
                className="cursor-grab text-slate-300 transition-colors hover:text-slate-500 active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </button>

              <span className="truncate text-[13px] font-semibold text-slate-800">
                {item.label}
              </span>

              {item.depth > 0 && (
                <span className="shrink-0 text-[11px] italic text-slate-400">
                  sub item
                </span>
              )}

              <span className="ml-auto shrink-0 text-[11px] text-slate-400">
                {KIND_LABEL[item.kind]}
              </span>

              <button
                type="button"
                aria-label={`Configure ${item.label}`}
                aria-expanded={expandedId === item.id}
                onClick={() =>
                  onToggleExpanded(expandedId === item.id ? null : item.id)
                }
                className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    expandedId === item.id && "rotate-180"
                  )}
                />
              </button>
            </div>

            {expandedId === item.id && (
              <ItemSettings
                item={item}
                onChange={(patch) =>
                  onChange(
                    items.map((row) =>
                      row.id === item.id ? { ...row, ...patch } : row
                    )
                  )
                }
                onRemove={() => {
                  // Removing a row takes its whole subtree with it.
                  const at = items.findIndex((row) => row.id === item.id);
                  const size = subtreeLength(items, at);
                  onChange(
                    relink([
                      ...items.slice(0, at),
                      ...items.slice(at + size + 1),
                    ])
                  );
                  onToggleExpanded(null);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** The panel revealed by the caret on a row. */
function ItemSettings({
  item,
  onChange,
  onRemove,
}: {
  item: FlatNode;
  onChange: (patch: Partial<FlatNode>) => void;
  onRemove: () => void;
}) {
  const field =
    "h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400";

  return (
    <div className="mt-1.5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Navigation label
          </span>
          <input
            value={item.label}
            onChange={(event) => onChange({ label: event.target.value })}
            className={field}
          />
        </label>

        <label className="space-y-1.5">
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            URL
          </span>
          <input
            value={item.url}
            placeholder="/shop or https://example.com"
            onChange={(event) => onChange({ url: event.target.value })}
            className={field}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-[12px] text-slate-600">
          <input
            type="checkbox"
            checked={item.openInNewTab}
            onChange={(event) => onChange({ openInNewTab: event.target.checked })}
            className="size-3.5 rounded border-slate-300 accent-brand"
          />
          Open in a new tab
        </label>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-red-600 transition-opacity hover:opacity-80"
        >
          <Trash2 className="size-3.5" />
          Remove
        </button>
      </div>

      <p className="text-[11px] text-slate-400">
        Leave the URL empty for a heading that only groups the items beneath it.
      </p>
    </div>
  );
}
