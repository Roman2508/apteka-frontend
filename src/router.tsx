import { createBrowserRouter, Outlet } from "react-router"
import App from "./App"
import { HistoryProvider } from "./providers/history-provider"
import Layout from "./components/layout/layout"
import ReceivingDocsPage from "./pages/receiving-docs-page"

// Wrapper to provide history context to the app
const AppLayout = () => {
  return (
    <HistoryProvider>
      <Layout>
        <Outlet />
      </Layout>
    </HistoryProvider>
  )
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      // Add more routes here as needed for testing navigation
      {
        path: "/receiving-docs",
        element: <ReceivingDocsPage />,
      },
    ],
  },
])
