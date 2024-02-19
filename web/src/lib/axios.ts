import axios from 'axios'

import { env } from '@/env'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    // Obtém o token de acesso do cookie
    const accessToken = Cookies.get('clickbeard_accesstoken')

    // Se o token existir, adiciona ao cabeçalho de autorização
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    Cookies.remove('clickbeard_accesstoken')
    return Promise.reject(error)
  },
)

if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return config
  })
}
