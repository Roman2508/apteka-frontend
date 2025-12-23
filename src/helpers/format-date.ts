import { format } from "date-fns"

type DateFormats = "short" | "long" | "input"

export const formatDate = (date?: string, variant?: DateFormats) => {
  if (!date) return ""

  switch (variant) {
    case "short":
      return format(new Date(date), "dd.MM.yyyy")
    case "long":
      return format(new Date(date), "dd.MM.yyyy - HH:mm:ss")
    case "input":
      return format(new Date(date), "yyyy-MM-dd")
    default:
      return format(new Date(date), "dd.MM.yyyy")
  }
}
