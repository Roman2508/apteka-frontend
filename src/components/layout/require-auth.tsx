import { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import { useAuthStore } from "../../stores/auth.store"
import { useProfile } from "../../hooks/api/use-auth"

export const RequireAuth = () => {
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setAuth = useAuthStore((state) => state.setAuth)
  const location = useLocation()

  // If no token, redirect immediately
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If already authenticated, render content
  if (isAuthenticated) {
    return <Outlet />
  }

  return <AuthCheck token={token} setAuth={setAuth} />
}

const AuthCheck = ({ token, setAuth }: { token: string; setAuth: (data: any) => void }) => {
  const { data, isLoading, error } = useProfile()

  useEffect(() => {
    if (data) {
      // Assuming /auth/me returns the user object.
      // We need to match the store's expected structure.
      // If the API returns just the user, we might need to mock the session or adjust the store.
      // For now, let's assume we can reconstruct enough to satisfy the store or that the API returns what we need.
      // If data is just user:
      setAuth({
        user: data,
        token: token,
        session: { id: 0, loginAt: new Date().toISOString() }, // Mock session if not provided
      })
    }
  }, [data, setAuth, token])

  if (error) {
    return <Navigate to="/auth" replace />
  }

  if (isLoading || data) {
    return (
      <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-muted-foreground font-medium">Завантаження...</span>
        </div>
      </div>
    )
  }

  return null
}
