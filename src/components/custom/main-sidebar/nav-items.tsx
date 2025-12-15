import cashRegisterImage from "../../../assets/nav-icons/cash-register.png"
import salesImage from "../../../assets/nav-icons/sales.png"
import storageImage from "../../../assets/nav-icons/storage.png"
import reportsImage from "../../../assets/nav-icons/reports.png"
import userImage from "../../../assets/nav-icons/user.png"
import adminImage from "../../../assets/nav-icons/admin.png"

export const NAV_ITEMS = [
  {
    id: 1,
    label: "Продажі",
    icon: cashRegisterImage,
    items: [
      {
        title: "Роздрібний продажі",
        links: [
          { path: "", label: "Реєстрація продажів", isDisabled: true },
          { path: "", label: "Чеки ККМ", isDisabled: true },
        ],
      },
      {
        title: "Введення замовлень клієнтів",
        links: [
          { path: "", label: "Закриття замовлень покпців (резервів)", isDisabled: true },
          { path: "", label: "Завантаження замовлень покупця", isDisabled: true },
        ],
      },
      {
        title: "Продажі та повернення",
        links: [
          { path: "", label: "Реалізація товарів/послуг", isDisabled: true },
          { path: "", label: "Провернення товарів від клієнта", isDisabled: true },
        ],
      },
      {
        title: "Соціальні проекти",
        links: [
          { path: "", label: "Звіти про продажі по реімбурсації", isDisabled: true },
          { path: "", label: "Соціальні проекти", isDisabled: true },
        ],
      },
      {
        title: "eHealth",
        links: [
          { path: "", label: "Встановлення цін реімбурсації", isDisabled: true },
          { path: "", label: "Препарати бази eHealth", isDisabled: true },
          { path: "", label: "Медичні програми eHealth", isDisabled: true },
          { path: "", label: "Торгові назви eHealth", isDisabled: true },
          { path: "", label: "Лікарська форма eHealth", isDisabled: true },
          { path: "", label: "МНН eHealth", isDisabled: true },
        ],
      },
      {
        title: "Аналітика продажів",
        links: [{ path: "", label: "Причини відмов від покупок", isDisabled: true }],
      },
      {
        title: "Інше",
        links: [{ path: "", label: "Рецепти лікаря", isDisabled: true }],
      },
      {
        title: "Сервіс",
        links: [
          { path: "", label: "АРМ роботи замовлень", isDisabled: true },
          { path: "", label: "Касова зміна", isDisabled: true },
          { path: "", label: "Зміни користувача", isDisabled: true },
          { path: "", label: "Пошук по штрихкоду", isDisabled: true },
          { path: "", label: "Пробиття чеків з офлайн продажу", isDisabled: true },
          { path: "", label: "Лімітна сума для створення авансу", isDisabled: true },
          { path: "", label: "Процент аванса", isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Закупівлі",
    icon: salesImage,
    items: [
      {
        title: "Закупівлі",
        links: [
          { path: "", label: "Надходження товарів і послуг", isDisabled: true },
          { path: "", label: "Повернення товарів постачальнику", isDisabled: true },
          { path: "", label: "Замовлення по поверненню товарів постачальнику", isDisabled: true },
        ],
      },
      {
        title: "Замовлення",
        links: [
          { path: "", label: "Внутрішні замовлення", isDisabled: true },
          { path: "", label: "Закриття внутрішніх замовлень", isDisabled: true },
          { path: "", label: "Управління асортиментом", isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Склад",
    icon: storageImage,
    items: [
      {
        title: "Склад",
        links: [
          { path: "", label: "Завантажити файли з ФТР", isDisabled: true },
          { path: "", label: "Препарати з коротким терміном придатності", isDisabled: true },
          { path: "", label: "Переоцінки", isDisabled: true },
        ],
      },
      {
        title: "Складські операції",
        links: [
          { path: "/receiving-docs", label: "Документи прийому", isDisabled: false },
          { path: "", label: "Документи відвантаження", isDisabled: true },
          { path: "", label: "Видатковий ордер на товари", isDisabled: true },
          { path: "", label: "Прибутковий ордер на товари", isDisabled: true },
          { path: "", label: "Ремонт основних засобів", isDisabled: true },
          { path: "/mobile-scan", label: "Сканування накладних", isDisabled: true },
        ],
      },
      {
        title: "Надлишки, нестачі, псування",
        links: [
          { path: "", label: "Перерахунки товарів", isDisabled: true },
          { path: "", label: "Оприбуткування товарів", isDisabled: true },
          { path: "", label: "Списання товарів", isDisabled: true },
          { path: "", label: "Пересортування товарів", isDisabled: true },
          { path: "", label: "Наказ на проведення інвентаризації", isDisabled: true },
          { path: "", label: "Налаштування списання господарських товарів", isDisabled: true },
          { path: "", label: "Показати проблемні документи", isDisabled: true },
        ],
      },
      {
        title: "Внутрішній рух товарів",
        links: [
          { path: "", label: "Замовлення на переміщення", isDisabled: true },
          { path: "", label: "Акт невідповідності", isDisabled: true },
          { path: "", label: "Переміщення товарів", isDisabled: true },
        ],
      },
      {
        title: "Інше",
        links: [
          { path: "", label: "Правила групування складських комірок при друку", isDisabled: true },
          { path: "", label: "Складські комірки", isDisabled: true },
        ],
      },
      {
        title: "Сервіс",
        links: [
          { path: "", label: "АРМ повернення товарів з коротким терміном (на аптеку)", isDisabled: true },
          { path: "", label: "Друк етикеток складських комірок", isDisabled: true },
          { path: "", label: "Розміщення номенклатури по коміркам", isDisabled: true },
          { path: "", label: "АРМ Інвентаризації", isDisabled: true },
          { path: "", label: "Друк етикеток і цінників", isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Звітність",
    icon: reportsImage,
    items: [
      {
        title: "Звітність",
        links: [
          { path: "", label: "Розділ Маркетинг", isDisabled: true },
          { path: "", label: "Розділ Продажі", isDisabled: true },
          { path: "", label: "Розділ Склад", isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Мотивація",
    icon: userImage,
    items: [
      {
        title: "Мотивація",
        links: [
          { path: "", label: "Плановий робочий день працівника", isDisabled: true },
          { path: "", label: "Штатний розклад", isDisabled: true },
        ],
      },
      {
        title: "Звіти",
        links: [
          { path: "", label: "Тривалість робочого дня", isDisabled: true },
          { path: "", label: "Показники дефектарів", isDisabled: true },
        ],
      },
      {
        title: "Сервіс",
        links: [
          { path: "", label: "Детальний звіт по мотивації", isDisabled: true },
          { path: "", label: "Денний план", isDisabled: true },
          { path: "", label: "Зведений звіт по мотивації", isDisabled: true },
          { path: "", label: "Службове вилучення під звіт", isDisabled: true },
          { path: "", label: "Видача авансових коштів", isDisabled: true },
          { path: "", label: "Службове внесення розмінної монети", isDisabled: true },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Адміністрування",
    icon: adminImage,
    items: [
      {
        title: "Адміністрування",
        links: [
          { path: "/medical-products", label: "Номенклатура", isDisabled: false },
          { path: "", label: "Створити накладну", isDisabled: true },
          { path: "/counterparties", label: "Контрагенти", isDisabled: false },
        ],
      },
      {
        title: "Аптечні мережі та користувачі",
        links: [
          { path: "/pharmacy-chains", label: "Аптечні мережі", isDisabled: false },
          { path: "/pharmacy-points", label: "Аптечні пункти", isDisabled: false },
          { path: "/users", label: "Користувачі", isDisabled: false },
        ],
      },
    ],
  },
]
