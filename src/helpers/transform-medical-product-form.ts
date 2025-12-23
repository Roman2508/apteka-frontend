import type { MedicalProductForm } from "@/types/medical-product.types"

export const transformMedicalProductForm = (form: MedicalProductForm) => {
  switch (form) {
    case "tablet":
      return "Таблетки"
    case "capsule":
      return "Капсули"
    case "syrup":
      return "Сироп"
    case "drops":
      return "Краплі"
    case "ointment":
      return "Мазь"
    case "spray":
      return "Спрей"
    case "ampoule":
      return "Ампула"
    case "suspension":
      return "Суспензія"
    case "powder":
      return "Порошок"
    case "gel":
      return "Гель"
    case "cream":
      return "Крем"
    case "solution":
      return "Розчин"
    case "other":
      return "Інше"
    default:
      return "Інше"
  }
}
