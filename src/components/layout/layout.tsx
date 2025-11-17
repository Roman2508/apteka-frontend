import { useState, type FC, type PropsWithChildren } from 'react'

import { PageToolbar } from '../custom/page-toolbar'
import { SidebarTree } from '../custom/sidebar-tree'
import { DynamicTabs } from '../custom/dynamic-tabs'

/* 
Пропс для верхньоъ області сторінок:
- prepend - додати кнопки на початок
- insertBetween - Вставить між елементами	
- append - додати кнопки в кынець
- (для таблиць) має бути можливість обернути таблицю в контейнер зі своїми action buttons
- (для таблиць) має бути можливість зробити вкладки з різними таблицями
- (для таблиць) різні колонки в таблиці і можливість пошуку та сортування за кожною з них 
*/

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className="h-screen flex flex-col overflow-hidden min-h-screen bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* === ЛІВА ПАНЕЛЬ (ДЕРЕВО) === */}
        <SidebarTree />

        {/* === ОСНОВНА ОБЛАСТЬ === */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* === ВКЛАДКИ + ТУЛБАР === */}
          <div className="flex flex-col">
            <DynamicTabs />
            {/* <div className="px-4">
              <PageToolbar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            </div> */}
          </div>

          {/* === КОНТЕНТ === */}
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout
