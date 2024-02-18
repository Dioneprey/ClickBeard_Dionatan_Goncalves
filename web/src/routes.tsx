import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from './pages/_layouts/auth'
import { SignIn } from './pages/auth/sign-in'
import { SignUp } from './pages/auth/sign-up'
import { NotFound } from './pages/404'
import { AppLayout } from './pages/_layouts/app'
import { Home } from './pages/app/home/home'
import { Schedule } from './pages/app/schedule/schedule'
import { Appointments } from './pages/app/appointments/appointments'
import { ScheduleContextProvider } from './context/schedule-context'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/agendar',
        element: (
          <ScheduleContextProvider>
            <Schedule />
          </ScheduleContextProvider>
        ),
      },
      { path: '/agendamentos', element: <Appointments /> },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
    ],
  },
])
