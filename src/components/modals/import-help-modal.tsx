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
    { name: "Форма_випуску", required: false, description: "Таблетки, ампули, тощо" },
    { name: "Дозування", required: false, description: "Числове значення (напр. 500)" },
    { name: "Одиниця_виміру", required: false, description: "mg, ml, g, тощо" },
    { name: "Штрихкод", required: false, description: "EAN-13 або інший" },
    { name: "МНН", required: false, description: "Міжнародна непатентована назва" },
    { name: "Код_ATC", required: false, description: "Анатомічно-терапевтично-хімічна класифікація" },
    { name: "Номер_реєстрації", required: false, description: "Номер реєстраційного посвідчення" },
    { name: "Нац_перелік", required: false, description: "Так/Ні" },
    { name: "Доступні_ліки", required: false, description: "Так/Ні" },
    { name: "Роздрібна_ціна", required: false, description: "Ціна за одиницю" },
    { name: "ПДВ", required: false, description: "Ставка податку (7 або 20)" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Інструкція з імпорту товарів</DialogTitle>
          <DialogDescription>
            Для завантаження товарів підготуйте файл у форматі .xlsx або .xls з наступними колонками. Перший рядок файлу має
            містити заголовки колонок.
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
