import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'
import { signIn } from '@/api/sign-in'
import { validateToken } from '@/api/validate-token'
import { getUserProfile } from '@/api/get-user-profile'
import { User } from '@/@interfaces/User'

export interface SignInBody {
  email: string
  password: string
}

interface AuthContextProps {
  status: 'authenticated' | 'unauthenticated' | 'loading'
  user: User
  Logout: () => void
  SignIn: (data: SignInBody) => Promise<void>
}

const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  role: 'client',
  createdAt: new Date(),
}

const AuthContext = createContext<AuthContextProps>({
  status: 'loading',
  user: defaultUser,
  Logout: () => {},
  SignIn: async () => {},
})

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)
  const [status, setStatus] = useState<
    'authenticated' | 'unauthenticated' | 'loading'
  >('loading')

  useEffect(() => {
    validateUser()
  }, [])

  async function validateUser() {
    try {
      await validateToken()

      const { data } = await getUserProfile()

      setUser(data.user)
      setStatus('authenticated')
    } catch (error) {
      console.log(error)

      setStatus('unauthenticated')
    }
  }

  async function SignIn({ email, password }: SignInBody) {
    try {
      const { data } = await signIn({ email, password })
      setStatus('authenticated')

      const { accessToken } = data
      Cookies.set('clickbeard_accesstoken', accessToken, { expires: 1 })

      const { data: userData } = await getUserProfile()

      setUser(userData.user)
    } catch (error) {
      console.log(error)

      throw error
    }
  }

  function Logout() {
    Cookies.remove('clickbeard_accesstoken')
    setUser(defaultUser)
    setStatus('unauthenticated')
  }

  return (
    <AuthContext.Provider value={{ status, user, SignIn, Logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
