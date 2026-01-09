import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UsbScanModalProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (data: any) => void
}

export const UsbScanModal = ({ isOpen, onClose, onScanComplete }: UsbScanModalProps) => {
  const [scanBuffer, setScanBuffer] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const data = JSON.parse(scanBuffer)
        onScanComplete(data)
        setScanBuffer("")
        onClose()
      } catch (error) {
        alert("Невірний формат даних")
        setScanBuffer("")
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Сканування накладної</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Підготуйте сканер та відскануйте QR код</p>
          <div className="h-2 w-2 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={scanBuffer}
          onChange={(e) => setScanBuffer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute h-0"
          autoFocus
        />

        <Button onClick={onClose} variant="outline" className="w-full">
          Скасувати
        </Button>
      </div>
    </div>
  )
}
