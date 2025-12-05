import * as React from 'react'
import { FileText, Users, Package } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth.store'
import { useLogout } from '@/hooks/use-auth'

type Tab = {
  id: string
  title: string
         type: 'counterparty' | 'document' | 'nomenclature'
}

const iconMap = {
  counterparty: <Users className="w-4 h-4 mr-1" />,
  document: <FileText className="w-4 h-4 mr-1" />,
  nomenclature: <Package className="w-4 h-4 mr-1" />,
}

export function Header() {
  const { user, session } = useAuthStore()
  const logout = useLogout()
  
  // Example tabs - in real app these might come from a navigation store
  const [tabs, setTabs] = React.useState<Tab[]>([])
  const [activeTab, setActiveTab] = React.useState('')

  // Calculate shift duration or start time string
  const shiftInfo = React.useMemo(() => {
    if (!session || !user) return 'Not logged in';
    const loginDate = new Date(session.loginAt);
    return `${user.full_name || user.username} / Pharmacy ${session.id} / Shift started: ${loginDate.toLocaleTimeString()}`;
  }, [session, user]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
      <div className="border-b border-neutral-800 bg-neutral-300">
        <div className="flex items-center justify-between pr-4">
          <TabsList className="inline-flex h-auto p-0 bg-transparent border-none rounded-none min-w-max">
             {/* Show shift info as a pseudo-tab or label if no tabs, or just alongside */}
             <div className="px-3 py-1 text-sm font-medium flex items-center">
                {shiftInfo}
             </div>

            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex items-center gap-1 px-3 pt-1.5 pb-0.5 text-sm whitespace-nowrap',
                  'border-r border-neutral-800 data-[state=active]:bg-white data-[state=active]:border-b-white',
                  'hover:bg-neutral-400 rounded-none',
                  'group flex-shrink-0 border-none'
                )}
              >
                <div className="flex items-center gap-1 border-b-2 border-success-primary mb-0.5 pb-0.5">
                  {iconMap[tab.type]}
                  <span className="">{tab.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <Button 
            size="sm" 
            className="ml-2 px-2 h-7 text-xs flex-shrink-0 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            {logout.isPending ? 'Closing...' : 'Закрити зміну'}
          </Button>
        </div>
      </div>
    </Tabs>
  )
}
