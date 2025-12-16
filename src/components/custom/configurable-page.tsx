import { useSearchParams } from "react-router"
import { type ColumnDef } from "@tanstack/react-table"
import {
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useCallback,
  type ReactNode,
  useMemo,
  forwardRef,
  useImperativeHandle,
  type ForwardedRef,
} from "react"

import { TemplateTable } from "./template-table"
import { type TableAction } from "./table-actions"
import { EntityFormModal, type FormFieldConfig } from "./entity-form-modal"
import pencilIcon from "../../assets/icons/pencil.svg"
import rotateIcon from "../../assets/icons/rotate.svg"
import excludeIcon from "../../assets/icons/exclude.svg"
import fileCopyIcon from "../../assets/icons/file-copy.svg"
import circlePlusIcon from "../../assets/icons/circle-plus.svg"
import fileExcludeIcon from "../../assets/icons/file-exclude.svg"
import { DynamicToolbar, type DynamicToolbarProps } from "./dynamic-toolbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface TabConfig<TData = any> {
  value: string
  label: string
  data?: TData[]
  columns?: ColumnDef<TData>[]
  formFields?: FormFieldConfig[]
  innerToolbar?: DynamicToolbarProps
}

export type ActionId = "create" | "copy" | "edit" | "mark_delete" | "delete" | "refresh"

export type CustomActionHandler<TData> = (row: TData | null, data: TData[]) => boolean | void

export interface ConfigurablePageProps<TData> {
  data?: TData[]
  columns?: ColumnDef<TData>[]
  formFields?: FormFieldConfig[]
  topToolbar?: DynamicToolbarProps
  innerToolbar?: DynamicToolbarProps
  tabs?: TabConfig<any>[]
  onRowSelect?: (row: TData) => void
  globalFilter?: string
  setGlobalFilter?: Dispatch<SetStateAction<string>>
  defaultTab?: string
  onAction?: (action: string, row: TData | null, data: TData[]) => void
  /** Custom action handlers that override default behavior. Return false to prevent default action. */
  customActions?: Partial<Record<ActionId, CustomActionHandler<TData>>>
  isLoading?: boolean
  children?: ReactNode
  onEntitySave?: (data: TData, mode: "create" | "edit" | "copy") => Promise<void> | void
}

export interface ConfigurablePageRef {
  openModal: (mode: "create" | "edit" | "copy") => void
}

function deriveFormFields(columns: ColumnDef<any>[]): FormFieldConfig[] {
  return columns
    .filter((col) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (col as any).meta as any
      return !!(col as any).accessorKey && !meta?.form?.hidden
    })
    .map((col) => {
      const accessorKey = (col as any).accessorKey
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (col as any).meta as any
      const header = (col as any).header

      return {
        name: accessorKey,
        label: typeof header === "string" ? header : accessorKey,
        type: meta?.form?.type || "text",
        options: meta?.form?.options,
        onSearch: meta?.form?.onSearch,
        placeholder: meta?.form?.placeholder,
        description: meta?.form?.description,
        required: meta?.form?.required,
        disabled: meta?.form?.disabled,
        readonly: meta?.form?.readonly,
      }
    })
}

