import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'

interface UserSession {
  data: {
    name: string
    email: string
  }
}

interface AuthContextProps {
  status: 'authenticated' | 'unauthenticated' | 'loading'
  userSession: UserSession | null
  saveUserSession: (data: UserSession) => void
}

const AuthContext = createContext<AuthContextProps>({
  status: 'loading',
  userSession: null,
  saveUserSession: () => {},
})

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<
    'authenticated' | 'unauthenticated' | 'loading'
  >('loading')

  const [userSession, setUserSession] = useState<null | UserSession>(null)

  useEffect(() => {
    const savedStatus = Cookies.get('authStatus')

    if (savedStatus === 'authenticated') {
      setStatus('authenticated')
    } else {
      setStatus('unauthenticated')
    }
  }, [])

  function saveUserSession(data: UserSession) {
    setUserSession(data)
  }

  return (
    <AuthContext.Provider value={{ status, userSession, saveUserSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
