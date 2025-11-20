import { useState, type Dispatch, type SetStateAction } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateTable } from "./template-table"
import { DynamicToolbar, type DynamicToolbarProps } from "./dynamic-toolbar"
import { type ColumnDef } from "@tanstack/react-table"
import { useSearchParams } from "react-router"

export interface TabConfig<TData> {
  value: string
  label: string
  data?: TData[]
  columns?: ColumnDef<TData>[]
  innerToolbar?: DynamicToolbarProps
}

export interface ConfigurableTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  topToolbar?: DynamicToolbarProps
  innerToolbar?: DynamicToolbarProps
  tabs?: TabConfig<TData>[]
  onRowSelect?: (row: TData) => void
  globalFilter?: string
  setGlobalFilter: Dispatch<SetStateAction<string>>
  defaultTab?: string
}

export function ConfigurableTable<TData>({
  data: defaultData,
  columns: defaultColumns,
  topToolbar,
  innerToolbar: defaultInnerToolbar,
  tabs,
  onRowSelect,
  globalFilter = "",
  setGlobalFilter,
  defaultTab,
}: ConfigurableTableProps<TData>) {
  const [selectedRow, setSelectedRow] = useState<TData | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const currentTab = searchParams.get("tab") || defaultTab || tabs?.[0]?.value

  // Ensure the current tab is valid, otherwise fallback to the first tab
  const activeTab = tabs?.find((t) => t.value === currentTab) ? currentTab : tabs?.[0]?.value

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set("tab", value)
      return newParams
    })
  }

  // Helper to render the table content
  const renderTableContent = (data: TData[], columns: ColumnDef<TData>[], toolbarConfig?: DynamicToolbarProps) => (
    <div className="flex-1 flex flex-col gap-2 overflow-hidden">
      {toolbarConfig && <DynamicToolbar {...toolbarConfig} />}
      <TemplateTable
        columns={columns}
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
      />
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      {topToolbar && <DynamicToolbar {...topToolbar} className="mb-2" />}

      {tabs && tabs.length > 0 ? (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="relative top-[1px]">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="flex-1 flex flex-col mt-0 pt-4 overflow-hidden">
              {renderTableContent(
                tab.data || defaultData,
                tab.columns || defaultColumns,
                tab.innerToolbar || defaultInnerToolbar
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex-1 h-full">{renderTableContent(defaultData, defaultColumns, defaultInnerToolbar)}</div>
      )}
    </div>
  )
}
