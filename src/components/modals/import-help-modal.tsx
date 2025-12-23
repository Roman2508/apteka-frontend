import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImportHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ImportHelpModal = ({ open, onOpenChange }: ImportHelpModalProps) => {
  const columns = [
    { name: "Найменування", required: true, description: "Назва товару" },
    { name: "Торгова марка", required: false, description: "Бренд виробника" },
    { name: "Форма", required: true, description: "Форма випуску (таблетки, ампули, тощо)" },
    { name: "Доза", required: true, description: "Числове значення (напр. 500)" },
    { name: "Одиниця дози", required: true, description: "mg, ml, g, тощо" },
    { name: "МНН", required: false, description: "Міжнародна непатентована назва" },
    { name: "ATC", required: false, description: "Анатомічно-терапевтично-хімічна класифікація" },
    { name: "Реєстрація", required: false, description: "Номер реєстраційного посвідчення" },
    { name: "Нац. перелік", required: false, description: "Так/Ні" },
    { name: "Доступні ліки", required: false, description: "Так/Ні" },
    { name: "Кількість в упаковці", required: true, description: "Числове значення" },
    { name: "Тип упаковки", required: true, description: "Тип в упаковці (блістери, ампули, тощо" },
    { name: "Термін придатності", required: true, description: "Числове значення" },
    { name: "Одиниця виміру терміну придатності", required: true, description: "Одиниця виміру (дні, місяці, роки)" },
    { name: "Ціна", required: true, description: "Ціна за одиницю" },
    { name: "ПДВ", required: true, description: "Ставка податку (7 або 20)" },
    { name: "Виробник", required: false, description: "ID виробника" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Інструкція з імпорту товарів</DialogTitle>
          <DialogDescription>
            Для завантаження товарів підготуйте файл у форматі .xlsx або .xls з наступними колонками. Перший рядок файлу
            має містити заголовки колонок.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Назва колонки</TableHead>
                <TableHead className="w-[100px]">Обов'язкове</TableHead>
                <TableHead>Опис</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((col) => (
                <TableRow key={col.name}>
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell>{col.required ? "Так" : "Ні"}</TableCell>
                  <TableCell className="text-muted-foreground">{col.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
