import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useLocation, useNavigationType, useNavigate } from "react-router"

interface HistoryContextType {
  canGoBack: boolean
  canGoForward: boolean
  goBack: () => void
  goForward: () => void
}

const HistoryContext = createContext<HistoryContextType | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navType = useNavigationType()
  const navigate = useNavigate()

  const [historyStack, setHistoryStack] = useState<string[]>([location.key])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (navType === "PUSH") {
      // Truncate forward history and add new location
      const newStack = historyStack.slice(0, currentIndex + 1)
      newStack.push(location.key)
      setHistoryStack(newStack)
      setCurrentIndex(newStack.length - 1)
    } else if (navType === "REPLACE") {
      // Replace current entry
      const newStack = [...historyStack]
      newStack[currentIndex] = location.key
      setHistoryStack(newStack)
    } else if (navType === "POP") {
      // Find the new index based on the key
      // Note: This is a heuristic because POP doesn't tell us direction.
      // We search for the key in our stack.
      const index = historyStack.indexOf(location.key)
      if (index !== -1) {
        setCurrentIndex(index)
      } else {
        // If key not found (e.g. external navigation), reset or append?
        // For safety, let's append if not found, or just assume it's a new start if we lost track.
        // But usually POP means we went back/forward in our known stack.
        // If we can't find it, we might be out of sync.
        // Let's just set it to current if found.
      }
    }
  }, [location, navType])

  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < historyStack.length - 1

  const goBack = () => {
    if (canGoBack) navigate(-1)
  }

  const goForward = () => {
    if (canGoForward) navigate(1)
  }

  return <HistoryContext.Provider value={{ canGoBack, canGoForward, goBack, goForward }}>{children}</HistoryContext.Provider>
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider")
  }
  return context
}
