import { useEffect, useRef, useState, useCallback } from 'react'
import { Socket } from 'socket.io-client' // Або імпорт з твоєї socket-бібліотеки (наприклад, socket.io-client)

interface UseScannerOptions {
  minLength?: number // Мінімальна довжина коду (для штрихкодів EAN-13 = 13)
  timeThreshold?: number // Максимальний інтервал між символами (мс) — сканери "б'ють" < 50мс
  socket?: Socket | null // Опціональний сокет для отримання сканів з телефону
  socketEventName?: string // Назва події сокета (default: 'scan')
  onError?: (error: string) => void // Обробка помилок
}

export const useScanner = (options: UseScannerOptions = {}) => {
  const { minLength = 8, timeThreshold = 50, socket = null, socketEventName = 'scan', onError } = options

  const [scannedCode, setScannedCode] = useState<string | null>(null) // Твій useState для коду
  const buffer = useRef<string>('') // Буфер для ключів зі сканера
  const lastKeyTime = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)
  // const soundRef = useRef<Howl | null>(null); // Якщо хочеш звук, розкоментуй і додай Howler

  // Функція обробки скану (з будь-якого джерела)
  const handleScan = useCallback(
    (code: string) => {
      const trimmedCode = code.trim()
      if (trimmedCode.length < minLength) {
        if (onError) onError(`Код занадто короткий: ${trimmedCode.length} символів`)
        return
      }

      setScannedCode(trimmedCode) // Переносимо в state
      console.log('Проскановано:', trimmedCode) // Для дебагу

      // Тут твоя логіка: наприклад, API-запит або оновлення накладної
      // e.g., scanItem(documentId, trimmedCode);
    },
    [minLength, onError]
  )

  // Обробник keydown для ручного сканера
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ігноруємо, якщо фокус на input/textarea/select (щоб не переносити в текстове поле)
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return
      }

      const now = Date.now()
      const key = e.key

      // Якщо символ (не Enter тощо)
      if (key.length === 1 && !['Enter', 'Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(key)) {
        // Перевіряємо швидкість: якщо пауза > timeThreshold, скидаємо (ручне введення)
        if (now - lastKeyTime.current > timeThreshold) {
          buffer.current = ''
        }

        buffer.current += key
        lastKeyTime.current = now

        // Ставимо таймаут на кінець скану (якщо немає Enter)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          handleScan(buffer.current)
          buffer.current = ''
        }, timeThreshold * 2) // Подвійний інтервал для безпеки
      }

      // Якщо Enter — завершуємо негайно
      if (key === 'Enter' && buffer.current.length > 0) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        handleScan(buffer.current)
        buffer.current = ''
        e.preventDefault() // Запобігаємо дефолтній поведінці Enter
      }
    },
    [handleScan, timeThreshold]
  )

  // Підключення keydown
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [handleKeyDown])

  // Підключення сокета для сканів з телефону
  useEffect(() => {
    if (!socket) return

    const socketHandler = (data: { code: string }) => {
      if (data && data.code) {
        handleScan(data.code) // Той самий handleScan для сокета
      } else {
        if (onError) onError('Невірні дані з сокета')
      }
    }

    socket.on(socketEventName, socketHandler)

    return () => {
      socket.off(socketEventName, socketHandler)
    }
  }, [socket, socketEventName, handleScan, onError])

  return {
    scannedCode, // Поточний код
    setScannedCode, // Setter для ручного керування (якщо потрібно)
    reset: () => {
      setScannedCode(null)
      buffer.current = ''
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
  }
}

/* USAGE EXAMPLE: */
/* USAGE EXAMPLE: */
/* USAGE EXAMPLE: */

// import React from 'react'
// import { useScanHook } from '../hooks/useScanHook'
// import { io } from 'socket.io-client' // Приклад підключення сокета

// const SOCKET_URL = 'http://localhost:3000' // Твій NestJS сервер

// const IncomingScanPage: React.FC<{ documentId: string }> = ({ documentId }) => {
//   const socket = io(SOCKET_URL, { query: { documentId } }) // Підключаємо сокет з параметрами

//   const { scannedCode, reset } = useScanHook({
//     minLength: 13, // Для EAN-13
//     socket, // Передаємо сокет
//     socketEventName: 'mobile-scan', // Назва події з бекенду (наприклад, 'mobile-scan')
//     onError: (err) => console.error(err),
//   })

//   // Твоя логіка після скану
//   React.useEffect(() => {
//     if (scannedCode) {
//       console.log('Обробка скану:', scannedCode)
//       // Тут: scanItem(documentId, scannedCode)
//       // Після обробки: reset() для очищення
//     }
//   }, [scannedCode, documentId])

//   return (
//     <div>
//       <h2>Скануйте товари</h2>
//       <p>Останній код: {scannedCode || '—'}</p>
//       <button onClick={reset}>Очистити</button>
//     </div>
//   )
// }
