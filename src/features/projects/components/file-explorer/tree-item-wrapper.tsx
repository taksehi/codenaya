import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { Doc } from "@convex/_generated/dataModel"
import React from "react"
import { getItemPadding } from "./constants"

export const TreeItemWrapper = (
  {
    item,
    children,
    level,
    isActive,
    onClick,
    onDoubleClick,
    onRename,
    onDelete,
    onCreateFile,
    onCreateFolder
  } : {
    item: Doc<"files">
    children: React.ReactNode
    level: number
    isActive: boolean
    onClick?: () => void
    onDoubleClick?: () => void
    onRename?: () => void
    onDelete?: () => void
    onCreateFile?: () => void
    onCreateFolder?: () => void
  }
) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              e.stopPropagation()
              onRename?.()
            }
          }}
          className={cn(
            "group flex items-center gap-1.5 w-full h-7 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors duration-150 outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500/50"
          )}
          style={{ paddingLeft: getItemPadding(level, item.type == "file")}}
        >
          {children}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-64"
      >
        {item.type === "folder" && (
          <>
            <ContextMenuItem
              onClick={onCreateFile}
              className="text-sm"
            >
              New File...
            </ContextMenuItem>
            <ContextMenuItem
              onClick={onCreateFolder}
              className="text-sm"
            >
              New Folder...
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          onClick={onRename}
          className="text-sm"
        >
          Rename
          <ContextMenuShortcut>
            Enter
          </ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onDelete}
          className="text-sm"
        >
          Delete Permanently
          <ContextMenuShortcut>
            ⌘ + ⌫
          </ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}