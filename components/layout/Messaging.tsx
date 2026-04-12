'use client'

import Link from 'next/link'
import useToggle from '@/hooks/useToggle'
import type { ChatMessageType, ChatType } from '@/types/data'
import clsx from 'clsx'
import Image from 'next/image'
import {
  Button,
  Collapse,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Toast,
  ToastContainer,
  ToastHeader,
} from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import { FaFaceSmile, FaPaperclip, FaXmark } from 'react-icons/fa6'
import { BsChatSquareText, BsDashLg, BsFlag, BsThreeDotsVertical } from 'react-icons/bs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useChatContext } from '@/context/useChatContext'
import TextAreaFormInput from '../form/TextAreaFormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import avatar10 from '@/assets/images/avatar/10.jpg'

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (elementRef?.current?.scrollIntoView) elementRef.current.scrollIntoView({ behavior: 'smooth' })
  })
  return <div ref={elementRef} />
}

type ApiMessage = {
  id: string
  sender_id: number | string
  sender?: { id: number | string; name: string; avatar?: string | null }
  body: string
  is_read?: boolean
  created_at: string
}

const ToastUserMessage = ({
  message,
  currentUserId,
}: {
  message: ChatMessageType
  currentUserId: number | string
}) => {
  const mine = String(message.from.id) === String(currentUserId)
  return (
    <div className={clsx('d-flex mb-1', { 'justify-content-end text-end': mine })}>
      <div className="flex-shrink-0 avatar avatar-xs me-2">
        {!mine && message.from.avatar && (
          <Image className="avatar-img rounded-circle" src={message.from.avatar as any} alt="" width={28} height={28} />
        )}
      </div>
      <div className="flex-grow-1">
        <div
          className={clsx(
            'p-2 px-3 rounded-2 small',
            mine ? 'bg-primary text-white' : 'bg-light text-secondary',
          )}
        >
          {message.message}
        </div>
        <div className="small text-secondary mt-1">
          {message.sentOn.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric' })}
        </div>
      </div>
    </div>
  )
}

const Messaging = () => {
  const params = useParams<{ locale?: string }>()
  const locale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale || 'ar'
  const { data: session } = useSession()
  const currentUserId = (session as any)?.user?.id

  const { isTrue: isOpen, toggle, setTrue } = useToggle()
  const { activeChat, chats, changeActiveChat, refreshChats } = useChatContext()
  const { isTrue: isOpenCollapseToast, toggle: toggleToastCollapse } = useToggle(true)

  const [userMessages, setUserMessages] = useState<ChatMessageType[]>([])
  const messageSchema = yup.object({
    newMessage: yup.string().required('Please enter message'),
  })

  const { reset, handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })

  useEffect(() => {
    void refreshChats()
  }, [refreshChats])

  const loadMessages = useCallback(
    async (chatId: string) => {
      if (!chatId) return
      try {
        const res = await fetch(`/api/chats/${chatId}/messages?per_page=40`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          const mapped: ChatMessageType[] = json.data.map((m: ApiMessage) => {
            const sentOn = m.created_at ? new Date(m.created_at) : new Date()
            const sender = m.sender || { id: m.sender_id, name: 'User', avatar: null }
            return {
              id: m.id,
              from: {
                id: String(sender.id),
                name: sender.name,
                avatar: (sender.avatar as any) || avatar10,
                mutualCount: 0,
                role: 'user',
                status: 'online',
                lastMessage: '',
                lastActivity: sentOn,
                isStory: false,
              },
              to: {
                id: String(currentUserId || ''),
                name: 'you',
                avatar: avatar10,
                mutualCount: 0,
                role: 'user',
                status: 'online',
                lastMessage: '',
                lastActivity: sentOn,
                isStory: false,
              },
              message: m.body,
              sentOn,
              isRead: m.is_read ?? false,
              isSend: String(m.sender_id) === String(currentUserId),
            }
          })
          setUserMessages(mapped)
        }
      } catch (e) {
        console.error(e)
      }
    },
    [currentUserId],
  )

  useEffect(() => {
    if (activeChat?.id) {
      void loadMessages(String(activeChat.id))
      void fetch(`/api/chats/${activeChat.id}/read`, { method: 'POST' })
    }
  }, [activeChat?.id, loadMessages])

  const sendChatMessage = async (values: { newMessage?: string }) => {
    if (!activeChat?.id || !values.newMessage?.trim()) return
    try {
      const res = await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ body: values.newMessage }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        const m = json.data as ApiMessage
        const sentOn = m.created_at ? new Date(m.created_at) : new Date()
        const sender = m.sender || {
          id: m.sender_id,
          name: (session as any)?.user?.name || 'You',
          avatar: (session as any)?.user?.image,
        }
        setUserMessages((prev) => [
          ...prev,
          {
            id: m.id,
            from: {
              id: String(sender.id),
              name: sender.name,
              avatar: (sender.avatar as any) || avatar10,
              mutualCount: 0,
              role: 'user',
              status: 'online',
              lastMessage: '',
              lastActivity: sentOn,
              isStory: false,
            },
            to: {
              id: String(activeChat.other_user?.id || ''),
              name: activeChat.other_user?.name || '',
              avatar: avatar10,
              mutualCount: 0,
              role: 'user',
              status: 'online',
              lastMessage: '',
              lastActivity: sentOn,
              isStory: false,
            },
            message: m.body,
            sentOn,
            isRead: false,
            isSend: true,
          },
        ])
        reset()
        void refreshChats()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openChat = (chat: ChatType) => {
    setTrue()
    void changeActiveChat(chat.id)
  }

  const previewChats = chats.slice(0, 8)

  return (
    <>
      <ul className="list-unstyled mb-0">
        {previewChats.length === 0 ? (
          <li className="small text-muted py-2">لا توجد محادثات بعد</li>
        ) : (
          previewChats.map((chat) => {
            const other = chat.other_user
            return (
              <li
                key={String(chat.id)}
                onClick={() => openChat(chat)}
                className="mt-3 hstack gap-3 align-items-center position-relative toast-btn cursor-pointer"
                data-target="chatToast"
              >
                <div className="flex-shrink-0 avatar status-online">
                  {other?.avatar ? (
                    <Image className="avatar-img rounded-circle" src={other.avatar as any} alt="" width={40} height={40} />
                  ) : (
                    <div className="avatar-img rounded-circle bg-light d-flex align-items-center justify-content-center text-uppercase small">
                      {(other?.name || '?').slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="h6 mb-0">{other?.name || 'مستخدم'}</div>
                  <div className="small text-secondary text-truncate">
                    {chat.last_message?.body || '…'}
                  </div>
                </div>
                {chat.unread_count > 0 && (
                  <span className="badge bg-primary rounded-pill ms-auto">{chat.unread_count}</span>
                )}
              </li>
            )
          })
        )}

        <li className="mt-3 d-grid">
          <Link className="btn btn-primary-soft" href={`/${locale}/messaging`}>
            عرض كل المحادثات
          </Link>
        </li>
      </ul>

      <div aria-live="polite" aria-atomic="true" className="position-relative">
        <ToastContainer className="toast-chat d-flex gap-3 align-items-end">
          <Toast
            show={isOpen}
            onClose={toggle}
            id="chatToast"
            className="mb-0 bg-mode"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-bs-autohide="false"
          >
            <ToastHeader closeButton={false} className="bg-mode">
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex">
                  <div className="flex-shrink-0 avatar me-2">
                    {activeChat?.other_user?.avatar ? (
                      <Image
                        className="avatar-img rounded-circle"
                        src={activeChat.other_user.avatar as any}
                        alt=""
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="avatar-img rounded-circle bg-light d-flex align-items-center justify-content-center text-uppercase">
                        {(activeChat?.other_user?.name || '?').slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-0 mt-1">{activeChat?.other_user?.name || 'مستخدم'}</h6>
                    {activeChat?.post?.title && (
                      <div className="small text-secondary text-truncate" style={{ maxWidth: 200 }}>
                        {activeChat.post.title}
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex">
                  <Dropdown drop="start">
                    <DropdownToggle
                      as="a"
                      className="btn btn-secondary-soft-hover py-1 px-2 content-none"
                      id="chatOffcanvasDropdown"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      <BsThreeDotsVertical />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-end" aria-labelledby="chatOffcanvasDropdown">
                      <li>
                        <DropdownItem as={Link} href={`/${locale}/messaging${activeChat?.id ? `?chat=${activeChat.id}` : ''}`}>
                          <BsChatSquareText className="me-2 fw-icon" />
                          فتح في الصفحة
                        </DropdownItem>
                      </li>
                      <li className="dropdown-divider" />
                      <li>
                        <DropdownItem href="#" className="text-muted" disabled>
                          <BsFlag className="me-2 fw-icon" />
                          إبلاغ
                        </DropdownItem>
                      </li>
                    </DropdownMenu>
                  </Dropdown>
                  <a className="btn btn-secondary-soft-hover py-1 px-2" data-bs-toggle="collapse" onClick={toggleToastCollapse}>
                    <BsDashLg />
                  </a>
                  <button onClick={toggle} className="btn btn-secondary-soft-hover py-1 px-2" data-bs-dismiss="toast" aria-label="Close">
                    <FaXmark />
                  </button>
                </div>
              </div>
            </ToastHeader>
            <Collapse in={isOpenCollapseToast} className="toast-body">
              <div>
                <SimpleBar className="chat-conversation-content custom-scrollbar h-200px">
                  {userMessages.map((message) => (
                    <ToastUserMessage message={message} key={message.id} currentUserId={currentUserId || ''} />
                  ))}
                  <AlwaysScrollToBottom />
                </SimpleBar>
                <form onSubmit={handleSubmit(sendChatMessage)} className="mt-2">
                  <TextAreaFormInput
                    className="mb-sm-0 mb-3"
                    name="newMessage"
                    control={control}
                    rows={1}
                    placeholder="اكتب رسالة..."
                    noValidate
                    containerClassName="w-100"
                  />
                  <div className="d-sm-flex align-items-end mt-2">
                    <Button variant="danger-soft" size="sm" className="me-2" type="button" tabIndex={-1}>
                      <FaFaceSmile className="fs-6" />
                    </Button>
                    <Button variant="secondary-soft" size="sm" className="me-2" type="button" tabIndex={-1} disabled>
                      <FaPaperclip className="fs-6" />
                    </Button>
                    <Button variant="primary" size="sm" className="ms-auto" type="submit">
                      إرسال
                    </Button>
                  </div>
                </form>
              </div>
            </Collapse>
          </Toast>
        </ToastContainer>
      </div>
    </>
  )
}

export default Messaging
