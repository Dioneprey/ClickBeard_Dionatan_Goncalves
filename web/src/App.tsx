import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { router } from './route/routes'
import { queryClient } from './lib/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme/theme-provider'
import './global.css'
import { AuthContextProvider } from './context/auth-context'

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="clickbeard-theme" defaultTheme="dark">
        <AuthContextProvider>
          <Toaster richColors />
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
