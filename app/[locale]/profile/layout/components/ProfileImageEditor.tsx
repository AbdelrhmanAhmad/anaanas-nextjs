'use client'

import { useState, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { BsCamera } from 'react-icons/bs'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useNotificationContext } from '@/context/useNotificationContext'
import { getApiUrl } from '@/lib/api/config'

type ProfileImageEditorProps = {
  currentImage?: string
  type: 'avatar' | 'cover'
  onUpdate?: () => void
}

export default function ProfileImageEditor({ currentImage, type, onUpdate }: ProfileImageEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const router = useRouter()
  const { showNotification } = useNotificationContext()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification({ message: 'يرجى اختيار ملف صورة', variant: 'danger' })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification({ message: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت', variant: 'danger' })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    if (!session) {
      showNotification({ message: 'يجب تسجيل الدخول أولاً', variant: 'danger' })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      const fieldName = type === 'avatar' ? 'avatar_file' : 'cover_image_file'
      formData.append(fieldName, file)

      // Get accessToken from session
      const accessToken = (session as any)?.accessToken
      if (!accessToken) {
        showNotification({ message: 'جلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى', variant: 'danger' })
        return
      }

      // Send directly to Laravel
      const res = await fetch(getApiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        showNotification({ message: 'تم تحديث الصورة بنجاح', variant: 'success' })
        setPreview(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        // Call onUpdate to refresh user data immediately
        onUpdate?.()
        // Also refresh router to ensure UI updates
        setTimeout(() => {
          router.refresh()
        }, 100)
      } else {
        showNotification({ message: data.message || 'فشل تحديث الصورة', variant: 'danger' })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      showNotification({ message: 'حدث خطأ أثناء رفع الصورة', variant: 'danger' })
    } finally {
      setUploading(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={handleFileSelect}
      />
      <Button
        variant="light"
        size="sm"
        className="position-absolute"
        style={{
          [type === 'avatar' ? 'bottom' : 'top']: '10px',
          [type === 'avatar' ? 'right' : 'right']: '10px',
          zIndex: 10,
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <BsCamera />
      </Button>
      {preview && (
        <Modal show={!!preview} onHide={handleCancel} centered>
          <Modal.Header closeButton>
            <Modal.Title>معاينة الصورة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <Image
                src={preview}
                alt="Preview"
                width={type === 'avatar' ? 200 : 600}
                height={type === 'avatar' ? 200 : 300}
                style={{
                  objectFit: 'cover',
                  borderRadius: type === 'avatar' ? '50%' : '8px',
                  width: '100%',
                  maxHeight: type === 'avatar' ? '200px' : '300px',
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'جاري الرفع...' : 'رفع'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  )
}
