'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { MediaPicker } from './MediaPicker'

export function NewMemoryForm() {
  const router = useRouter()
  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    console.log(formData)

    const fileToUpload = formData.get('media')

    console.log(fileToUpload)

    let converUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('media', fileToUpload)
      const uploadResponse = await api.post('uplod', uploadFormData)
      console.log(uploadResponse.data)

      converUrl = uploadResponse.data.fileUrl
      console.log(converUrl)
    }
    const token = Cookie.get('token')
    console.log(token)

    await api.post(
      'memories',
      {
        converUrl,

        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="item-center flex gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label
          className="flex items-center  gap-1.5 text-sm text-gray-200 hover:text-gray-100"
          htmlFor="isPublic"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded-full border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker />
      <textarea
        name="content"
        spellCheck={false}
        className=" w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
