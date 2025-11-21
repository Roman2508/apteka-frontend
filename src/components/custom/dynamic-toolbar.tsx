import { type ReactNode, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHistory } from "../../providers/history-provider"
import { TableActionsMenu, type TableAction } from "./table-actions"

export interface ToolbarButton {
  type?: "button"
  label: string
  icon?: ReactNode
  onClick?: () => void
  variant?: "default" | "destructive" | "link" | "primary" | "secondary" | "outline" | "ghost"
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
  actions?: TableAction[]
  hideActionsMenu?: boolean
}

export function DynamicToolbar({
  title,
  items,
  search,
  customControls,
  className,
  actions,
  hideActionsMenu,
}: DynamicToolbarProps) {
  const { canGoBack, canGoForward, goBack, goForward } = useHistory()
  const searchConfig = typeof search === "object" ? search : null
  const [localSearchValue, setLocalSearchValue] = useState(searchConfig?.value || "")

  useEffect(() => {
    if (searchConfig?.value !== undefined) {
      setLocalSearchValue(searchConfig.value)
    }
  }, [searchConfig?.value])

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
          {searchConfig && (
            <div className="flex items-center gap-1">
              <Input
                value={localSearchValue}
                onChange={(e) => {
                  const newValue = e.target.value
                  setLocalSearchValue(newValue)
                  if (newValue === "") {
                    searchConfig.onChange("")
                  }
                }}
                className={cn("h-7 w-48 text-xs", searchConfig.className)}
                placeholder={searchConfig.placeholder || "Пошук..."}
              />
              <Button
                size="icon"
                className="w-10 h-7 px-0"
                onClick={() => searchConfig.onChange(localSearchValue)}
                disabled={!localSearchValue}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          )}

          {actions && !hideActionsMenu && <TableActionsMenu actions={actions} />}
        </div>
      </div>
    </div>
  )
}
