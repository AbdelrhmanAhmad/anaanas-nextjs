'use client'

import { useState } from 'react'
import { Alert, Button, Card, CardBody, CardHeader } from 'react-bootstrap'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Spinner } from 'react-bootstrap'

const AccountClose = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)

  const handleDeleteAccount = async () => {
    if (!confirmed) {
      setMessage({ type: 'danger', text: 'يجب الموافقة على حذف الحساب أولاً' })
      return
    }

    if (status !== 'authenticated') {
      setMessage({ type: 'danger', text: 'يجب تسجيل الدخول أولاً' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/request-account-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      })

      const json = await res.json()

      if (res.ok && json.success) {
        setMessage({ 
          type: 'success', 
          text: 'تم طلب حذف الحساب بنجاح. سيتم تسجيل خروجك الآن. سيتم حذف حسابك نهائياً بعد 30 يوم إذا لم تقم بتسجيل الدخول خلال هذه الفترة.' 
        })
        
        // Sign out after a short delay
        setTimeout(async () => {
          await signOut({ redirect: true, callbackUrl: '/' })
        }, 2000)
      } else {
        setMessage({ type: 'danger', text: json.message || 'فشل طلب حذف الحساب' })
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'حدث خطأ أثناء طلب حذف الحساب' })
    } finally {
      setLoading(false)
    }
  }

  if (status !== 'authenticated') {
    return (
      <Card>
        <CardBody>
          <Alert variant="warning">يجب تسجيل الدخول لعرض هذه الصفحة</Alert>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-0 pb-0">
        <h5 className="card-title">حذف الحساب</h5>
        <p className="mb-0">
          يمكنك طلب حذف حسابك. سيتم تسجيل خروجك فوراً، وإذا لم تقم بتسجيل الدخول خلال 30 يوم، سيتم حذف حسابك نهائياً.
        </p>
      </CardHeader>
      <CardBody>
        {message && (
          <Alert variant={message.type} dismissible onClose={() => setMessage(null)} className="mb-3">
            {message.text}
          </Alert>
        )}

        <h6 className="mb-3">قبل المتابعة، يرجى الاطلاع على ما يلي:</h6>
        <ul className="mb-4">
          <li className="mb-2">
            <strong>فترة السماح:</strong> بعد طلب الحذف، سيتم تسجيل خروجك فوراً. لديك 30 يوم لتسجيل الدخول مرة أخرى لإلغاء طلب الحذف.
          </li>
          <li className="mb-2">
            <strong>فقدان البيانات:</strong> عند حذف حسابك نهائياً، سيتم حذف جميع بياناتك بما في ذلك:
            <ul className="mt-2">
              <li>المنشورات والإعلانات</li>
              <li>التعليقات والتفاعلات</li>
              <li>الدردشات والرسائل</li>
              <li>المعلومات الشخصية</li>
            </ul>
          </li>
          <li className="mb-2">
            <strong>عدم إمكانية الاسترجاع:</strong> بعد انتهاء فترة الـ 30 يوم وحذف الحساب، لن يمكن استرجاع أي بيانات.
          </li>
          <li className="mb-2">
            <strong>إلغاء الطلب:</strong> يمكنك إلغاء طلب الحذف في أي وقت خلال الـ 30 يوم عن طريق تسجيل الدخول فقط.
          </li>
        </ul>

        <div className="form-check form-check-md my-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="deleteaccountCheck"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="deleteaccountCheck">
            نعم، أريد حذف حسابي وأدرك أن جميع بياناتي سيتم حذفها نهائياً بعد 30 يوم
          </label>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="success-soft"
            size="sm"
            className="mb-2 mb-sm-0"
            onClick={() => router.back()}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="mb-0"
            onClick={handleDeleteAccount}
            disabled={loading || !confirmed}
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                جاري المعالجة...
              </>
            ) : (
              'حذف حسابي'
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default AccountClose