function ConfigurablePageInternal<TData>(
  {
    data: defaultData = [],
    columns: defaultColumns = [],
    formFields,
    topToolbar,
    innerToolbar: defaultInnerToolbar,
    tabs,
    onRowSelect,
    globalFilter = "",
    setGlobalFilter,
    defaultTab,
    onAction,
    customActions,
    isLoading = false,
    children,
    onEntitySave,
  }: ConfigurablePageProps<TData>,
  ref: ForwardedRef<ConfigurablePageRef>,
) {
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [markedRows, setMarkedRows] = useState<Set<any>>(new Set())
  // Local data state to support deletion
  const [tableData, setTableData] = useState<any[]>(defaultData)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "copy">("create")

  useImperativeHandle(ref, () => ({
    openModal: (mode) => {
      setModalMode(mode)
      setModalOpen(true)
    },
  }))

  // Update local data when prop data changes
  useEffect(() => {
    setTableData(defaultData)
  }, [defaultData])

  const currentTab = searchParams.get("tab") || defaultTab || tabs?.[0]?.value
  const activeTabConfig = tabs?.find((t) => t.value === currentTab)
  const activeTab = activeTabConfig ? currentTab : tabs?.[0]?.value

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("tab", value)
      return newParams
    })
  }

  // Derive form fields based on current context
  const activeFormFields = useMemo(() => {
    if (activeTabConfig?.formFields) return activeTabConfig.formFields
    if (activeTabConfig?.columns) return deriveFormFields(activeTabConfig.columns)
    if (formFields) return formFields
    return deriveFormFields(defaultColumns)
  }, [activeTabConfig, formFields, defaultColumns])

  // Auto-select first row on load or tab change, or if selection is invalid for current tab
  useEffect(() => {
    const currentData = activeTabConfig?.data || tableData

    // If there is data
    if (currentData.length > 0) {
      // If no row is selected OR the selected row is not in the current data (e.g. switched tabs)
      if (!selectedRow || !currentData.includes(selectedRow)) {
        setSelectedRow(currentData[0])
      }
    } else {
      // If no data, clear selection
      setSelectedRow(null)
    }
  }, [tableData, selectedRow, activeTabConfig, tabs])

  // Reset marked rows when tab changes
  useEffect(() => {
    setMarkedRows(new Set())
  }, [activeTab])

  const handleSave = async (newData: TData) => {
    if (onEntitySave) {
      await onEntitySave(newData, modalMode)
    }

    if (modalMode === "create" || modalMode === "copy") {
      setTableData((prev) => [...prev, newData])
    } else if (modalMode === "edit" && selectedRow) {
      setTableData((prev) => prev.map((row) => (row === selectedRow ? newData : row)))
      setSelectedRow(newData) // Update selection to new data
    }
  }

  const handleAction = useCallback(
    (actionId: string) => {
      // Check for custom action handler first
      const customHandler = customActions?.[actionId as ActionId]
      if (customHandler) {
        const result = customHandler(selectedRow, tableData)
        // If custom handler returns false, skip default behavior
        if (result === false) return
      }

      // Call onAction callback for backwards compatibility
      if (onAction) {
        onAction(actionId, selectedRow, tableData)
      }

      // Default behavior
      switch (actionId) {
        case "create":
          setModalMode("create")
          setModalOpen(true)
          break
        case "copy":
          setModalMode("copy")
          setModalOpen(true)
          break
        case "edit":
          setModalMode("edit")
          setModalOpen(true)
          break
        case "mark_delete":
          if (selectedRow) {
            setMarkedRows((prev) => {
              const next = new Set(prev)
              if (next.has(selectedRow)) {
                next.delete(selectedRow)
              } else {
                next.add(selectedRow)
              }
              return next
            })
          }
          break
        case "delete":
          if (markedRows.size > 0) {
            setTableData((prev) => prev.filter((row) => !markedRows.has(row)))
            setMarkedRows(new Set())
          } else if (selectedRow) {
            setTableData((prev) => prev.filter((row) => row !== selectedRow))
            setSelectedRow(null)
          }
          break
        case "refresh":
          window.location.reload()
          break
      }
    },
    [selectedRow, tableData, markedRows, onAction, customActions],
  )

  const defaultActions: TableAction[] = [
    {
      id: "create",
      label: "Створити",
      icon: <img width={16} src={circlePlusIcon} alt="create" />,
      shortcut: "Ins",
      onClick: () => handleAction("create"),
    },
    {
      id: "copy",
      label: "Скопіювати",
      icon: <img width={16} src={fileCopyIcon} alt="copy" />,
      shortcut: "F9",
      onClick: () => handleAction("copy"),
      disabled: !selectedRow,
    },
    {
      id: "edit",
      label: "Змінити",
      icon: <img width={16} src={pencilIcon} alt="edit" />,
      shortcut: "F2",
      onClick: () => handleAction("edit"),
      disabled: !selectedRow,
    },
    {
      id: "mark_delete",
      label: "Відмітити для вилучення / Зняти позначку",
      icon: <img width={16} src={fileExcludeIcon} alt="mark" />,
      shortcut: "Del",
      onClick: () => handleAction("mark_delete"),
      disabled: !selectedRow,
    },
    {
      id: "delete",
      label: "Вилучити",
      icon: <img width={16} src={excludeIcon} alt="delete" />,
      shortcut: "Shift+Del",
      onClick: () => handleAction("delete"),
      disabled: !selectedRow && markedRows.size === 0,
    },
    {
      id: "refresh",
      label: "Оновити",
      icon: <img width={16} src={rotateIcon} alt="refresh" />,
      shortcut: "F5",
      onClick: () => handleAction("refresh"),
    },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Insert") handleAction("create")
      if (e.key === "F9") handleAction("copy")
      if (e.key === "F2") handleAction("edit")
      if (e.key === "Delete" && !e.shiftKey) handleAction("mark_delete")
      if (e.key === "Delete" && e.shiftKey) handleAction("delete")
      if (e.key === "F5") {
        e.preventDefault()
        handleAction("refresh")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleAction])

  // Helper to render the table content
  const renderTableContent = (data: any[], columns: ColumnDef<any>[], toolbarConfig?: DynamicToolbarProps) => {
    const visibleColumns = columns.filter((col) => !(col.meta as any)?.hideInTable)

    return (
      <div className="flex-1 flex flex-col min-h-0 gap-2">
        {toolbarConfig && (
          <DynamicToolbar {...toolbarConfig} actions={defaultActions} actionsMenuDisabled={!selectedRow} />
        )}

        {!!visibleColumns.length && (
          <TemplateTable
            columns={visibleColumns}
            data={data}
            selectedRow={selectedRow}
            onRowSelect={(row) => {
              setSelectedRow(row)
              onRowSelect?.(row)
            }}
            pageSizeOptions={[20, 50, 100]}
            defaultPageSize={20}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            actions={defaultActions}
            markedRows={markedRows}
            isLoading={isLoading}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <EntityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        defaultValues={modalMode === "create" ? null : selectedRow}
        onSave={handleSave}
        fields={activeFormFields}
        isLoading={isLoading}
      />

      <div className="h-full flex flex-col">
        {topToolbar && (
          <DynamicToolbar
            {...topToolbar}
            className="mb-2"
            actions={defaultActions}
            actionsMenuDisabled={!selectedRow}
          />
        )}

        {children ? (
          <div className="flex-1 flex flex-col min-h-0 p-4 overflow-auto">{children}</div>
        ) : tabs && tabs.length > 0 ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
            <TabsList className="relative top-[1px]">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="flex-1 flex flex-col min-h-0 mt-0 pt-4">
                {renderTableContent(
                  tab.data || tableData,
                  tab.columns || defaultColumns,
                  tab.innerToolbar || defaultInnerToolbar,
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {renderTableContent(tableData, defaultColumns, defaultInnerToolbar)}
          </div>
        )}
      </div>
    </>
  )
}

// Fixed forwardRef type assertion
export const ConfigurablePage = forwardRef(ConfigurablePageInternal) as <TData>(
  props: ConfigurablePageProps<TData> & { ref?: ForwardedRef<ConfigurablePageRef> },
) => ReturnType<typeof ConfigurablePageInternal>
