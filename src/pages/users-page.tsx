import { useMemo, useRef } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Download, HelpCircle, Upload } from "lucide-react"

import {
  useUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  type User,
  type CreateUserDto,
  type UpdateUserDto,
} from "@/hooks/use-users"
import { formatDate } from "@/helpers/format-date"
import { usePharmacies, type Pharmacy } from "@/hooks/use-pharmacies"
import type { UserRoleType } from "@/stores/auth.store"
import { transformUserRole } from "@/helpers/transform-user-role"
import { ConfigurablePage, type ConfigurablePageRef } from "@/components/custom/configurable-page"

const UsersPage = () => {
  const { data: users, isLoading } = useUsers()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const { data: pharmacies } = usePharmacies()

  const pageRef = useRef<ConfigurablePageRef>(null)

  const handleEntitySave = async (data: User, mode: "create" | "edit" | "copy") => {
    try {
      if (mode === "create" || mode === "copy") {
        const _data = data as unknown as CreateUserDto
        await createMutation.mutateAsync(_data)
      } else if (mode === "edit") {
        const { id, ...rest } = data
        await updateMutation.mutateAsync({ id, data: rest as UpdateUserDto })
      }
    } catch (error) {
      console.error("Failed to save user:", error)
      alert("Помилка при збереженні користувача")
    }
  }

  const customActions = {
    delete: (row: User | null) => {
      if (row) {
        if (confirm("Ви впевнені, що хочете видалити цього користувача?")) {
          deleteMutation.mutate(row.id)
        }
      }
      return false // prevent default delete
    },
  }

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Логін",
        meta: { form: { type: "text", required: true, placeholder: "Введіть назву" } } as any,
      },
      {
        accessorKey: "full_name",
        header: "Повне ім'я",
        meta: { form: { type: "text", required: true, placeholder: "Введіть назву" } } as any,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => {
          const email = getValue<string>()
          return email ? email : "-"
        },
        meta: { form: { type: "email", required: true, placeholder: "Введіть email" } } as any,
      },
      {
        accessorKey: "password",
        header: "Пароль",
        cell: () => "-",
        meta: { form: { type: "password", placeholder: "Пароль" } } as any,
      },
      {
        accessorKey: "role",
        header: "Роль",
        cell: ({ getValue }) => {
          const role = getValue<UserRoleType>()
          return role ? transformUserRole(role) : "-"
        },
        meta: {
          form: {
            type: "select",
            required: true,
            options: [
              { label: "Асистент фармацевта", value: "pharmacist" },
              { label: "Старший фармацевт", value: "senior_pharmacist" },
              { label: "Завідувач аптеки", value: "director" },
              { label: "Адміністратор", value: "admin" },
            ],
            placeholder: "Роль",
          },
        },
      },
      {
        accessorKey: "pharmacy",
        header: "Аптека",
        cell: ({ getValue }) => {
          const pharmacy = getValue<Pharmacy>()
          return pharmacy ? pharmacy.number : "-"
        },
        meta: {
          form: {
            type: "select",
            required: true,
            options: [...(pharmacies?.map((pharmacy) => ({ label: pharmacy.number, value: pharmacy.id })) || [])],
            placeholder: "Аптека",
          },
        },
      },
      {
        accessorKey: "is_active",
        header: "Активний",
        cell: ({ getValue }) => (getValue() ? "Так" : "Ні"),
        meta: { form: { type: "checkbox", placeholder: "Активний" } },
      },
      {
        accessorKey: "createdAt",
        header: "Дата створення",
        cell: ({ getValue }) => {
          const date = getValue<string>()
          if (date) return formatDate(date, "long")
          return "-"
        },
        meta: { form: { hidden: true, type: "text", placeholder: "Дата створення", readonly: true } },
      },
    ],
    [],
  )

  return (
    <ConfigurablePage
      ref={pageRef}
      data={users || []}
      columns={columns}
      isLoading={isLoading}
      onEntitySave={handleEntitySave}
      customActions={customActions}
      topToolbar={{
        title: "Користувачі",
        items: [
          [
            {
              label: "Додати користувача",
              onClick: () => pageRef.current?.openModal("create"),
              variant: "primary",
            },
            {
              label: "Завантажити з файлу",
              icon: <Download className="w-3.5 h-3.5" />,
              // onClick: () => fileInputRef.current?.click(),
              variant: "default",
              // disabled: importExcel.isPending,
            },
            {
              label: "",
              icon: <HelpCircle className="w-4 h-4 text-muted-foreground" />,
              // onClick: () => setIsHelpModalOpen(true),
              variant: "default",
              className: "px-2",
              title: "Інструкція з імпорту",
            },
            {
              label: "Експорт",
              icon: <Upload className="w-3.5 h-3.5" />,
              // onClick: handleExport,
              variant: "default",
            },
          ],
        ],
      }}
    />
  )
}

export default UsersPage
