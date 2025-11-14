// components/ui/sidebar-tree.tsx
import { Button } from "@/components/ui/button";
import { ChevronDown, Folder, FileText, Users, Package } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import cashRegisterImage from "../../assets/nav-icons/cash-register.png";
import salesImage from "../../assets/nav-icons/sales.png";
import storageImage from "../../assets/nav-icons/storage.png";
import reportsImage from "../../assets/nav-icons/reports.png";
import userImage from "../../assets/nav-icons/user.png";

const NAV_ITEMS = [
  {
    id: 1,
    label: "Продажі",
    icon: cashRegisterImage,
    // icon: <Folder />,
  },
  {
    id: 2,
    label: "Закупівлі",
    icon: salesImage,
  },
  {
    id: 3,
    label: "Склад",
    icon: storageImage,
  },
  {
    id: 4,
    label: "Звітність",
    icon: reportsImage,
  },
  {
    id: 5,
    label: "Мотивація",
    icon: userImage,
  },
];

export function SidebarTree() {
  const [openedId, setOpenId] = useState(1);

  return (
    <aside className="w-22 bg-[#FBED9E] border-r border-[#C0C0C0] flex flex-col">
      {/* <aside className="w-56 bg-[#FBED9E] border-r border-[#C0C0C0] flex flex-col"> */}
      {/* Заголовок */}
      <div className="h-[35px] bg-[#FFF1A1] border-b border-[#C0C0C0] flex items-center px-2">
        {/* <span className="text-sm font-bold">ЖБФФК Аптека</span> */}
      </div>

      {/* Дерево */}
      <nav className="flex-1 overflow-y-auto space-y-1 text-sm">
        {NAV_ITEMS.map((item) => (
          <TreeItem
            id={item.id}
            icon={item.icon}
            label={item.label}
            openedId={openedId}
            setOpenId={setOpenId}
          />
        ))}
      </nav>
    </aside>
  );
}

function TreeItem({
  id,
  icon,
  label,
  openedId,
  setOpenId,
}: {
  id: number;
  label: string;
  openedId: number;
  icon: string;
  setOpenId: Dispatch<SetStateAction<number>>;
}) {
  const open = openedId === id;

  return (
    <div className={open ? "bg-white" : ""}>
      <div
        onClick={() => setOpenId(id)}
        className="flex items-center gap-1 p-3 hover:underline rounded cursor-pointer"
      >
        <img src={icon} height={60} title={label} />
      </div>
    </div>
  );
}
