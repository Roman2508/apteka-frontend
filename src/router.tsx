import { createBrowserRouter, Outlet } from "react-router"

import App from "./App"
import LoginPage from "./pages/login-page"
import UsersPage from "./pages/users-page"
import Layout from "./components/layout/layout"
import MobileScanPage from "./pages/mobile-scan-page"
import ReceivingDocsPage from "./pages/receiving-docs-page"
import CounterpartiesPage from "./pages/counterparties-page"
import { HistoryProvider } from "./providers/history-provider"
import { RequireAuth } from "./components/layout/require-auth"
import MedicalProductsPage from "./pages/medical-products-page"
import FullMedicalProductPage from "./pages/full-medical-product-page"
import ReceivingVerificationPage from "./pages/receiving-verification-page"
import { TemplateModalExamples } from "./components/custom/template-modal/template-modal-examples"
import PharmacyChainsPage from "./pages/pharmacy-chains-page"

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
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Temporary
          {
            path: "/",
            element: <App />,
          },
          {
            path: "/template-modal-examples",
            element: <TemplateModalExamples />,
          },
          
          // Склад
          {
            path: "/receiving-docs",
            element: <ReceivingDocsPage />,
          },
          {
            path: "/receiving-docs/:id",
            element: <ReceivingVerificationPage />,
          },

          // Адміністрування
          {
            path: "/medical-products",
            element: <MedicalProductsPage />,
          },
          {
            path: "/medical-products/:id",
            element: <FullMedicalProductPage />,
          },
          {
            path: "/counterparties",
            element: <CounterpartiesPage />,
          },

          {
            path: "/pharmacy-chains",
            element: <PharmacyChainsPage />,
          },
          {
            path: "/pharmacy-points",
            element: <UsersPage />, // replace
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
        ],
      },
    ],
  },

  {
    element: <RequireAuth />,
    children: [
      {
        path: "/mobile-scan",
        element: <MobileScanPage />,
      },
    ],
  },

  {
    path: "/auth",
    element: <LoginPage />,
  },
])
