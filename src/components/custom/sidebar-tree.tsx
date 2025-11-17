// components/ui/sidebar-tree.tsx
import { Button } from '@/components/ui/button'
import { ChevronDown, Folder, FileText, Users, Package } from 'lucide-react'
import { useState, type Dispatch, type SetStateAction } from 'react'
import cashRegisterImage from '../../assets/nav-icons/cash-register.png'
import salesImage from '../../assets/nav-icons/sales.png'
import storageImage from '../../assets/nav-icons/storage.png'
import reportsImage from '../../assets/nav-icons/reports.png'
import userImage from '../../assets/nav-icons/user.png'

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Продажі',
    icon: cashRegisterImage,
    items: [
      {
        title: 'Роздрібний продажі',
        links: [
          { path: '', label: 'Реєстрація продажів', isDisabled: false },
          { path: '', label: 'Чеки ККМ', isDisabled: true },
        ],
      },
      {
        title: 'Введення замовлень клієнтів',
        links: [
          {
            path: '',
            label: 'Закриття замовлень покпців (резервів)',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Завантаження замовлень покупця',
            isDisabled: true,
          },
        ],
      },
      {
        title: 'Продажі та повернення',
        links: [
          { path: '', label: 'Реалізація товарів/послуг', isDisabled: false },
          {
            path: '',
            label: 'Провернення товарів від клієнта',
            isDisabled: true,
          },
        ],
      },
      {
        title: 'Соціальні проекти',
        links: [
          {
            path: '',
            label: 'Звіти про продажі по реімбурсації',
            isDisabled: false,
          },
          { path: '', label: 'Соціальні проекти', isDisabled: true },
        ],
      },
      {
        title: 'eHealth',
        links: [
          {
            path: '',
            label: 'Встановлення цін реімбурсації',
            isDisabled: false,
          },
          { path: '', label: 'Препарати бази eHealth', isDisabled: true },
          { path: '', label: 'Медичні програми eHealth', isDisabled: true },
          { path: '', label: 'Торгові назви eHealth', isDisabled: true },
          { path: '', label: 'Лікарська форма eHealth', isDisabled: true },
          { path: '', label: 'МНН eHealth', isDisabled: true },
        ],
      },
      {
        title: 'Аналітика продажів',
        links: [{ path: '', label: 'Причини відмов від покупок', isDisabled: false }],
      },
      {
        title: 'Інше',
        links: [{ path: '', label: 'Рецепти лікаря', isDisabled: true }],
      },
      {
        title: 'Сервіс',
        links: [
          { path: '', label: 'АРМ роботи замовлень', isDisabled: false },
          { path: '', label: 'Касова зміна', isDisabled: false },
          { path: '', label: 'Зміни користувача', isDisabled: false },
          { path: '', label: 'Пошук по штрихкоду', isDisabled: false },
          {
            path: '',
            label: 'Пробиття чеків з офлайн продажу',
            isDisabled: true,
          },
          {
            path: '',
            label: 'Лімітна сума для створення авансу',
            isDisabled: false,
          },
          { path: '', label: 'Процент аванса', isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Закупівлі',
    icon: salesImage,
    items: [
      {
        title: 'Закупівлі',
        links: [
          {
            path: '',
            label: 'Надходження товарів і послуг',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Повернення товарів постачальнику',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Замовлення по поверненню товарів постачальнику',
            isDisabled: false,
          },
        ],
      },
      {
        title: 'Замовлення',
        links: [
          { path: '', label: 'Внутрішні замовлення', isDisabled: false },
          {
            path: '',
            label: 'Закриття внутрішніх замовлень',
            isDisabled: false,
          },
          { path: '', label: 'Управління асортиментом', isDisabled: false },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'Склад',
    icon: storageImage,
    items: [
      {
        title: 'Склад',
        links: [
          { path: '', label: 'Завантажити файли з ФТР', isDisabled: false },
          {
            path: '',
            label: 'Препарати з коротким терміном придатності',
            isDisabled: false,
          },
          { path: '', label: 'Переоцінки', isDisabled: false },
        ],
      },
      {
        title: 'Складські операції',
        links: [
          { path: '', label: 'Документи прийому', isDisabled: false },
          { path: '', label: 'Документи відвантаження', isDisabled: false },
          { path: '', label: 'Видатковий ордер на товари', isDisabled: false },
          { path: '', label: 'Прибутковий ордер на товари', isDisabled: false },
          { path: '', label: 'Ремонт основних засобів', isDisabled: false },
        ],
      },
      {
        title: 'Надлишки, нестачі, псування',
        links: [
          { path: '', label: 'Перерахунки товарів', isDisabled: false },
          { path: '', label: 'Оприбуткування товарів', isDisabled: false },
          { path: '', label: 'Списання товарів', isDisabled: false },
          { path: '', label: 'Пересортування товарів', isDisabled: false },
          {
            path: '',
            label: 'Наказ на проведення інвентаризації',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Налаштування списання господарських товарів',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Показати проблемні документи',
            isDisabled: false,
          },
        ],
      },
      {
        title: 'Внутрішній рух товарів',
        links: [
          { path: '', label: 'Замовлення на переміщення', isDisabled: false },
          { path: '', label: 'Акт невідповідності', isDisabled: false },
          { path: '', label: 'Переміщення товарів', isDisabled: false },
        ],
      },
      {
        title: 'Інше',
        links: [
          {
            path: '',
            label: 'Правила групування складських комірок при друку',
            isDisabled: false,
          },
          { path: '', label: 'Складські комірки', isDisabled: false },
        ],
      },
      {
        title: 'Сервіс',
        links: [
          {
            path: '',
            label: 'АРМ повернення товарів з коротким терміном (на аптеку)',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Друк етикеток складських комірок',
            isDisabled: false,
          },
          {
            path: '',
            label: 'Розміщення номенклатури по коміркам',
            isDisabled: false,
          },
          { path: '', label: 'АРМ Інвентаризації', isDisabled: false },
          { path: '', label: 'Друк етикеток і цінників', isDisabled: false },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Звітність',
    icon: reportsImage,
    items: [
      {
        title: 'Звітність',
        links: [
          { path: '', label: 'Розділ Маркетинг', isDisabled: false },
          { path: '', label: 'Розділ Продажі', isDisabled: false },
          { path: '', label: 'Розділ Склад', isDisabled: false },
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'Мотивація',
    icon: userImage,
    items: [
      {
        title: 'Мотивація',
        links: [
          {
            path: '',
            label: 'Плановий робочий день працівника',
            isDisabled: false,
          },
          { path: '', label: 'Штатний розклад', isDisabled: false },
        ],
      },
      {
        title: 'Звіти',
        links: [
          { path: '', label: 'Тривалість робочого дня', isDisabled: false },
          { path: '', label: 'Показники дефектарів', isDisabled: false },
        ],
      },
      {
        title: 'Сервіс',
        links: [
          { path: '', label: 'Детальний звіт по мотивації', isDisabled: false },
          { path: '', label: 'Денний план', isDisabled: false },
          { path: '', label: 'Зведений звіт по мотивації', isDisabled: false },
          { path: '', label: 'Службове вилучення під звіт', isDisabled: false },
          { path: '', label: 'Видача авансових коштів', isDisabled: false },
          {
            path: '',
            label: 'Службове внесення розмінної монети',
            isDisabled: false,
          },
        ],
      },
    ],
  },
]

export function SidebarTree() {
  const [openedId, setOpenId] = useState<number | null>(null)

  return (
    <aside className="bg-primary-100 border-r border-neutral-800 flex flex-col">
      {/* <aside className="w-56 bg-primary-100 border-r border-neutral-800 flex flex-col"> */}
      {/* Заголовок */}
      <div className="w-22 h-[35px] border-b border-neutral-800 flex items-center px-2">
        {/* <span className="text-sm font-bold">ЖБФФК Аптека</span> */}
      </div>

      {/* Дерево */}
      <nav className="flex-1 space-y-1 text-sm relative">
        {NAV_ITEMS.map((item) => (
          <TreeItem id={item.id} icon={item.icon} label={item.label} openedId={openedId} setOpenId={setOpenId} />
        ))}
      </nav>
    </aside>
  )
}

function TreeItem({
  id,
  icon,
  label,
  openedId,
  setOpenId,
}: {
  id: number
  icon: string
  label: string
  openedId: number | null
  setOpenId: Dispatch<SetStateAction<number | null>>
}) {
  const open = openedId === id

  return (
    <div className="">
      <div className={open ? 'bg-white w-22' : 'w-22'}>
        <div
          onClick={() => setOpenId(open ? null : id)}
          className="flex items-center gap-1 p-3 hover:underline rounded cursor-pointer"
        >
          <img src={icon} height={60} title={label} />
        </div>
      </div>

      {open && (
        <div className="absolute z-[9] left-[100%] top-0 h-[calc(100vh-35px)] w-[calc(100vw-100%)] bg-white border border-neutral-800 shadow-lg p-6">
          <div className="flex flex-col flex-wrap max-h-[80%] inline-flex gap-x-6">
            {NAV_ITEMS.find((item) => item.id === id)?.items.map((section) => (
              <div key={section.title} className="p-4">
                <h3 className="text-success-primary mb-2 text-md">{section.title}</h3>
                <ul>
                  {section.links.map((link) => (
                    <li key={link.label} className="mb-1 text-base hover:underline">
                      <a href="">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
