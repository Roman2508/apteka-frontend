import { type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, MoreHorizontal, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import pencilIcon from "../../assets/icons/pencil.svg"
import rotateIcon from "../../assets/icons/rotate.svg"
import excludeIcon from "../../assets/icons/exclude.svg"
import fileCopyIcon from "../../assets/icons/file-copy.svg"
import circlePlusIcon from "../../assets/icons/circle-plus.svg"
import fileExcludeIcon from "../../assets/icons/file-exclude.svg"
import { useHistory } from "../../providers/history-provider"

const dropdownItems = [
  { icon: circlePlusIcon, label: "Створити", shortcut: "Ins" },
  { icon: fileCopyIcon, label: "Скопіювати", shortcut: "F9" },
  { icon: pencilIcon, label: "Змінити", shortcut: "F2" },
  { icon: fileExcludeIcon, label: "Відмітити для вилучення / Зняти позначку", shortcut: "Del" },
  { icon: excludeIcon, label: "Вилучити", shortcut: "Shift+Del" },
  { icon: rotateIcon, label: "Оновити", shortcut: "F5" },
]

export interface ToolbarButton {
  type?: "button"
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: "default" | "destructive" | "link" | "primary"
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export interface ToolbarCustomItem {
  type: "custom"
  content: ReactNode
  className?: string
}

export type ToolbarItem = ToolbarButton | ToolbarCustomItem

export interface ToolbarSearch {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface DynamicToolbarProps {
  title?: string
  items?: ToolbarItem[] | ToolbarItem[][]
  search?: ToolbarSearch | boolean
  customControls?: ReactNode
  className?: string
}

export function DynamicToolbar({ title, items, search, customControls, className }: DynamicToolbarProps) {
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()

  const renderItem = (item: ToolbarItem, index: number) => {
    if (item.type === "custom") {
      return (
        <div key={index} className={item.className}>
          {item.content}
        </div>
      )
    }

    const btn = item as ToolbarButton
    return (
      <Button
        key={index}
        variant={btn.variant || "default"}
        size={btn.size || "sm"}
        onClick={btn.onClick}
        disabled={btn.disabled}
        className={btn.className}
      >
        {btn.icon && <span className={cn("w-4 h-4", btn.label ? "mr-1" : "")}>{btn.icon}</span>}
        {btn.label}
      </Button>
    )
  }

  return (
    <div className={cn("mb-4", className)}>
      {title && (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Button size="icon" className="w-10 h-7 px-0" onClick={goBack} disabled={!canGoBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button size="icon" className="w-10 h-7 px-0" onClick={goForward} disabled={!canGoForward}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <h1 className="text-lg">{title}</h1>
        </div>
      )}

      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          {items && Array.isArray(items[0]) ? (
            // Multi-row
            (items as ToolbarItem[][]).map((row, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                {row.map((item, index) => renderItem(item, index))}
              </div>
            ))
          ) : (
            // Single row
            <div className="flex items-center gap-2 gap-y-4 flex-wrap">
              {items && (items as ToolbarItem[]).map((item, index) => renderItem(item, index))}
              {customControls}
            </div>
          )}
          {items && Array.isArray(items[0]) && customControls && (
            <div className="flex items-center gap-2 flex-wrap">{customControls}</div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {search && typeof search === "object" && (
            <div className="flex items-center gap-1">
              <Input
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                className={cn("h-7 w-48 text-xs", search.className)}
                placeholder={search.placeholder || "Пошук..."}
              />
              <Button size="icon" className="w-10 h-7 px-0">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size="icon" className="w-10 h-7 px-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {dropdownItems.map((item) => (
                <DropdownMenuItem key={item.label}>
                  <img width={16} src={item.icon} alt="icon" />
                  <span className="pr-10">{item.label}</span>
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
