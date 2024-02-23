import { api } from '@/lib/axios'

export async function UploadBarberImage(file: File, barberId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('barberId', barberId)

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  return api.post('/api/barbers/upload', formData, config)
}
