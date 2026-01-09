import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CreateDocumentDto } from "@/hooks/api/use-documents"

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  data: CreateDocumentDto
  // data: {
  //   code: string
  //   counterpartyId: string
  //   count: number
  //   totalPrice: number
  // }
  onSave: () => void
}

/*
QR CODE DATA EXAMPLE (не актуально):
{
  "code": "00006894",
  "counterpartyId": "ТОВ БаДМ",
  "count": 4,
  "totalPrice": 1355
}
*/

/* QR CODE DATA EXAMPLE:
  {
    "code": 2485353,
    "counterpartyId": 1,
    "counterpartyName": "ТОВ БаДМ",
    "count": 4,
    "totalPrice": 1300,
    "userId": 4,
    "items": [
      {
        "id": 1, === product id
        "count": 4,
        "price": 1300,
        "expiry_date": "12.12.2027",
        "bartcode": "44839438934",
        "batch_number": "132"
        "batchId": 1
      }
    ]
  } */

export const VerificationModal = ({ isOpen, onClose, data, onSave }: VerificationModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Перевірка даних накладної</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">№ накладної</label>
            <Input value={data.code} readOnly className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Контрагент</label>
            <Input value={data.counterpartyName} readOnly className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Кількість найменувань</label>
            <Input value={data.count} readOnly className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Загальна сума</label>
            <Input value={data.totalPrice.toFixed(2)} readOnly className="mt-1" />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Скасувати
          </Button>

          <Button onClick={onSave} variant="primary" className="flex-1">
            Зберегти
          </Button>
        </div>
      </div>
    </div>
  )
}
