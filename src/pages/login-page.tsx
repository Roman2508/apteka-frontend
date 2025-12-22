import z from "zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"

import { useLogin, useCheckSetup, useSetup } from "../hooks/api/use-auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginPage = () => {
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {},
  })

  // Setup hooks
  const { data: setupData, isLoading: checkingSetup } = useCheckSetup()
  const setup = useSetup()
  const [mode, setMode] = useState<"login" | "setup">("login")

  useEffect(() => {
    if (setupData?.setupRequired) {
      setMode("setup")
    }
  }, [setupData])

  const onSetupSubmit = (data: LoginFormValues) => {
    setup.mutate(data, {
      onSuccess: () => {
        // After setup, switch to login or auto-login (here we just switch to show success)
        setMode("login")
        // Optionally auto-fill the login form
        form.setValue("username", data.username)
        form.setValue("password", "")
      },
    })
  }

  const onSubmit = (data: LoginFormValues) => {
    login.mutate({ username: data.username, password: data.password })
  }

  if (checkingSetup) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === "setup" ? "Welcome to Apteka" : "Apteka Workstation"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === "setup" ? "Create an administrator account to get started" : "Sign in to start your shift"}
          </p>
        </div>

        {mode === "setup" ? (
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSetupSubmit)}>
            <div className="mb-4">
              <label className="text-[13px] text-neutral-900" htmlFor="username">
                Admin Username:*
              </label>
              <Input type="text" placeholder="Create admin username" {...form.register("username")} id="username" />
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-[13px] text-neutral-900" htmlFor="password">
                Password:*
              </label>
              <Input
                type="password"
                placeholder="Create password (min 6 chars)"
                {...form.register("password")}
                id="password"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" disabled={setup.isPending}>
              {setup.isPending ? "Creating Account..." : "Create Admin Account"}
            </Button>

            {setup.error && (
              <div className="text-red-500 text-sm text-center">
                {(setup.error as any).response?.data?.message || "Failed to setup"}
              </div>
            )}
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="text-[13px] text-neutral-900" htmlFor="username">
                Login:*
              </label>
              <Input type="text" placeholder="Enter your login" {...form.register("username")} id="username" />
            </div>

            <div className="mb-4">
              <label className="text-[13px] text-neutral-900" htmlFor="password">
                Password:*
              </label>
              <Input type="password" placeholder="Enter your password" {...form.register("password")} id="password" />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-4" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in & Start Shift"}
            </Button>

            {login.error && (
              <div className="text-red-500 text-sm text-center">
                {(login.error as any).response?.data?.message || "Не вдалось увійти"}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
