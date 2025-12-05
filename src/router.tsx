import { createBrowserRouter, Outlet } from 'react-router'
import App from './App'
import { HistoryProvider } from './providers/history-provider'
import Layout from './components/layout/layout'
import ReceivingDocsPage from './pages/receiving-docs-page'
import { TemplateModalExamples } from './components/custom/template-modal/template-modal-examples'
import MedicalProductsPage from './pages/medical-products-page'
import FullMedicalProductPage from './pages/full-medical-product-page'
import MobileScanPage from './pages/mobile-scan-page'
import LoginPage from './pages/login-page'

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
        path: '/',
        element: <App />,
      },
      // Add more routes here as needed for testing navigation
      {
        path: '/receiving-docs',
        element: <ReceivingDocsPage />,
      },
      {
        path: '/mobile-scan',
        element: <MobileScanPage />,
      },
      {
        path: '/template-modal-examples',
        element: <TemplateModalExamples />,
      },
      {
        path: '/medical-products',
        element: <MedicalProductsPage />,
      },
      {
        path: '/medical-products/:id',
        element: <FullMedicalProductPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <LoginPage />,
  },
])
