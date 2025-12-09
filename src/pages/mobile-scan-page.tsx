import { useEffect, useState } from "react"
import BarcodeScanner from "react-qr-barcode-scanner"
import { useScanStore } from "../stores/scan.store"
import { useAuthStore } from "../stores/auth.store"

const MobileScanPage = () => {
  const { connect, disconnect, sendScanData, checkStatus, pcStatus, isConnected } = useScanStore()
  const user = useAuthStore((state) => state.user)
  const [scanError, setScanError] = useState<string | null>(null)

  useEffect(() => {
    connect()
    // Check PC status periodically
    const interval = setInterval(() => {
      checkStatus()
    }, 2000)

    return () => {
      clearInterval(interval)
      disconnect()
    }
  }, [connect, disconnect, checkStatus])

  const handleScan = (result: any) => {
    if (!result) return

    try {
      // Parse the QR code data
      const scannedData = JSON.parse(result.text)

      // Validate expected structure
      if (!scannedData.code || !scannedData.counterpartyId || !scannedData.count || !scannedData.totalPrice) {
        setScanError("Невірний формат QR коду")
        return
      }

      // Send data via WebSocket
      sendScanData(scannedData)
      setScanError(null)

      // Show success message
      alert("Дані надіслано на PC")
    } catch (error) {
      setScanError("Помилка сканування")
      console.error("Scan error:", error)
    }
  }

  const isPcReady = pcStatus?.location?.includes("/receiving-docs") && pcStatus?.location?.includes("tab=expected-deliveries")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Сканування накладної</h1>

        {!isConnected && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Підключення до сервера...
          </div>
        )}

        {isConnected && !isPcReady && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Увага!</p>
            <p>Відкрийте на PC сторінку:</p>
            <p className="font-mono text-sm">{"Документи прийому -> Розпорядження"}</p>
            {/* <p className="font-mono text-sm">/receiving-docs?tab=expected-deliveries</p> */}
          </div>
        )}

        {isConnected && isPcReady && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✓ PC готовий до сканування
          </div>
        )}

        {scanError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{scanError}</div>}

        <div className="flex justify-center mb-4">
          <BarcodeScanner
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result && isPcReady) {
                handleScan(result)
              }
            }}
            onError={(error: any) => {
              if (error?.name === "NotAllowedError") {
                setScanError("Доступ до камери заборонено")
              }
            }}
          />
        </div>

        <p className="text-sm text-gray-600 text-center">Користувач: {user?.full_name || "Unknown"}</p>
      </div>
    </div>
  )
}

export default MobileScanPage
