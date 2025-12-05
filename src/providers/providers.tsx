import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
// export function AppProviders() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <HistoryProvider>
//         <Layout>
//           <Outlet />
//         </Layout>
//       </HistoryProvider>
//     </QueryClientProvider>
//   )
// }

/* 
const AppLayout = () => {
  return (
    <HistoryProvider>
      <Layout>
        <Outlet />
      </Layout>
    </HistoryProvider>
  )
}

*/
