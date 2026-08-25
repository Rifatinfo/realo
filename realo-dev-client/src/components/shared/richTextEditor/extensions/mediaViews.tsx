"use client"

import * as React from "react"
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react"

import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state"

import { cn } from "@/lib/utils"
import { AlignCenter, AlignLeft, AlignRight, StretchHorizontal } from "lucide-react"

import {
  CONTENT_BLOCKS,
  EmbedBlock,
  Figure,
  ImageBlock,
  VideoBlock,
  type MediaAlign,
} from "./blocks"

/** The four grab points, and which way dragging each one grows the frame. */
const HANDLES = [
  { key: "nw", direction: -1, className: "-left-1.5 -top-1.5 cursor-nwse-resize" },
  { key: "ne", direction: 1, className: "-right-1.5 -top-1.5 cursor-nesw-resize" },
  { key: "sw", direction: -1, className: "-bottom-1.5 -left-1.5 cursor-nesw-resize" },
  { key: "se", direction: 1, className: "-right-1.5 -bottom-1.5 cursor-nwse-resize" },
] as const

const MIN_WIDTH_PX = 60

/**
 * Click-to-select plus corner-drag scaling, the way a word processor does it.
 *
 * Width is stored as a percentage of the editor's content width so a post
 * scaled on a desktop still fits a phone, and height is never written —
 * `height: auto` in the stylesheet keeps the aspect ratio locked.
 */
function useMediaFrame({
  editor,
  getPos,
  storedWidth,
  updateAttributes,
}: {
  editor: NodeViewProps["editor"]
  getPos: NodeViewProps["getPos"]
  storedWidth: string | null
  updateAttributes: NodeViewProps["updateAttributes"]
}) {
  const frameRef = React.useRef<HTMLElement | null>(null)
  // Live width during a drag. Held in React rather than written to the
  // document on every pointermove, so the whole resize is one undo step.
  const [liveWidth, setLiveWidth] = React.useState<string | null>(null)

  /**
   * `figure` has an editable caption, so it is not an atom — ProseMirror
   * would put the caret in the caption rather than selecting the node.
   * Selecting explicitly is what makes the bounding box appear for it.
   */
  const select = React.useCallback(() => {
    const pos = getPos()
    if (typeof pos === "number") editor.commands.setNodeSelection(pos)
  }, [editor, getPos])

  const startResize = (event: React.PointerEvent, direction: number) => {
    event.preventDefault()
    event.stopPropagation()

    const frame = frameRef.current
    if (!frame) return

    const contentWidth = editor.view.dom.clientWidth
    const startX = event.clientX
    const startWidth = frame.offsetWidth
    let latest = storedWidth

    const onMove = (move: PointerEvent) => {
      const delta = (move.clientX - startX) * direction
      const next = Math.min(contentWidth, Math.max(MIN_WIDTH_PX, startWidth + delta))
      latest = `${Math.round((next / contentWidth) * 1000) / 10}%`
      setLiveWidth(latest)
    }

    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      setLiveWidth(null)
      if (latest !== storedWidth) updateAttributes({ width: latest })
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return {
    frameRef,
    select,
    startResize,
    dragging: liveWidth !== null,
    width: liveWidth ?? storedWidth ?? undefined,
    liveWidth,
  }
}

const ALIGN_BUTTONS = [
  { value: "left", label: "Align left", Icon: AlignLeft },
  { value: "center", label: "Align center", Icon: AlignCenter },
  { value: "right", label: "Align right", Icon: AlignRight },
] as const

/**
 * Alignment controls pinned above the selected block.
 *
 * The main toolbar's align buttons do the same thing; these exist because a
 * selected image is where people look for them.
 */
function AlignBar({
  align,
  onAlign,
  onFullWidth,
}: {
  align: string | null
  onAlign: (value: MediaAlign) => void
  onFullWidth: () => void
}) {
  return (
    <span contentEditable={false} className="rte-media-toolbar">
      {ALIGN_BUTTONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={align === value}
          // The frame must stay selected, so never let this steal focus.
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onAlign(value)}
          className={cn(
            "inline-flex size-6 items-center justify-center rounded transition-colors [&_svg]:size-3.5",
            align === value
              ? "bg-brand/10 text-brand"
              : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Icon />
        </button>
      ))}

      <span className="mx-0.5 h-4 w-px bg-slate-200" aria-hidden="true" />

      <button
        type="button"
        title="Full width"
        aria-label="Full width"
        onMouseDown={(event) => event.preventDefault()}
        onClick={onFullWidth}
        className="inline-flex size-6 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 [&_svg]:size-3.5"
      >
        <StretchHorizontal />
      </button>
    </span>
  )
}

