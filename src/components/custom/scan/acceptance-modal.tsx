import { useState } from "react"
import { TemplateModal } from "../template-modal/template-modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

interface AcceptanceModalProps {
  isOpen: boolean
  onClose: () => void
  item: any // Should be typed properly with DocumentItem
  onAccept: (qty?: number) => void
  onDiscrepancy: () => void
}

export const AcceptanceModal = ({ isOpen, onClose, item, onAccept, onDiscrepancy }: AcceptanceModalProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])

  // Helper to toggle photo selection
  const togglePhoto = (photoId: number) => {
    setSelectedPhotos((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  const p = item.medicalProduct
  const productName = `${p.name} ${p.dosage_value || ""}${p.dosage_unit} (${p.form})`

  return (
    <TemplateModal
      title="Перевірка товару"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl"
      content={[
        {
          type: "section",
          rows: [
            {
              type: "row",
              cols: 2,
              items: [
                {
                  type: "custom",
                  label: "Назва",
                  content: <div className="font-medium text-lg">{productName}</div>,
                },
                {
                  type: "custom",
                  label: "Штрихкод",
                  content: <div className="font-medium">{item.barcode || "—"}</div>,
                },
              ],
            },
            {
              type: "row",
              cols: 2,
              items: [
                {
                  type: "custom",
                  label: "Серія (очікувана)",
                  content: <div className="font-medium text-blue-600">{item.batch_number}</div>,
                },
                {
                  type: "custom",
                  label: "Термін придатності",
                  content: (
                    <div className="font-medium">{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "—"}</div>
                  ),
                },
              ],
            },
            {
              type: "row",
              cols: 2,
              items: [
                {
                  type: "custom",
                  label: "Ціна закупівлі",
                  content: <div className="font-medium">{Number(item.price).toFixed(2)} грн</div>,
                },
                {
                  type: "custom",
                  label: "Кількість (очікувано)",
                  content: <div className="font-medium">{item.quantity_expected}</div>,
                },
              ],
            },
          ],
        },
        {
          type: "section",
          title: "Фото упаковки",
          rows: [
            {
              type: "row",
              items: [
                {
                  type: "custom",
                  content:
                    p.photos && p.photos.length > 0 ? (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <Carousel className="w-full max-w-md mx-auto">
                          <CarouselContent>
                            {p.photos.map((photo: any) => (
                              <CarouselItem key={photo.id} className="basis-1/2 md:basis-1/3">
                                <div
                                  className={`p-1 border-2 rounded-lg cursor-pointer transition-all ${
                                    selectedPhotos.includes(photo.id) ? "border-primary shadow-md" : "border-transparent"
                                  }`}
                                  onClick={() => togglePhoto(photo.id)}
                                >
                                  <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-2 relative">
                                      <img
                                        src={`http://localhost:7777${photo.filePath}`}
                                        alt="Product"
                                        className="object-cover w-full h-full rounded"
                                      />
                                      <Checkbox checked={selectedPhotos.includes(photo.id)} className="absolute top-2 right-2" />
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                    ) : (
                      <div className="text-gray-500 italic text-center py-4 bg-gray-50 rounded">Фото відсутні</div>
                    ),
                },
              ],
            },
          ],
        },
      ]}
      footer={{
        confirmText: `Прийняти${selectedPhotos.length > 0 ? ` (${selectedPhotos.length})` : " всі"}`,
        onConfirm: () => {
          const qtyToAccept = selectedPhotos.length > 0 ? selectedPhotos.length : item.quantity_expected - item.quantity_scanned
          onAccept(qtyToAccept)
        },
        onCancel: onClose,
        customActions: (
          <Button variant="destructive" onClick={onDiscrepancy} className="mr-auto">
            Зафіксувати невідповідність
          </Button>
        ),
      }}
    />
  )
}
