import type { Dispatch, SetStateAction } from 'react'
import { ArrowLeft, ArrowRight, Plus, Search, MoreHorizontal } from 'lucide-react'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import pencilIcon from '../../assets/icons/pencil.svg'
import rotateIcon from '../../assets/icons/rotate.svg'
import excludeIcon from '../../assets/icons/exclude.svg'
import fileCopyIcon from '../../assets/icons/file-copy.svg'
import circlePlusIcon from '../../assets/icons/circle-plus.svg'
import fileExcludeIcon from '../../assets/icons/file-exclude.svg'
import { Label } from '../ui/label'

const dropdownItems = [
  { icon: circlePlusIcon, label: 'Створити', shortcut: 'Ins' },
  { icon: fileCopyIcon, label: 'Скопіювати', shortcut: 'F9' },
  { icon: pencilIcon, label: 'Змінити', shortcut: 'F2' },
  { icon: fileExcludeIcon, label: 'Відмітити для вилучення / Зняти позначку', shortcut: 'Del' },
  { icon: excludeIcon, label: 'Вилучити', shortcut: 'Shift+Del' },
  { icon: rotateIcon, label: 'Оновити', shortcut: 'F5' },
]

interface Props {
  globalFilter: string
  searchPlaceholder?: string
  setGlobalFilter: Dispatch<SetStateAction<string>>
}

export function PageToolbar({ globalFilter, setGlobalFilter, searchPlaceholder = 'Пошук (Shift+F)' }: Props) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button size="icon" className="w-10 h-7 px-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" className="w-10 h-7 px-0">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <h1 className="text-lg">Документи прийому</h1>
      </div>

      <div className="flex justify-between items-center pt-4">
        {/* <Button variant="default" size="sm">
          <Plus className="w-3 h-3 mr-1" />
          Створити
        </Button> */}

        {/* === DIALOG === */}
        <Dialog>
          <DialogTrigger>
            <Button variant="default" size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Створити
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>Документи прийому (Створення)</DialogHeader>

            <div className="flex justify-between gap-2 mt-2 mb-4">
              <div className="flex gap-2">
                <Button variant="primary" size="sm">
                  Записати та закрити
                </Button>
                <Button size="sm">Записати</Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="sm" className="w-10 h-7 px-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem key={item.label}>
                      <img width={16} src={item.icon} alt="icon" />
                      <span className="pr-10">{item.label}</span>
                      <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="text-sm">
              {/* Звичайне поле */}
              <div className="flex items-center gap-3 mb-2">
                <Label className="w-32 text-right">Найменування:</Label>
                <Input placeholder="Введіть назву..." className="flex-1" wrapperClassName="flex-1" />
              </div>
              {/* Звичайне поле */}
              <div className="flex items-center gap-3 mb-2">
                <Label className="w-32 text-right">Тип контрагента:</Label>
                <Input placeholder="Введіть назву..." className="flex-1" wrapperClassName="flex-1" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* === DIALOG === */}

        <div className="flex-1" />

        {/* Пошук */}
        <div className="flex items-center gap-1">
          <Input
            value={globalFilter ?? ''}
            className="h-7 w-48 text-xs"
            placeholder={searchPlaceholder}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
          />
          <Button size="icon" className="w-10 h-7 px-0">
            <Search className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size="icon" className="w-10 h-7 px-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {dropdownItems.map((item) => (
                <DropdownMenuItem key={item.label}>
                  <img width={16} src={item.icon} alt="icon" />
                  <span className="pr-10">{item.label}</span>
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
