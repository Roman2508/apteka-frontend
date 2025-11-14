import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { X, FileText, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  title: string;
  type: "counterparty" | "document" | "nomenclature";
};

const iconMap = {
  counterparty: <Users className="w-4 h-4 mr-1" />,
  document: <FileText className="w-4 h-4 mr-1" />,
  nomenclature: <Package className="w-4 h-4 mr-1" />,
};

export function DynamicTabs() {
  const [tabs, setTabs] = React.useState<Tab[]>([
    {
      id: "1",
      title:
        "Пташник Роман / 1123 каса зав прро / Зміна 1123-000679 від 14.11.2025 21:24:56 (Відкрита): 1:52 год",
      type: "counterparty",
    },
  ]);
  const [activeTab, setActiveTab] = React.useState("1");

  const openTab = (type: Tab["type"], title: string) => {
    const newId = Date.now().toString();
    const newTab: Tab = { id: newId, title, type };
    setTabs((prev) => [...prev, newTab]);
    setActiveTab(newId);
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) return prev;
      const closedIndex = prev.findIndex((t) => t.id === id);
      const newActive =
        filtered[closedIndex] || filtered[closedIndex - 1] || filtered[0];
      setActiveTab(newActive.id);
      return filtered;
    });
  };

  const tabsListRef = React.useRef<HTMLDivElement>(null);

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex flex-col h-full"
    >
      <div className="border-b border-[#C0C0C0] bg-[#F0F0F0]">
        <div
          ref={tabsListRef}
          className="flex items-center justify-between pr-4"
        >
          <TabsList className="inline-flex h-auto p-0 bg-transparent border-none rounded-none min-w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex items-center gap-1 px-3 pt-1.5 pb-0.5 text-sm whitespace-nowrap",
                  "border-r border-[#C0C0C0] data-[state=active]:bg-white data-[state=active]:border-b-white",
                  "hover:bg-[#E6E6E6] rounded-none",
                  "group flex-shrink-0 border-none"
                )}
              >
                <div className="flex items-center gap-1 border-b-2 border-green-500 mb-0.5 pb-0.5">
                  {iconMap[tab.type]}

                  <span className="">{tab.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button size="sm" className="ml-2 px-2 h-7 text-xs flex-shrink-0">
            Закрити зміну
          </Button>
        </div>
      </div>
    </Tabs>
  );
}
