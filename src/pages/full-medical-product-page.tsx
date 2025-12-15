import * as z from "zod"
import { Plus, X, ArrowLeft } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate, useLocation } from "react-router"
import { toast } from "sonner"

import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import { TemplateFormItem } from "../components/custom/template-form-item.tsx"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"
import { useProduct, useCreateProduct, useUpdateProduct, useUploadPhotos, useDeletePhoto } from "../hooks/use-medical-products"

// --- Schema Definition ---
const productSchema = z.object({
  name: z.string().min(1, "Найменування обов'язкове"),
  brand_name: z.string().optional(),
  form: z.string().min(1, "Форма обов'язкова"),
  dosage_value: z.number().optional(),
  dosage_unit: z.string().optional(),
  barcode: z.string().optional(),
  inn: z.string().optional(),
  atc_code: z.string().optional(),
  registration_number: z.string().optional(),
  in_national_list: z.boolean().optional(),
  in_reimbursed_program: z.boolean().optional(),
  subpackage_type: z.string().optional(),
  subpackages_per_package: z.number().optional(),
  shelf_life_value: z.number().optional(),
  shelf_life_unit: z.string().optional(),
  retail_price: z.number().min(0, "Ціна обов'язкова"),
  vat_rate: z.coerce.number().optional(),
  manufacturerId: z.number().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const FullMedicalProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isCreateMode = id === "create"
  const productId = isCreateMode ? null : Number(id)

  // Get copyFrom data if navigating from copy action
  const copyFromProduct = location.state?.copyFrom

  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([])

  const { data: product, isLoading: productLoading } = useProduct(productId || 0)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const uploadPhotos = useUploadPhotos()
  const deletePhoto = useDeletePhoto()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      in_national_list: false,
      in_reimbursed_program: false,
      vat_rate: 7,
      form: "tablet",
    },
  })

  // Load product data for edit mode or copy mode
  useEffect(() => {
    // For copy mode - load data from navigation state
    if (isCreateMode && copyFromProduct) {
      form.reset({
        name: copyFromProduct.name || "",
        brand_name: copyFromProduct.brand_name || "",
        form: copyFromProduct.form || "tablet",
        dosage_value: copyFromProduct.dosage_value ? Number(copyFromProduct.dosage_value) : undefined,
        dosage_unit: copyFromProduct.dosage_unit || "",
        barcode: copyFromProduct.barcode || "",
        inn: copyFromProduct.inn || "",
        atc_code: copyFromProduct.atc_code || "",
        registration_number: copyFromProduct.registration_number || "",
        in_national_list: copyFromProduct.in_national_list || false,
        in_reimbursed_program: copyFromProduct.in_reimbursed_program || false,
        subpackage_type: copyFromProduct.subpackage_type || "",
        subpackages_per_package: copyFromProduct.subpackages_per_package || undefined,
        shelf_life_value: copyFromProduct.shelf_life_value || undefined,
        shelf_life_unit: copyFromProduct.shelf_life_unit || "",
        retail_price: Number(copyFromProduct.retail_price) || 0,
        vat_rate: copyFromProduct.vat_rate || 7,
        manufacturerId: copyFromProduct.manufacturerId || undefined,
      })
    }
    // For edit mode - load data from API
    else if (product && !isCreateMode) {
      form.reset({
        name: product.name,
        brand_name: product.brand_name || "",
        form: product.form,
        dosage_value: product.dosage_value ? Number(product.dosage_value) : undefined,
        dosage_unit: product.dosage_unit,
        barcode: product.barcode || "",
        inn: product.inn || "",
        atc_code: product.atc_code || "",
        registration_number: product.registration_number || "",
        in_national_list: product.in_national_list,
        in_reimbursed_program: product.in_reimbursed_program,
        subpackage_type: product.subpackage_type || "",
        subpackages_per_package: product.subpackages_per_package || undefined,
        shelf_life_value: product.shelf_life_value || undefined,
        shelf_life_unit: product.shelf_life_unit || "",
        retail_price: Number(product.retail_price),
        vat_rate: product.vat_rate,
        manufacturerId: product.manufacturerId || undefined,
      })
    }
  }, [product, form, isCreateMode, copyFromProduct])

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      if (isCreateMode) {
        const newProduct = await createProduct.mutateAsync(data as any)

        // Upload pending photos if any
        if (pendingPhotos.length > 0) {
          await uploadPhotos.mutateAsync({ id: newProduct.id, files: pendingPhotos })
        }

        toast.success("Товар успішно створено")
        navigate(`/medical-products/${newProduct.id}`)
      } else {
        await updateProduct.mutateAsync({ id: productId!, data: data as any })
        toast.success("Товар успішно оновлено")
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Помилка збереження")
    }
  }

  const handleSaveClick = async () => {
    // Trigger form validation and check for errors
    const isValid = await form.trigger()
    console.log("Form validation:", isValid, "Errors:", form.formState.errors)
    submitButtonRef.current?.click()
  }

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const currentPhotosCount = (product?.photos?.length || 0) + pendingPhotos.length
    if (currentPhotosCount + files.length > 10) {
      toast.error(`Максимум 10 фото. Зараз: ${currentPhotosCount}`)
      return
    }

    if (isCreateMode) {
      setPendingPhotos((prev) => [...prev, ...files])
    } else {
      uploadPhotos.mutate(
        { id: productId!, files },
        {
          onSuccess: () => toast.success("Фото завантажено"),
          onError: (error: any) => toast.error(error.response?.data?.message || "Помилка завантаження"),
        },
      )
    }

    event.target.value = ""
  }

  const handleDeletePhoto = (photoId: number) => {
    deletePhoto.mutate(
      { productId: productId!, photoId },
      {
        onSuccess: () => toast.success("Фото видалено"),
        onError: (error: any) => toast.error(error.response?.data?.message || "Помилка видалення"),
      },
    )
  }

  const removePendingPhoto = (index: number) => {
    setPendingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const isLoading = productLoading || createProduct.isPending || updateProduct.isPending

  const topToolbarConfig: DynamicToolbarProps = {
    title: isCreateMode ? "Створення номенклатури" : "Редагування номенклатури",
    hideActionsMenu: true,
  }

  const innerToolbarConfig: DynamicToolbarProps = {
    items: [
      [
        {
          label: "Назад",
          icon: <ArrowLeft className="w-3.5 h-3.5" />,
          onClick: () => navigate("/medical-products"),
          variant: "default",
        },
        {
          label: "Зберегти",
          icon: <Plus className="w-3.5 h-3.5" />,
          onClick: handleSaveClick,
          variant: "primary",
          disabled: isLoading,
        },
        {
          label: "Відмінити",
          icon: null,
          onClick: () => form.reset(),
          variant: "default",
        },
      ],
    ],
  }
console.log(product)
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:7777"

  return (
    <div className="overflow-hidden max-h-screen">
      <ConfigurablePage topToolbar={topToolbarConfig} innerToolbar={innerToolbarConfig} />

      <hr />

      {isLoading && !product && !isCreateMode ? (
        <div className="p-8 text-center text-muted-foreground">Завантаження...</div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col max-h-[calc(100vh-170px)] overflow-y-auto pb-10 pt-4"
        >
          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="name"
            label="Найменування"
            description="Точна назва на упаковці"
            type="text"
            placeholder="Введіть найменування"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="form"
            label="Форма випуску"
            description="Форма випуску"
            type="select"
            placeholder="Оберіть форму випуску"
            options={[
              { label: "Таблетки", value: "tablet" },
              { label: "Капсули", value: "capsule" },
              { label: "Сироп", value: "syrup" },
              { label: "Краплі", value: "drops" },
              { label: "Мазь", value: "ointment" },
              { label: "Спрей", value: "spray" },
              { label: "Ампули", value: "ampoule" },
              { label: "Суспензія", value: "suspension" },
              { label: "Порошок", value: "powder" },
              { label: "Гель", value: "gel" },
              { label: "Крем", value: "cream" },
              { label: "Розчин", value: "solution" },
              { label: "Інше", value: "other" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="dosage_value"
            label="Доза"
            description="Числове значення дози"
            type="number"
            placeholder="0"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="dosage_unit"
            label="Одиниці виміру дози"
            description="mg, ml, g тощо"
            type="select"
            placeholder="Оберіть одиницю"
            options={[
              { label: "mg", value: "mg" },
              { label: "ml", value: "ml" },
              { label: "g", value: "g" },
              { label: "%", value: "%" },
              { label: "IU", value: "IU" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="barcode"
            label="Штрих-код"
            description="EAN-13 або UPC"
            type="text"
            placeholder="Введіть штрих-код"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="inn"
            label="МНН"
            description="Міжнародна непатентована назва"
            type="text"
            placeholder="Введіть МНН"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="retail_price"
            label="Роздрібна ціна"
            description="Ціна з ПДВ"
            type="number"
            placeholder="0.00"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="vat_rate"
            label="ПДВ %"
            description="Ставка ПДВ"
            type="select"
            placeholder="Оберіть ставку"
            options={[
              { label: "7%", value: "7" },
              { label: "20%", value: "20" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="in_national_list"
            label="Національний перелік"
            description="Входить до Національного переліку"
            type="checkbox"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="in_reimbursed_program"
            label="Доступні ліки"
            description="Входить до програми «Доступні ліки»"
            type="checkbox"
          />

          {/* Photos Section */}
          <div className="grid grid-cols-[300px_1fr] gap-4 px-4 py-3 border-b">
            <div>
              <label className="text-sm font-medium">Фото</label>
              <p className="text-xs text-muted-foreground">Максимум 10 фото</p>
            </div>
            <div>
              <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded mb-3"
              >
                Додати фото
              </button>

              <div className="flex flex-wrap gap-2">
                {/* Existing photos */}
                {product?.photos?.map((photo) => (
                  <div key={photo.id} className="relative w-20 h-20 border rounded overflow-hidden">
                    <img src={`${apiUrl}/${photo.filePath}`} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Pending photos (create mode) */}
                {pendingPhotos.map((file, index) => (
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePendingPhoto(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-bl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" ref={submitButtonRef} className="hidden" />
        </form>
      )}
    </div>
  )
}

export default FullMedicalProductPage
