import { Download, HelpCircle, Upload, RefreshCw, Printer, X, Copy } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import handIcon from "../../../assets/icons/hand-icon.png"
import alarmClockIcon from "../../../assets/icons/alarm-clock-icon.png"

export const SalesRegistrationSidebar = () => {
  return (
    <div className="flex flex-col w-75 mt-20 h-[calc(100vh-135px)]">
      <div className="flex-1">
        <div className="bg-neutral-300 flex flex-col gap-2 w-full px-1 mb-2">
          <div className="flex justify-between">
            <span className="text-lg opacity-[0.8] ">До оплати</span>
            <span className="text-lg font-bold">1132,20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Знижка</span>
            <span className="text-sm">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">бокуси</span>
            <span className="text-sm">0</span>
          </div>
        </div>

        <div className="bg-neutral-300 flex justify-center gap-2 w-full py-2 px-1 mb-2">
          <Button variant="primary" size="sm" className="flex-1">
            Рекомендація
          </Button>
          <Button size="sm" className="flex-1">
            Розрахувати знижки
          </Button>
        </div>

        <div className="bg-neutral-300 flex flex-col gap-2 w-full py-2 px-1 mb-6">
          <div className="flex gap-1">
            <Input placeholder="Номер телефону клієнта" className="flex-1 h-7" />
            <Button size="icon" className="h-7">
              <X className="min-w-4" />
            </Button>
            <Button size="icon" className="h-7">
              <Copy className="min-w-3" />
            </Button>
          </div>

          <div className="mr-1">
            <Input placeholder="Лікар" className="flex-1 h-7" />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-neutral-300 flex items-center gap-2 w-full p-2 mb-2">
          <div className="flex justify-between font-bold">
            <span className="text-sm">План: 27 682</span>
          </div>

          <div className="flex justify-between gap-1 font-bold">
            <span className="text-sm">Факт: 3 622,26</span>
            <span className="text-sm text-destructive-500">(-24 059,74)</span>
          </div>
        </div>

        <div className="bg-neutral-300 flex gap-4 w-full p-2 mb-2">
          <div className="flex flex-col gap-3">
            <Button size="sm">Змінити користувача</Button>
            <Button size="sm">Касова зміна</Button>
            <Button size="sm">Переоцінки</Button>
            <Button size="sm">Чеки ККМ</Button>
          </div>

          <div className="flex flex-col gap-4">
            <img src={alarmClockIcon} alt="alarm clock icon" className="w-6 h-6 mt-0.5" />
            <img src={handIcon} alt="hand icon" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
