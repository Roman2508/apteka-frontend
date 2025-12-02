import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TemplateModal } from "./template-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ModalContentItem } from "./template-modal.types"
// import { ConfigurableTable } from "./configurable-table" // Assuming this exists based on context
// import { columns, data } from "./table-config" // Reuse existing table config for demo

export function TemplateModalExamples() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  // --- Example 1: Simple Single Column ---
  const simpleContent: ModalContentItem[] = [
    {
      type: "row",
      items: [
        { type: "input", label: "Name", content: <Input placeholder="Enter name" /> },
        { type: "input", label: "Email", content: <Input placeholder="Enter email" /> },
      ],
    },
    {
      type: "row",
      cols: 2,
      items: [
        { type: "input", label: "City", content: <Input placeholder="City" /> },
        { type: "input", label: "Zip", content: <Input placeholder="Zip" /> },
      ],
    },
  ]

  // --- Example 2: Two Column Layout ---
  const twoColumnContent: ModalContentItem[] = [
    {
      type: "section",
      title: "Personal Info",
      rows: [
        {
          type: "row",
          items: [{ type: "input", label: "First Name", content: <Input /> }],
        },
        {
          type: "row",
          items: [{ type: "input", label: "Last Name", content: <Input /> }],
        },
      ],
    },
    {
      type: "section",
      title: "Account Details",
      rows: [
        {
          type: "row",
          items: [{ type: "input", label: "Username", content: <Input /> }],
        },
        {
          type: "row",
          items: [{ type: "input", label: "Role", content: <Input /> }],
        },
      ],
    },
  ]

  // --- Example 3: Complex with Tabs and Table ---
  const complexContent: ModalContentItem[] = [
    {
      type: "row",
      items: [
        {
          type: "tabs",
          content: (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 border rounded-md p-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order ID</label>
                    <Input value="#12345" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Input value="Processing" readOnly />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-2">
                <div className="border rounded-md">
                  {/* Simplified table for demo */}
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Table Component would go here.
                    <br />
                    (ConfigurableTable can be embedded)
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ),
        },
      ],
    },
  ]

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Universal Modal Examples</h2>

      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => setOpenModal("simple")}>Open Simple Modal</Button>
        <Button onClick={() => setOpenModal("two-column")}>Open Two-Column Modal</Button>
        <Button onClick={() => setOpenModal("complex")}>Open Complex Modal</Button>
      </div>

      {/* Simple Modal */}
      <TemplateModal
        isOpen={openModal === "simple"}
        onClose={() => setOpenModal(null)}
        title="Edit User Profile"
        content={simpleContent}
        footer={{
          onConfirm: () => {
            alert("Saved!")
            setOpenModal(null)
          },
        }}
      />

      {/* Two Column Modal */}
      <TemplateModal
        isOpen={openModal === "two-column"}
        onClose={() => setOpenModal(null)}
        title="User Settings"
        layout="two-column"
        maxWidth="sm:max-w-[800px]"
        content={twoColumnContent}
      />

      {/* Complex Modal */}
      <TemplateModal
        isOpen={openModal === "complex"}
        onClose={() => setOpenModal(null)}
        title="Order Details"
        maxWidth="sm:max-w-[700px]"
        content={complexContent}
        footer={{
          confirmText: "Update Order",
          cancelText: "Close",
        }}
      />
    </div>
  )
}
