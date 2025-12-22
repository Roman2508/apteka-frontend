import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreatePharmacyChain, useUpdatePharmacyChain, type PharmacyChain } from "@/hooks/api/use-pharmacy-chains"

const pharmacyChainSchema = z.object({
  name: z.string().min(1, "Назва обов'язкова"),
  edrpou_code: z.string().optional(),
})

type FormData = z.infer<typeof pharmacyChainSchema>

interface PharmacyChainModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  chain?: PharmacyChain | null
}

export const PharmacyChainModal = ({ open, onOpenChange, mode, chain }: PharmacyChainModalProps) => {
  const createChain = useCreatePharmacyChain()
  const updateChain = useUpdatePharmacyChain()

  const form = useForm<FormData>({
    resolver: zodResolver(pharmacyChainSchema),
    defaultValues: {
      name: "",
      edrpou_code: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === "edit" && chain) {
        form.reset({
          name: chain.name,
          edrpou_code: chain.edrpou_code || "",
        })
      } else {
        form.reset({
          name: "",
          edrpou_code: "",
        })
      }
    }
  }, [open, mode, chain, form])

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "create") {
        await createChain.mutateAsync(data)
        toast.success("Мережу аптек успішно створено")
      } else if (chain) {
        await updateChain.mutateAsync({ id: chain.id, data })
        toast.success("Мережу аптек успішно оновлено")
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Помилка при збереженні")
    }
  }

  const isPending = createChain.isPending || updateChain.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Створити мережу аптек" : "Редагувати мережу аптек"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва мережі *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Введіть назву мережі"
              error={!!form.formState.errors.name}
            />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edrpou_code">Код ЄДРПОУ</Label>
            <Input id="edrpou_code" {...form.register("edrpou_code")} placeholder="12345678" />
          </div>

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
