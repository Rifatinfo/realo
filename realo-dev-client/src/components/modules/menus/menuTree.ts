/**
 * The tree maths behind the menu builder.
 *
 * The editor works on a *flat* list where each row carries a depth, which is
 * what makes the WordPress-style gesture possible: dragging up and down
 * reorders, dragging sideways changes depth, and depth is what decides who a
 * row's parent is. The nested shape is only rebuilt when saving.
 */

export type MenuItemKind = "CUSTOM" | "PAGE" | "CATEGORY"

export interface MenuNode {
  id: string
  label: string
  url: string
  kind: MenuItemKind
  categoryId?: string | null
  openInNewTab: boolean
  children: MenuNode[]
}

export interface FlatNode extends Omit<MenuNode, "children"> {
  depth: number
  parentId: string | null
}

/** The storefront header renders four levels, so depth is capped at 3. */
export const MAX_DEPTH = 3

/** Pixels of horizontal drag that equal one level of nesting. */
export const INDENT_WIDTH = 32

export function flattenTree(
  nodes: MenuNode[],
  parentId: string | null = null,
  depth = 0
): FlatNode[] {
  return nodes.flatMap((node) => [
    { ...node, children: undefined, depth, parentId } as unknown as FlatNode,
    ...flattenTree(node.children, node.id, depth + 1),
  ])
}

export function buildTree(items: FlatNode[]): MenuNode[] {
  const roots: MenuNode[] = []
  const byId = new Map<string, MenuNode>()

  for (const item of items) {
    const node: MenuNode = {
      id: item.id,
      label: item.label,
      url: item.url,
      kind: item.kind,
      categoryId: item.categoryId ?? null,
      openInNewTab: item.openInNewTab,
      children: [],
    }
    byId.set(item.id, node)

    const parent = item.parentId ? byId.get(item.parentId) : null
    if (parent) parent.children.push(node)
    else roots.push(node)
  }

  return roots
}

/** Every row nested under `index`, i.e. the rows that move with it. */
export function subtreeLength(items: FlatNode[], index: number): number {
  const depth = items[index].depth
  let count = 0
  for (let i = index + 1; i < items.length && items[i].depth > depth; i += 1) {
    count += 1
  }
  return count
}

/** Move a row together with everything nested under it. */
export function moveBlock(
  items: FlatNode[],
  from: number,
  to: number,
  size: number
): FlatNode[] {
  const block = items.slice(from, from + size + 1)
  const rest = items.slice(0, from).concat(items.slice(from + size + 1))
  // `to` indexes the original list, so shift it when moving downwards past
  // the gap the block itself leaves behind.
  const target = to > from ? to - size : to
  return [...rest.slice(0, target), ...block, ...rest.slice(target)]
}

export interface Projection {
  depth: number
  parentId: string | null
}

/**
 * Where a dragged row would land: its depth (from how far sideways it was
 * dragged, clamped so it can never skip a level or orphan the row below it)
 * and the parent that depth implies.
 */
export function project(
  items: FlatNode[],
  dragIndex: number,
  overIndex: number,
  offsetX: number
): Projection {
  const size = subtreeLength(items, dragIndex)
  const moved = moveBlock(items, dragIndex, overIndex, size)
  const landedAt = moved.findIndex((item) => item.id === items[dragIndex].id)

  const previous = moved[landedAt - 1]
  const next = moved[landedAt + size + 1]

  const dragged = items[dragIndex]
  const wanted = dragged.depth + Math.round(offsetX / INDENT_WIDTH)

  // You may nest one level deeper than the row above, no more; and you may
  // not sit shallower than the row below, which would leave it parentless.
  const maxDepth = previous ? Math.min(previous.depth + 1, MAX_DEPTH) : 0
  const minDepth = next ? next.depth : 0
  const depth = Math.max(minDepth, Math.min(wanted, maxDepth))

  if (depth === 0) return { depth, parentId: null }

  // The parent is the nearest row above sitting exactly one level shallower.
  for (let i = landedAt - 1; i >= 0; i -= 1) {
    if (moved[i].depth === depth - 1) return { depth, parentId: moved[i].id }
  }

  return { depth, parentId: null }
}

/**
 * Apply a projection: move the block, restamp the dragged row's depth and
 * parent, and shift its descendants by the same amount so the subtree keeps
 * its own shape.
 */
export function applyProjection(
  items: FlatNode[],
  dragIndex: number,
  overIndex: number,
  projection: Projection
): FlatNode[] {
  const size = subtreeLength(items, dragIndex)
  const shift = projection.depth - items[dragIndex].depth
  const moved = moveBlock(items, dragIndex, overIndex, size)
  const landedAt = moved.findIndex((item) => item.id === items[dragIndex].id)

  return moved.map((item, index) => {
    if (index === landedAt) {
      return { ...item, depth: projection.depth, parentId: projection.parentId }
    }
    if (index > landedAt && index <= landedAt + size) {
      return { ...item, depth: item.depth + shift }
    }
    return item
  })
}

/**
 * Recompute every `parentId` from the depths alone. Called after a move so
 * descendants that shifted level are re-attached to the right ancestor.
 */
export function relink(items: FlatNode[]): FlatNode[] {
  const ancestors: string[] = []

  return items.map((item) => {
    ancestors.length = item.depth
    const parentId = item.depth === 0 ? null : (ancestors[item.depth - 1] ?? null)
    ancestors[item.depth] = item.id
    return { ...item, parentId }
  })
}

let counter = 0

/** Ids only need to be unique within the editing session. */
export function newId(): string {
  counter += 1
  return `item-${Date.now().toString(36)}-${counter}`
}

export function createNode(partial: Partial<MenuNode> & { label: string }): MenuNode {
  return {
    id: newId(),
    url: "",
    kind: "CUSTOM",
    categoryId: null,
    openInNewTab: false,
    children: [],
    ...partial,
  }
}
