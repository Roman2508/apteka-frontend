import * as z from "zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { ConfigurablePage } from "../components/custom/configurable-page.tsx"
import { TemplateFormItem } from "../components/custom/template-form-item.tsx"
import type { DynamicToolbarProps } from "../components/custom/dynamic-toolbar.tsx"

// --- Schema Definition ---
const productSchema = z.object({
  name: z.string().min(1, "Найменування обов'язкове"),
  brand_name: z.string().optional(),
  form: z.string().optional(),
  dosage_value: z.number().optional(),
  dosage_unit: z.string().optional(),
  barcode: z.string().optional(),
  inn: z.string().optional(),
  atc_code: z.string().optional(),
  registration_number: z.string().optional(),
  is_national_list: z.boolean().optional(),
  is_affordable_medicines: z.boolean().optional(),
  subpackage_type: z.string().optional(),
  subpackages_per_package: z.number().optional(),
  shelf_life_value: z.number().optional(),
  shelf_life_unit: z.string().optional(),
  retail_price: z.number().optional(),
  vat: z.string().optional(),
  manufacturer: z.string().optional(),
  photos: z.any().optional(), // FileList or array of files
})

type ProductFormValues = z.infer<typeof productSchema>

// --- Mock Data ---
const mockInitialData: Partial<ProductFormValues> = {
  name: "Нурофен",
  brand_name: "brand1",
  form: "tablets",
  dosage_value: 200,
  dosage_unit: "mg",
  is_national_list: true,
}

const FullMedicalProductPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Form initialization
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_national_list: false,
      is_affordable_medicines: false,
    },
  })

  // Simulate async data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form with loaded data
      form.reset(mockInitialData)
      setIsLoading(false)
    }

    loadData()
  }, [form])

  const onSubmit = (data: ProductFormValues) => {
    console.log("Form submitted:", data)
    alert("Form submitted! Check console for data.")
  }

  const handleSaveClick = () => {
    // Trigger hidden submit button
    submitButtonRef.current?.click()
  }

  const topToolbarConfig: DynamicToolbarProps = {
    title: "Створення номенклатури",
    hideActionsMenu: true,
  }

  const innerToolbarConfig: DynamicToolbarProps = {
    items: [
      [
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

  return (
    <div className="overflow-hidden max-h-screen">
      <ConfigurablePage topToolbar={topToolbarConfig} innerToolbar={innerToolbarConfig} />

      <hr />

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
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
            name="brand_name"
            label="Торгова марка"
            description="Торгова марка, якщо є (наприклад, Нурофєн, Парацетамол)"
            type="select"
            placeholder="Оберіть торгову марку"
            options={[
              { label: "Нурофєн", value: "brand1" },
              { label: "Парацетамол", value: "brand2" },
            ]}
            inputClassName="w-[300px]"
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
              { label: "Таблетки", value: "tablets" },
              { label: "Сироп", value: "syrup" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="dosage_value"
            label="Доза"
            description="Числове значення дози, напр. 500, 0.5, 10"
            type="number"
            placeholder="0"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="dosage_unit"
            label="Одиниці виміру дози"
            description="Одиниця виміру дози: mg, ml, g, %, IU тощо"
            type="select"
            placeholder="Оберіть одиницю"
            options={[
              { label: "mg", value: "mg" },
              { label: "ml", value: "ml" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="barcode"
            label="Штрих-код"
            description="Штрих-код EAN-13 або UPC"
            type="text"
            placeholder="Введіть штрих-код"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="inn"
            label="МНН"
            description="Міжнародна непатентована назва (МНН)"
            type="text"
            placeholder="Введіть МНН"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="atc_code"
            label="Код ATC"
            description="ATC-класифікація"
            type="text"
            placeholder="Введіть код ATC"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="registration_number"
            label="Номер реєстраційного посвідчення"
            description="Номер реєстраційного посвідчення МОЗ України"
            type="text"
            placeholder="Введіть номер"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="is_national_list"
            label="Національний перелік"
            description="Чи входить до Національного переліку основних лікарських засобів"
            type="checkbox"
            inputClassName=""
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="is_affordable_medicines"
            label="Доступні ліки"
            description="Чи входить до програми «Доступні ліки»"
            type="checkbox"
            inputClassName=""
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="subpackage_type"
            label="Тип упаковки"
            description="Тип внутрішньої упаковки"
            type="select"
            placeholder="Оберіть тип"
            options={[
              { label: "Блістер", value: "blister" },
              { label: "Ампула", value: "ampoule" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="subpackages_per_package"
            label="В упаковці"
            description="Кількість блістерів/ампули/саше в одній упаковці"
            type="number"
            placeholder="0"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="shelf_life_value"
            label="Термін придатності"
            description="Термін придатності – кількість одиниць"
            type="number"
            placeholder="0"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="shelf_life_unit"
            label="Одиниця виміру"
            description="Одиниця виміру терміну придатності"
            type="select"
            placeholder="Оберіть одиницю"
            options={[
              { label: "Місяці", value: "months" },
              { label: "Роки", value: "years" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="retail_price"
            label="Роздрібна ціна"
            description="Роздрібна ціна з ПДВ (ціна продажу)"
            type="number"
            placeholder="0.00"
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="vat"
            label="ПДВ"
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
            name="manufacturer"
            label="Виробник"
            description="Найменування виробника"
            type="select"
            placeholder="Оберіть виробника"
            options={[
              { label: "Фармак", value: "farmak" },
              { label: "Дарниця", value: "darnytsia" },
            ]}
          />

          <TemplateFormItem
            className="grid-cols-[300px_1fr]"
            control={form.control}
            name="photos"
            label="Фото"
            description="Фото товару"
            type="file"
          />

          {/* Hidden submit button */}
          <button type="submit" ref={submitButtonRef} className="hidden" />
        </form>
      )}
    </div>
  )
}

export default FullMedicalProductPage
