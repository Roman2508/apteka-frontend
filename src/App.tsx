import { MoreHorizontal, Save, Trash2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { cn } from "./lib/utils";
import { Checkbox } from "./components/ui/checkbox";
import { DynamicTabs } from "./components/custom/dynamic-tabs.tsx";
import Layout from "./components/layout/layout.tsx";
import CounterpartiesPage from "./components/custom/counterparties.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function App() {
  return (
    <>
      <Layout>
        <CounterpartiesPage />
      </Layout>

      <div className="space-x-2 p-4">
        {/* Обычные кнопки */}
        <Button variant="default">Створити</Button>
        <Button variant="default" disabled>
          Створити
        </Button>

        {/* Основные */}
        <Button variant="primary">ОК</Button>
        <Button variant="primary">Записать</Button>
        <Button variant="primary" disabled>
          Записать
        </Button>

        {/* Второстепенные */}
        <Button variant="secondary">...</Button>
        <Button variant="secondary">
          <MoreHorizontal className="w-4 h-4 mr-1" />
          Ещё
        </Button>

        {/* С иконками */}
        <Button variant="primary">
          <Save className="w-4 h-4 mr-1" />
          Записать и закрыть
        </Button>

        <Button variant="destructive">
          <Trash2 className="w-4 h-4 mr-1" />
          Удалить
        </Button>

        <Button variant="link">Подробно</Button>
      </div>

      <div className="space-y-3 p-4 font-1c text-sm max-w-md">
        {/* Звичайне поле */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Найменування:</Label>
          <Input placeholder="Введіть назву..." className="flex-1" />
        </div>

        {/* Readonly (сірий фон, пунктир) */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Тип контрагента:</Label>
          <Input value="Постачальник" readOnly className="flex-1" />
        </div>

        {/* Коротке поле (ЄДРПОУ) */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">ЄДРПОУ:</Label>
          <Input placeholder="12345678" className="w-32" />
        </div>

        {/* Довге поле */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Адреса:</Label>
          <Input placeholder="вул. Хрещатик, 1" className="flex-1" />
        </div>

        {/* Багаторядкове (як "Банківські реквізити") — використовуй <textarea> */}
        <div className="flex items-start gap-3">
          <Label className="w-32 text-right pt-1">Банківські реквізити:</Label>
          <textarea
            className={cn(
              "flex w-full min-h-16 px-2 py-1 text-sm bg-white border border-[#C0C0C0] rounded-none",
              "focus-visible:outline-none focus-visible:border-[#FFCC00] focus-visible:ring-2 focus-visible:ring-[#FFCC00] focus-visible:ring-offset-1",
              "font-1c text-1c resize-none"
            )}
            placeholder="МФО, рахунок..."
          />
        </div>

        {/* Disabled */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Статус:</Label>
          <Input value="Неактивний" disabled className="flex-1" />
        </div>
      </div>

      <div className="space-y-4 p-4 max-w-md font-1c text-sm">
        {/* Обов’язкове поле (порожнє → червона лінія) */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Найменування*:</Label>
          <Input required placeholder="Обов’язкове поле" className="flex-1" />
        </div>

        {/* Заповнене обов’язкове поле */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Код*:</Label>
          <Input required value="12345" className="flex-1" />
        </div>

        {/* Поле з помилкою (вручну) */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">ЄДРПОУ:</Label>
          <Input error placeholder="Невірний формат" className="flex-1" />
        </div>

        {/* Без помилки */}
        <div className="flex items-center gap-3">
          <Label className="w-32 text-right">Адреса:</Label>
          <Input placeholder="Необов’язково" className="flex-1" />
        </div>
      </div>

      <Checkbox />

      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
