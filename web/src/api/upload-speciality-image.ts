import { api } from '@/lib/axios'

export async function UploadSpecialityImage(file: File, specialityId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', file.name)
  formData.append('specialityId', specialityId)

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  }

  return api.post('/api/specialities/upload', formData, config)
}
