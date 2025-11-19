import { type FC, type PropsWithChildren } from "react"

import { SidebarTree } from "../custom/sidebar-tree"
import { DynamicTabs } from "../custom/dynamic-tabs"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden min-h-screen bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* === ЛІВА ПАНЕЛЬ (ДЕРЕВО) === */}
        <SidebarTree />

        {/* === ОСНОВНА ОБЛАСТЬ === */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* === ВКЛАДКИ === */}
          <div className="flex flex-col">
            <DynamicTabs />
          </div>

          {/* === КОНТЕНТ === */}
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout
