// components/ui/toolbar.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Plus,
  Search,
  MoreHorizontal,
  ArrowBigDown,
} from "lucide-react";

export function Toolbar() {
  return (
    <div className="pt-4 px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button size="icon" className="w-10 h-7 px-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" className="w-10 h-7 px-0">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <h1 className="text-lg">Документи прийому</h1>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="default" size="sm">
          <Plus className="w-3 h-3 mr-1" />
          Створити
        </Button>

        <div className="flex-1" />

        {/* Пошук */}
        <div className="flex items-center gap-1">
          <Input placeholder="Пошук (Ctrl+F)" className="h-7 w-48 text-xs" />
          <Button size="icon" className="w-10 h-7 px-0">
            <Search className="w-4 h-4" />
          </Button>
          <Button size="icon" className="w-10 h-7 px-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
