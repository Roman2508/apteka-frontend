import { useState } from "react"

import { NAV_ITEMS } from "./nav-items"
import { Link } from "react-router"

export function SidebarTree() {
  const [openedId, setOpenId] = useState<number | null>(null)

  return (
    <aside className="bg-primary-100 border-r border-neutral-800 flex flex-col">
      <div className="w-22 h-[34px] border-b border-neutral-800 flex items-center px-2" />

      {/* Дерево */}
      <nav className="flex-1 space-y-1 text-sm relative">
        {NAV_ITEMS.map((item) => {
          const open = openedId === item.id

          return (
            <div className="">
              <div className={open ? "bg-white w-22" : "w-22"}>
                <div
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="flex items-center gap-1 p-3 hover:underline rounded cursor-pointer"
                >
                  <img src={item.icon} height={60} title={item.label} />
                </div>
              </div>

              {open && (
                <div className="absolute z-[9] left-[100%] top-0 h-[calc(100vh-35px)] w-[calc(100vw-100%)] bg-white border border-neutral-800 shadow-lg p-6">
                  <div className="flex flex-col flex-wrap max-h-[80%] inline-flex gap-x-6">
                    {NAV_ITEMS.find((n) => n.id === item.id)?.items.map((section) => (
                      <div key={section.title} className="p-4">
                        <h3 className="text-success-primary mb-2 text-md">{section.title}</h3>
                        <ul>
                          {section.links.map((link) => (
                            <li key={link.label} className="mb-1 text-base hover:underline">
                              <Link to={link.path} onClick={() => setOpenId(null)}>
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
