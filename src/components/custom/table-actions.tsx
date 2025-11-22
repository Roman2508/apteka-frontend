import { type ReactNode, useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export interface TableAction {
  id: string
  label: string
  icon?: ReactNode
  shortcut?: string
  onClick: () => void
  disabled?: boolean
}

interface TableActionsMenuProps {
  actions: TableAction[]
  trigger?: ReactNode
  disabled?: boolean
}

export function TableActionsMenu({ actions, trigger, disabled }: TableActionsMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleClose = () => setOpen(false)
    window.addEventListener("close-dropdown-menus", handleClose)
    return () => window.removeEventListener("close-dropdown-menus", handleClose)
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      window.dispatchEvent(new Event("close-context-menus"))
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger || (
          <Button size="icon" className="w-10 h-7 px-0" disabled={disabled}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem key={action.id} onClick={action.onClick} disabled={action.disabled}>
            {action.icon && <span className="mr-2 flex items-center justify-center w-4 h-4">{action.icon}</span>}
            <span className="pr-10">{action.label}</span>
            {action.shortcut && <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface TableContextMenuProps {
  actions: TableAction[]
  children: ReactNode
}

export function TableContextMenu({ actions, children }: TableContextMenuProps) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const handleClose = () => setVersion((v) => v + 1)
    window.addEventListener("close-context-menus", handleClose)
    return () => window.removeEventListener("close-context-menus", handleClose)
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      window.dispatchEvent(new Event("close-dropdown-menus"))
    }
  }

  return (
    <ContextMenu key={version} onOpenChange={handleOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {actions.map((action) => (
          <ContextMenuItem key={action.id} onClick={action.onClick} disabled={action.disabled}>
            {action.icon && <span className="mr-2 flex items-center justify-center w-4 h-4">{action.icon}</span>}
            <span className="pr-10">{action.label}</span>
            {action.shortcut && <ContextMenuShortcut>{action.shortcut}</ContextMenuShortcut>}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  )
}