function ResizeHandles({
  onStart,
  liveWidth,
}: {
  onStart: (event: React.PointerEvent, direction: number) => void
  /** Shown as a size badge only while a drag is in progress. */
  liveWidth: string | null
}) {
  return (
    <>
      {HANDLES.map((handle) => (
        <span
          key={handle.key}
          contentEditable={false}
          onPointerDown={(event) => onStart(event, handle.direction)}
          className={cn(
            "absolute z-20 size-3 rounded-[2px] border border-brand bg-white shadow-sm",
            handle.className
          )}
        />
      ))}

      {liveWidth && (
        <span
          contentEditable={false}
          className="absolute -top-6 left-1/2 z-20 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white"
        >
          {liveWidth}
        </span>
      )}
    </>
  )
}

/**
 * Shared shell: the bounding box, the corner anchors, and the click target
 * that selects the node.
 */
function MediaFrame({
  as = "div",
  className,
  selected,
  frameRef,
  dragging,
  width,
  liveWidth,
  align,
  onAlign,
  onFullWidth,
  onStartResize,
  children,
  caption,
}: {
  as?: React.ElementType
  className?: string
  selected: boolean
  frameRef: React.Ref<HTMLElement>
  dragging: boolean
  width: string | undefined
  liveWidth: string | null
  align: string | null
  onAlign: (value: MediaAlign) => void
  onFullWidth: () => void
  onStartResize: (event: React.PointerEvent, direction: number) => void
  children: React.ReactNode
  caption?: React.ReactNode
}) {
  const active = selected || dragging

  return (
    <NodeViewWrapper
      as={as}
      ref={frameRef}
      className={cn(
        "rte-media-frame",
        active && "is-selected",
        dragging && "is-resizing",
        className
      )}
      style={{ width }}
      data-align={align ?? undefined}
    >
      {children}
      {selected && !dragging && (
        <AlignBar align={align} onAlign={onAlign} onFullWidth={onFullWidth} />
      )}
      {active && <ResizeHandles onStart={onStartResize} liveWidth={liveWidth} />}
      {caption}
    </NodeViewWrapper>
  )
}

/** Bare `<img>` — no caption. */
function ImageBlockView(props: NodeViewProps) {
  const { node, selected } = props
  const { frameRef, select, startResize, dragging, width, liveWidth } = useMediaFrame({
    editor: props.editor,
    getPos: props.getPos,
    storedWidth: (node.attrs.width as string) ?? null,
    updateAttributes: props.updateAttributes,
  })

  const frameProps = {
    frameRef: frameRef as React.Ref<HTMLElement>,
    dragging,
    width,
    liveWidth,
    align: (node.attrs.align as string) ?? null,
    onAlign: (value: MediaAlign) => props.updateAttributes({ align: value }),
    onFullWidth: () => props.updateAttributes({ align: null, width: null }),
    onStartResize: startResize,
  }

  return (
    <MediaFrame selected={selected} {...frameProps}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src ?? ""}
        alt={node.attrs.alt ?? ""}
        title={node.attrs.title ?? undefined}
        draggable={false}
        // An atom already selects on click; preventDefault stops the browser
        // dropping a caret next to it first, which would flicker the box.
        onMouseDown={(event) => {
          event.preventDefault()
          select()
        }}
      />
    </MediaFrame>
  )
}

