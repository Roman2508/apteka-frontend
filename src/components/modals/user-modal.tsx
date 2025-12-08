import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateUser, useUpdateUser, type User } from "@/hooks/use-users"
import { usePharmacyChains } from "@/hooks/use-pharmacy-chains"

const userSchema = z
  .object({
    username: z.string().min(3, "Мінімум 3 символи"),
    full_name: z.string().optional(),
    email: z.string().email("Невірний формат email").optional().or(z.literal("")),
    role: z.enum(["admin", "director", "pharmacist", "senior_pharmacist"]),
    password: z.string().min(4, "Мінімум 4 символи").optional().or(z.literal("")),
    is_active: z.boolean(),
    pharmacyChainId: z.number().optional(),
    pharmacyNumber: z.string().optional(),
    pharmacyAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "director") {
        return data.pharmacyChainId && data.pharmacyNumber && data.pharmacyAddress
      }
      return true
    },
    {
      message: "Для завідувача обов'язково вказати мережу, номер та адресу аптеки",
      path: ["pharmacyChainId"],
    },
  )

type FormData = z.infer<typeof userSchema>

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  user?: User | null
}

export const UserModal = ({ open, onOpenChange, mode, user }: UserModalProps) => {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const { data: chains } = usePharmacyChains()

  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      role: "director",
      password: "",
      is_active: true,
      pharmacyChainId: undefined,
      pharmacyNumber: "",
      pharmacyAddress: "",
    },
  })

  const watchRole = form.watch("role")

  useEffect(() => {
    if (open) {
      if (mode === "edit" && user) {
        form.reset({
          username: user.username,
          full_name: user.full_name || "",
          email: user.email || "",
          role: user.role,
          password: "",
          is_active: user.is_active,
          pharmacyChainId: user.ownedPharmacy?.chain?.id,
          pharmacyNumber: user.ownedPharmacy?.number || "",
          pharmacyAddress: user.ownedPharmacy?.address || "",
        })
      } else {
        form.reset({
          username: "",
          full_name: "",
          email: "",
          role: "director",
          password: "",
          is_active: true,
          pharmacyChainId: undefined,
          pharmacyNumber: "",
          pharmacyAddress: "",
        })
      }
    }
  }, [open, mode, user, form])

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        username: data.username,
        full_name: data.full_name || undefined,
        email: data.email || undefined,
        role: data.role,
        is_active: data.is_active,
      }

      if (mode === "create" && data.password) {
        payload.password = data.password
      } else if (mode === "edit" && data.password) {
        payload.password = data.password
      } else if (mode === "create") {
        toast.error("Пароль обов'язковий при створенні")
        return
      }

      if (data.role === "director") {
        payload.pharmacyChainId = data.pharmacyChainId
        payload.pharmacyNumber = data.pharmacyNumber
        payload.pharmacyAddress = data.pharmacyAddress
      }

      if (mode === "create") {
        await createUser.mutateAsync(payload)
        toast.success("Користувача успішно створено")
      } else if (user) {
        await updateUser.mutateAsync({ id: user.id, data: payload })
        toast.success("Користувача успішно оновлено")
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Помилка при збереженні")
    }
  }

  const isPending = createUser.isPending || updateUser.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Створити користувача" : "Редагувати користувача"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логін *</Label>
              <Input
                id="username"
                {...form.register("username")}
                placeholder="student01"
                error={!!form.formState.errors.username}
              />
              {form.formState.errors.username && <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">ПІБ</Label>
              <Input id="full_name" {...form.register("full_name")} placeholder="Іваненко Іван Іванович" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} placeholder="student@example.com" />
              {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{mode === "create" ? "Пароль *" : "Новий пароль"}</Label>
              <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" />
              {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Роль *</Label>
              <Select value={form.watch("role")} onValueChange={(value: any) => form.setValue("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Адміністратор</SelectItem>
                  <SelectItem value="director">Завідувач аптеки</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="is_active"
                checked={form.watch("is_active")}
                onCheckedChange={(checked) => form.setValue("is_active", !!checked)}
              />
              <Label htmlFor="is_active">Активний</Label>
            </div>
          </div>

          {watchRole === "director" && (
            <>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Налаштування аптеки</h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pharmacyChainId">Мережа аптек *</Label>
                <Select
                  value={form.watch("pharmacyChainId")?.toString() || ""}
                  onValueChange={(value) => form.setValue("pharmacyChainId", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть мережу" />
                  </SelectTrigger>
                  <SelectContent>
                    {chains?.map((chain) => (
                      <SelectItem key={chain.id} value={chain.id.toString()}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.pharmacyChainId && (
                  <p className="text-sm text-red-500">{form.formState.errors.pharmacyChainId.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacyNumber">Номер аптеки *</Label>
                  <Input id="pharmacyNumber" {...form.register("pharmacyNumber")} placeholder="001" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacyAddress">Адреса аптеки *</Label>
                  <Input id="pharmacyAddress" {...form.register("pharmacyAddress")} placeholder="вул. Хрещатик, 1" />
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Скасувати
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
