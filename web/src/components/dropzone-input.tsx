import { Loader, Trash2, UploadCloud } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { DropzoneState, useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Label } from './ui/label'

interface DropzoneInputProps {
  disabled: boolean
  isLoading: boolean
  returnFile: (file: File | null) => void
}

export function DropzoneInput({
  disabled,
  returnFile,
  isLoading,
}: DropzoneInputProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    returnFile(file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const removeFile = useCallback(() => {
    if (file) {
      setFile(null)
    }
  }, [file])

  const onDrop = useCallback(
    (files: File[]) => {
      if (files) {
        setFile(files[0])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [file],
  )
  const dropzone = useDropzone({
    onDropAccepted: onDrop,
    disabled: isLoading,
    multiple: false,
    maxFiles: 1,
    maxSize: 1024 * 1024 * 3, // 3 mb
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    },
    onDropRejected: (files) => {
      if (files[0].errors[0].code === 'file-too-large') {
        setFileError(
          'O arquivo é muito grande. Só é permitido arquivos até 3mb',
        )
      }
    },
    onDrop: () => {
      setFileError('')
    },
  })

  return (
    <div>
      <Input
        isLoading={isLoading}
        dropzone={dropzone}
        disabled={disabled}
        removeFile={removeFile}
        file={file}
      />
      {fileError && fileError !== '' ? (
        <span className="text-xs text-red-500">{fileError}</span>
      ) : (
        <></>
      )}
    </div>
  )
}

interface InputProps {
  dropzone: DropzoneState
  file: File | null
  disabled: boolean
  isLoading: boolean
  removeFile: () => void
}

function Input({
  dropzone,
  file,
  removeFile,
  disabled,
  isLoading,
}: InputProps) {
  const { getInputProps, open } = dropzone
  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-between">
        <Button
          disabled={disabled}
          type="button"
          onClick={open}
          variant={'outline'}
        >
          <span className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Enviando
              </>
            ) : (
              <>
                <UploadCloud className="h-5 w-5" /> Enviar imagem
              </>
            )}
          </span>
        </Button>
      </div>
      {file && (
        <div className="mt-2">
          <Label>Prévia</Label>
          <div className="mt-2">
            <Preview removeFile={removeFile} file={file} />
          </div>
        </div>
      )}
      <input {...getInputProps()} className="hidden" />
    </>
  )
}

interface PreviewProps {
  removeFile: () => void
  file: File | null
}

function Preview({ file, removeFile }: PreviewProps) {
  const fileURL = file ? URL.createObjectURL(file) : ''
  return (
    <div className="flex w-full items-center gap-5">
      <div className="flex gap-2 items-center">
        <Avatar className="w-12 h-12 rounded-md">
          <AvatarImage src={fileURL} />
          <AvatarFallback className="rounded-md">NM</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <Button type="submit" onClick={removeFile} variant={'destructive'}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
