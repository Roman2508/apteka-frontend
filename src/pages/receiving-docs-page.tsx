import { io } from 'socket.io-client'
import { useState, useEffect, useCallback } from 'react'

import editIcon from '../assets/icons/pencil.svg'
import refreshIcon from '../assets/icons/rotate.svg'
import createIcon from '../assets/icons/file-copy.svg'
import { ConfigurablePage } from '../components/custom/configurable-page.tsx'
import type { DynamicToolbarProps } from '../components/custom/dynamic-toolbar.tsx'
import { data as initialData, columns } from '../components/custom/table-config.tsx'
import {
  inboundDocumentsTableColumns,
  data as inboundDocumentsTableData,
} from '../components/common/receiving-docs-page/inbound-documents-table-config.tsx'
import {
  expectedDeliveriesTableColumns,
  data as expectedDeliveriesTableData,
} from '@/components/common/receiving-docs-page/expected-deliveries-table-config.tsx'
import { TemplateModal } from '@/components/custom/template-modal/template-modal.tsx'
import type { ModalContentItem } from '@/components/custom/template-modal/template-modal.types.ts'
import { useScanner } from '@/hooks/useScanner.ts'

const ReceivingDocsPage = () => {
  const [globalFilter, setGlobalFilter] = useState('')
  const [tableData, setTableData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({ status: '', date: '' })
  const [openModal, setOpenModal] = useState<'scan' | 'check' | null>(null)
  const [scanModalData, setScanModalData] = useState<{ counterparty: Number; docNumber: string }>({
    counterparty: 0,
    docNumber: '',
  })

  // --- Modal content ---
  const modalContent: ModalContentItem[] = [
    {
      type: 'row',
      items: [
        {
          type: 'custom',
          label: '',
          content: (
            <div className="border border-dashed px-4 py-10 text-center text-[13px] bg-neutral-100">
              Очікується сканування накладної...
            </div>
          ),
        },
        // { type: 'input', label: 'Name', content: <Input placeholder="Enter name" /> },
        // { type: 'input', label: 'Email', content: <Input placeholder="Enter email" /> },
      ],
    },
    {
      type: 'row',
      cols: 2,
      items: [
        // { type: 'input', label: 'City', content: <Input placeholder="City" /> },
        // { type: 'input', label: 'Zip', content: <Input placeholder="Zip" /> },
      ],
    },
  ]

  // Mock backend request
  const mockFetchData = useCallback(async (currentFilters: typeof filters) => {
    setIsLoading(true)
    console.log('Fetching data with filters:', currentFilters)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate filtering
    let filtered = [...initialData]
    if (currentFilters.status) {
      filtered = filtered.filter((item) =>
        (item as any).status?.toLowerCase().includes(currentFilters.status.toLowerCase())
      )
    }
    // Add more mock filtering logic here if needed

    setTableData(filtered)
    setIsLoading(false)
  }, [])

  // Initial load and filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      mockFetchData(filters)
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [filters, mockFetchData])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const topToolbarConfig: DynamicToolbarProps = {
    title: 'Документи прийому',
    hideActionsMenu: true,
  }

  const innerToolbarConfig: DynamicToolbarProps = {
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: 'Пошук (Shift+F)',
    },
    items: [
      [
        {
          label: '',
          icon: <img src={createIcon} className="w-4 h-4" />,
          onClick: () => alert('Створити clicked'),
          variant: 'default',
        },
        {
          label: '',
          icon: <img src={editIcon} className="w-4 h-4" />,
          onClick: () => alert('Створити clicked'),
          variant: 'default',
        },
        {
          label: '',
          icon: <img src={refreshIcon} className="w-4 h-4" />,
          onClick: () => alert('Створити clicked'),
          variant: 'default',
        },
        {
          label: 'Товар в аптеці',
          //   icon: null,
          onClick: () => alert('Записати clicked'),
          variant: 'default',
        },
        {
          label: 'Розміщення',
          //   icon: null,
          onClick: () => alert('Записати clicked'),
          variant: 'default',
        },
      ],
    ],
  }

  const receivingDocsInnerToolbarConfig: DynamicToolbarProps = {
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: 'Пошук (Shift+F)',
    },
    items: [
      [
        {
          label: 'Сканувати накладну',
          onClick: () => setOpenModal('scan'),
          variant: 'primary',
        },
        {
          label: 'Перевірити документ',
          onClick: () => alert('Записати clicked'),
          variant: 'default',
        },
      ],
    ],
    // hideActionsMenu: true,
  }

  const tabs = [
    {
      value: 'inbound-documents',
      label: 'Документи надходження',
      data: inboundDocumentsTableData,
      columns: inboundDocumentsTableColumns,
    },
    {
      value: 'expected-deliveries',
      label: 'Розпорядження',
      data: expectedDeliveriesTableData,
      columns: expectedDeliveriesTableColumns,
      innerToolbar: receivingDocsInnerToolbarConfig,
    },
    { value: 'quality-issues', label: 'Акти невідповідності', data: tableData, columns: columns },
  ]

  const SOCKET_URL = 'http://localhost:3000'

  const documentId = '12345' // Приклад documentId для підключення сокета

  const socket = io(SOCKET_URL, { query: { documentId } })

  const { scannedCode, reset } = useScanner({
    minLength: 13, // Для EAN-13
    socket, // Передаємо сокет
    socketEventName: 'mobile-scan', // Назва події з бекенду (наприклад, 'mobile-scan')
    onError: (err) => console.error(err),
  })

  // Твоя логіка після скану
  useEffect(() => {
    if (scannedCode) {
      console.log('Обробка скану:', scannedCode)
      // Тут: scanItem(documentId, scannedCode)
      // Після обробки: reset() для очищення
    }
  }, [scannedCode, documentId])

  const handleScan = () => {
    alert('Сканування накладної...')
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      if (e.key === 'Enter') {
        handleScan()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleScan])

  return (
    <>
      <TemplateModal
        isOpen={openModal === 'scan'}
        onClose={() => setOpenModal(null)}
        title="Сканування накладної"
        content={modalContent}
        footer={{
          onConfirm: () => {
            alert('Saved!')
            setOpenModal(null)
          },
        }}
      />

      <div className="h-[calc(100vh-65px)] flex flex-col">
        <ConfigurablePage
          data={tableData}
          columns={columns}
          tabs={tabs}
          topToolbar={topToolbarConfig}
          innerToolbar={innerToolbarConfig}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

export default ReceivingDocsPage