/** `<figure>` with an editable caption. */
function FigureView(props: NodeViewProps) {
  const { node, selected } = props
  const { frameRef, select, startResize, dragging, width, liveWidth } = useMediaFrame({
    editor: props.editor,
    getPos: props.getPos,
    storedWidth: (node.attrs.width as string) ?? null,
    updateAttributes: props.updateAttributes,
  })

  const frameProps = {
    frameRef: frameRef as React.Ref<HTMLElement>,
    dragging,
    width,
    liveWidth,
    align: (node.attrs.align as string) ?? null,
    onAlign: (value: MediaAlign) => props.updateAttributes({ align: value }),
    onFullWidth: () => props.updateAttributes({ align: null, width: null }),
    onStartResize: startResize,
  }

  return (
    <MediaFrame
      as="figure"
      className="post-figure"
      selected={selected}
      {...frameProps}
      caption={
        // The generic is explicit because `as` is wrapped in NoInfer.
        <NodeViewContent<"figcaption"> as="figcaption" data-placeholder="Add a caption…" />
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={node.attrs.src ?? ""}
        alt={node.attrs.alt ?? ""}
        draggable={false}
        onMouseDown={(event) => {
          event.preventDefault()
          select()
        }}
      />
    </MediaFrame>
  )
}

/** `<video controls>` — selectable without losing the playback controls. */
function VideoBlockView(props: NodeViewProps) {
  const { node, selected } = props
  const { frameRef, select, startResize, dragging, width, liveWidth } = useMediaFrame({
    editor: props.editor,
    getPos: props.getPos,
    storedWidth: (node.attrs.width as string) ?? null,
    updateAttributes: props.updateAttributes,
  })

  const frameProps = {
    frameRef: frameRef as React.Ref<HTMLElement>,
    dragging,
    width,
    liveWidth,
    align: (node.attrs.align as string) ?? null,
    onAlign: (value: MediaAlign) => props.updateAttributes({ align: value }),
    onFullWidth: () => props.updateAttributes({ align: null, width: null }),
    onStartResize: startResize,
  }

  return (
    <MediaFrame selected={selected} {...frameProps}>
      <video
        className="video-block"
        src={node.attrs.src ?? ""}
        controls
        // No preventDefault here: the browser's own controls must keep
        // receiving the click that selects the node.
        onMouseDown={select}
      />
    </MediaFrame>
  )
}

/**
 * Embedded player (YouTube / Vimeo). Pointer events go into the iframe, so an
 * overlay catches the first click; once selected it stops intercepting and
 * the video becomes playable.
 */
function EmbedBlockView(props: NodeViewProps) {
  const { node, selected } = props
  const { frameRef, select, startResize, dragging, width, liveWidth } = useMediaFrame({
    editor: props.editor,
    getPos: props.getPos,
    storedWidth: (node.attrs.width as string) ?? null,
    updateAttributes: props.updateAttributes,
  })

  const frameProps = {
    frameRef: frameRef as React.Ref<HTMLElement>,
    dragging,
    width,
    liveWidth,
    align: (node.attrs.align as string) ?? null,
    onAlign: (value: MediaAlign) => props.updateAttributes({ align: value }),
    onFullWidth: () => props.updateAttributes({ align: null, width: null }),
    onStartResize: startResize,
  }

  return (
    <MediaFrame className="embed-wrap" selected={selected} {...frameProps}>
      <iframe
        src={node.attrs.src ?? ""}
        loading="lazy"
        allowFullScreen
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      {!selected && (
        <span
          contentEditable={false}
          onMouseDown={(event) => {
            event.preventDefault()
            select()
          }}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      )}
    </MediaFrame>
  )
}

export const ResizableImageBlock = ImageBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView)
  },
})

export const ResizableFigure = Figure.extend({
  addNodeView() {
    return ReactNodeViewRenderer(FigureView)
  },

  /**
   * A figure holds an editable caption, so it is not an atom — ProseMirror's
   * default click handling puts a caret in the caption instead of selecting
   * the node, and the bounding box would never appear. `handleClickOn` is the
   * supported hook for overriding that; returning true stops ProseMirror
   * applying its own selection afterwards.
   */
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("figureClickSelect"),
        props: {
          handleClickOn(view, _pos, node, nodePos, event, direct) {
            if (!direct || node.type.name !== "figure") return false

            // Clicking the caption should still just place the caret there.
            const target = event.target as HTMLElement | null
            if (target?.closest("figcaption")) return false

            view.dispatch(
              view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos))
            )
            return true
          },
        },
      }),
    ]
  },
})

export const ResizableVideoBlock = VideoBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(VideoBlockView)
  },
})

export const ResizableEmbedBlock = EmbedBlock.extend({
  addNodeView() {
    return ReactNodeViewRenderer(EmbedBlockView)
  },
})

const RESIZABLE = [
  ResizableImageBlock,
  ResizableFigure,
  ResizableVideoBlock,
  ResizableEmbedBlock,
]

const RESIZABLE_NAMES = new Set(RESIZABLE.map((extension) => extension.name))

/**
 * Every content block the post editor registers. The resizable variants
 * replace their plain counterparts from `CONTENT_BLOCKS`.
 */
export const POST_BLOCKS = [
  ...RESIZABLE,
  ...CONTENT_BLOCKS.filter((extension) => !RESIZABLE_NAMES.has(extension.name)),
]
