import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import type { ModalContentItem, ModalItem, ModalRow, TemplateModalFooter } from './template-modal.types'

export interface TemplateModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  content: ModalContentItem[]
  layout?: 'single' | 'two-column'
  footer?: TemplateModalFooter
  maxWidth?: string
  className?: string
}

// --- Component ---

export function TemplateModal({
  title,
  isOpen,
  onClose,
  content,
  layout = 'single',
  footer,
  maxWidth = 'sm:max-w-[600px]',
  className,
}: TemplateModalProps) {
  // Helper to render a single item
  const renderItem = (item: ModalItem, index: number) => {
    const spanClass = item.span ? `col-span-${item.span}` : 'col-span-1'

    return (
      <div key={index} className={cn('flex flex-col gap-1.5', spanClass, item.className)}>
        {item.label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {item.label}
          </label>
        )}
        <div className="w-full">{item.content}</div>
      </div>
    )
  }

  // Helper to render a row
  const renderRow = (row: ModalRow, index: number) => {
    // Determine grid columns. If not specified, default to the number of items,
    // unless it's a single item row, then it's just full width (or handled by grid-cols-1 parent if nested)
    // Actually, for a row, we usually want a grid.
    const cols = row.cols || row.items.length

    return (
      <div
        key={index}
        className={cn('grid gap-4', `grid-cols-${cols}`, row.className)}
        style={{ gridTemplateColumns: row.cols ? `repeat(${row.cols}, minmax(0, 1fr))` : undefined }}
      >
        {row.items.map((item, idx) => renderItem(item, idx))}
      </div>
    )
  }

  // Helper to render content based on layout
  const renderContent = () => {
    if (layout === 'two-column') {
      // In two-column mode, we expect the content array to ideally have 2 sections or groups of rows
      // If it's just a flat list of rows, we might need to split them or just render them in the left column?
      // Let's assume for two-column layout, the user provides content that makes sense to split.
      // But to be "universal", we can just render the content normally but wrap it in a 2-column grid if it's not sections.

      // Better approach for two-column: The top-level container is a grid with 2 columns.
      // The `content` prop array items are distributed.
      // If the user wants specific items in left/right, they should probably use sections or we just flow them.
      // Let's assume the user passes exactly 2 sections for best control, or we just flow them.

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.map((item, index) => {
            if (item.type === 'section') {
              return (
                <div key={index} className={cn('flex flex-col gap-4', item.className)}>
                  {item.title && <h4 className="font-semibold text-foreground">{item.title}</h4>}
                  {item.rows.map((row, rIdx) => renderRow(row, rIdx))}
                </div>
              )
            } else {
              return renderRow(item, index)
            }
          })}
        </div>
      )
    }

    // Default Single Column
    return (
      <div className="flex flex-col gap-4">
        {content.map((item, index) => {
          if (item.type === 'section') {
            return (
              <div key={index} className={cn('flex flex-col gap-4', item.className)}>
                {item.title && <h4 className="font-semibold text-foreground">{item.title}</h4>}
                {item.rows.map((row, rIdx) => renderRow(row, rIdx))}
              </div>
            )
          } else {
            return renderRow(item, index)
          }
        })}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('max-h-[90vh] flex flex-col p-0 gap-0', maxWidth, className)}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-6 max-h-[calc(90vh-130px)] overflow-y-auto">{renderContent()}</div>

        {(footer || footer === undefined) && (
          <DialogFooter className="p-6 pt-4 border-t bg-muted/10">
            {footer?.customActions}

            <div className="flex gap-2 ml-auto">
              {!footer?.hideCancel && (
                <Button onClick={footer?.onCancel || onClose}>{footer?.cancelText || 'Скасувати'}</Button>
              )}
              {!footer?.hideConfirm && (
                <Button onClick={footer?.onConfirm} variant="primary">
                  {footer?.confirmText || 'Зберегти'}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
