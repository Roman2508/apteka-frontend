import { format } from "date-fns"

export const formatDate = (date: string, variant?: "short" | "long") => {
  return format(new Date(date), variant === "long" ? "dd.MM.yyyy - HH:mm:ss" : "dd.MM.yyyy")
}
