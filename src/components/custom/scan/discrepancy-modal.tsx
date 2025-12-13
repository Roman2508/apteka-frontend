import { useState } from "react"

import { Input } from "@/components/ui/input"
import { TemplateModal } from "../template-modal/template-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DiscrepancyModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
  onSubmit: (data: any) => void
}

const REASONS = [
  { value: "expired", label: "Прострочено" },
  { value: "damaged", label: "Пошкоджено" },
  { value: "wrong_batch", label: "Невідповідність серії" },
  { value: "wrong_product", label: "Інший товар" },
  { value: "quantity_mismatch", label: "Невідповідність кількості" },
  { value: "no_series", label: "Відсутня серія" },
  { value: "other", label: "Інше" },
]

export const DiscrepancyModal = ({ isOpen, onClose, item, onSubmit }: DiscrepancyModalProps) => {
  const [reason, setReason] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    onSubmit({
      documentItemId: item.id,
      reason,
      quantity,
      comment,
    })
  }

  return (
    <TemplateModal
      title="Фіксація невідповідності"
      isOpen={isOpen}
      onClose={onClose}
      content={[
        {
          type: "section",
          rows: [
            {
              type: "row",
              items: [
                {
                  type: "custom",
                  label: "Причина",
                  content: (
                    <Select onValueChange={setReason} value={reason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть причину" />
                      </SelectTrigger>
                      <SelectContent>
                        {REASONS.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ),
                },
              ],
            },
            {
              type: "row",
              items: [
                {
                  type: "custom",
                  label: "Кількість проблемних одиниць",
                  content: (
                    <Input
                      type="number"
                      min={1}
                      max={item.quantity_expected}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  ),
                },
              ],
            },
            {
              type: "row",
              items: [
                {
                  type: "text",
                  label: "Коментар",
                  content: <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Опишіть деталі..." />,
                },
              ],
            },
          ],
        },
      ]}
      footer={{
        confirmText: "Зафіксувати",
        onConfirm: handleSubmit,
        onCancel: onClose,
      }}
    />
  )
}
