import { MoreHorizontal, Save, Trash2, Plus } from "lucide-react"
import { useState } from "react"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "./lib/utils"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Checkbox } from "./components/ui/checkbox"
import CounterpartiesPage from "./components/custom/counterparties.tsx"
import { ConfigurableTable } from "./components/custom/configurable-table.tsx"
import { data, columns } from "./components/custom/table-config.tsx"
import type { DynamicToolbarProps } from "./components/custom/dynamic-toolbar.tsx"
import { Link } from "react-router"

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
    <>
      {/* <Layout> */}
      <ConfigurableTable
        data={data}
        columns={columns}
        tabs={tabs}
        topToolbar={topToolbarConfig}
        innerToolbar={{ items: topToolbarConfig.items }}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {/* </Layout> */}

      {/* <div>
        <div className="space-x-2 space-y-2 p-4">
          <Button variant="default">Створити</Button>
          <Button variant="default" disabled>
            Створити
          </Button>

          <Button variant="primary">ОК</Button>
          <Button variant="primary">Записати</Button>
          <Button variant="primary" disabled>
            Записати
          </Button>

          <Button variant="default">...</Button>
          <Button variant="default">
            <MoreHorizontal className="w-4 h-4 mr-1" />
            Ще
          </Button>

          <Button variant="primary">
            <Save className="w-4 h-4 mr-1" />
            Записати і закрити
          </Button>

          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-1" />
            Видалити
          </Button>

          <Button variant="link">Детально</Button>
        </div>

        <div className="space-y-3 p-4 text-sm max-w-md">
          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Найменування:</Label>
            <Input placeholder="Введіть назву..." className="flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Тип контрагента:</Label>
            <Input value="Постачальник" readOnly className="flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">ЄДРПОУ:</Label>
            <Input placeholder="12345678" className="w-32" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Адреса:</Label>
            <Input placeholder="вул. Хрещатик, 1" className="flex-1" />
          </div>

          <div className="flex items-start gap-3">
            <Label className="w-32 text-right pt-1 truncate">Банківські реквізити:</Label>
            <textarea
              className={cn(
                "flex w-full min-h-16 px-2 py-1 text-sm bg-white border border-neutral-800 rounded-sm",
                "focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                "resize-none"
              )}
              placeholder="МФО, рахунок..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Статус:</Label>
            <Input value="Неактивний" disabled className="flex-1" />
          </div>
        </div>

        <div className="space-y-4 p-4 max-w-md text-sm">
          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Найменування*:</Label>
            <Input required placeholder="Обов’язкове поле" className="flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Код*:</Label>
            <Input required value="12345" className="flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">ЄДРПОУ:</Label>
            <Input error placeholder="Невірний формат" className="flex-1" />
          </div>

          <div className="flex items-center gap-3">
            <Label className="w-32 text-right">Адреса:</Label>
            <Input placeholder="Необов’язково" className="flex-1" />
          </div>
        </div>

        <Checkbox />

        <div>
          <hr className="my-4" />
          <hr className="my-4" />
          <div className="w-100 h-10 bg-success-secondary">1</div>
          <div className="w-100 h-10 bg-success-primary">1</div>
          <div className="w-100 h-10 bg-[#0066CC]">1</div>

          <hr className="my-4" />
          <hr className="my-4" />
          <div className="w-100 h-10 bg-primary-100">100</div>
          <div className="w-100 h-10 bg-primary-200">200</div>
          <div className="w-100 h-10 bg-primary-300">300</div>
          <div className="w-100 h-10 bg-primary-400">400</div>
          <div className="w-100 h-10 bg-primary-500">500</div>
          <div className="w-100 h-10 bg-primary-600">600</div>
          <div className="w-100 h-10 bg-primary-700">700</div>
          <div className="w-100 h-10 bg-primary-800">800</div>
          <div className="w-100 h-10 bg-primary-900">900</div>

          <hr className="my-4" />
          <hr className="my-4" />
          <div className="w-100 h-10 bg-neutral-100">1</div>
          <div className="w-100 h-10 bg-neutral-200">1</div>
          <div className="w-100 h-10 bg-neutral-300">1</div>
          <div className="w-100 h-10 bg-neutral-400">1</div>
          <div className="w-100 h-10 bg-neutral-500">1</div>
          <div className="w-100 h-10 bg-neutral-600">1</div>
          <div className="w-100 h-10 bg-neutral-700">1</div>
          <div className="w-100 h-10 bg-neutral-800">1</div>
          <div className="w-100 h-10 bg-neutral-900">1</div>

          <hr className="my-4" />
          <hr className="my-4" />
          <div className="w-100 h-10 bg-destructive-100">1</div>
          <div className="w-100 h-10 bg-destructive-200">2</div>
          <div className="w-100 h-10 bg-destructive-300">3</div>
          <div className="w-100 h-10 bg-destructive-400">4</div>
          <div className="w-100 h-10 bg-destructive-500">5</div>
          <div className="w-100 h-10 bg-destructive-600">6</div>
          <div className="w-100 h-10 bg-destructive-700">7</div>
          <div className="w-100 h-10 bg-destructive-800">8</div>
          <div className="w-100 h-10 bg-destructive-900">9</div>

          <hr className="my-4" />
          <hr className="my-4" />
          <br />
        </div>
      </div> */}
    </>
  )
}

export default App
