import { useState } from "react"
import { Plus } from "lucide-react"
import { Link } from "react-router"

import { Label } from "./components/ui/label"
import { Checkbox } from "./components/ui/checkbox"
import { data, columns } from "./components/custom/table-config.tsx"
import { ConfigurableTable } from "./components/custom/configurable-table.tsx"
import type { DynamicToolbarProps } from "./components/custom/dynamic-toolbar.tsx"

function App() {
  const [globalFilter, setGlobalFilter] = useState("")

  const tabs = [
    { value: "tab1", label: "Документи відвантаження" },
    { value: "tab2", label: "Переміщення товарів" },
    { value: "tab3", label: "Реалізація товарів" },
    { value: "tab4", label: "Повернення товарів" },
  ]

  const topToolbarConfig: DynamicToolbarProps = {
    title: "Документи прийому",
    search: {
      value: globalFilter,
      onChange: setGlobalFilter,
      placeholder: "Пошук (Shift+F)",
    },
    items: [
      [
        {
          label: "Створити",
          icon: <Plus className="w-3 h-3" />,
          onClick: () => alert("Створити clicked"),
          variant: "default" as const,
        },
        {
          label: "Записати в документ",
          icon: <Plus className="w-3 h-3" />,
          onClick: () => alert("Записати clicked"),
          variant: "default" as const,
        },
      ],
      [
        {
          label: "Додаткова дія 1",
          onClick: () => alert("Action 1"),
          variant: "primary" as const,
          size: "sm",
        },
        {
          type: "custom",
          content: (
            <div className="flex items-center gap-2 border border-dashed border-neutral-300 px-2 py-1 rounded-sm">
              <Checkbox id="test-checkbox" />
              <Label htmlFor="test-checkbox" className="text-xs cursor-pointer">
                Перевірити наявність
              </Label>
            </div>
          ),
        },
        {
          type: "custom",
          content: (
            <Link to="/some-link" className="text-xs text-blue-600 hover:underline">
              Посилання на документ
            </Link>
          ),
        },
      ],
    ],
  }

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col overflow-hidden">
      <ConfigurableTable
        data={data}
        columns={columns}
        tabs={tabs}
        topToolbar={topToolbarConfig}
        innerToolbar={{ items: topToolbarConfig.items }}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
    </div>
  )
}

export default App
