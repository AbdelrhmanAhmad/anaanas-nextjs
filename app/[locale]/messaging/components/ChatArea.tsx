'use client'
import { useChatContext } from '@/context/useChatContext'
import type { ChatMessageType, ChatType } from '@/types/data'
import { yupResolver } from '@hookform/resolvers/yup'
import clsx from 'clsx'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { BsArchive, BsCameraVideoFill, BsCheckLg, BsMicMute, BsPersonCheck, BsTelephoneFill, BsThreeDotsVertical, BsTrash } from 'react-icons/bs'
import { FaCircle, FaPaperclip, FaPaperPlane } from 'react-icons/fa'
import * as yup from 'yup'
import { FaCheck, FaCheckDouble, FaFaceSmile } from 'react-icons/fa6'
import TextFormInput from '@/components/form/TextFormInput'
import SimpleBar from "simplebar-react";
import data from '@emoji-mart/data'
import EmojiPicker from '@emoji-mart/react'
import { useLayoutContext } from '@/context/useLayoutContext'
import { useSession } from 'next-auth/react'
import avatar12 from '@/assets/images/avatar/12.jpg'

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (elementRef?.current?.scrollIntoView) elementRef.current.scrollIntoView({ behavior: 'smooth' })
  })
  return <div ref={elementRef} />
}

type ApiMessage = {
  id: string
  chat_id: string
  sender_id: number | string
  sender?: {
    id: number | string
    name: string
    avatar?: string | null
  }
  body: string
  type?: string
  file_url?: string | null
  is_read?: boolean
  read_at?: string | null
  created_at: string
}

const UserMessage = ({ message, currentUserId }: { message: ChatMessageType; currentUserId: number | string }) => {
  const received = message.from.id !== String(currentUserId)
  return (
    <div className={clsx('d-flex mb-1', { 'justify-content-end text-end': !received })}>
      <div className="flex-shrink-0 avatar avatar-xs me-2">
        {received && message.from.avatar && (
          <Image className="avatar-img rounded-circle" src={message.from.avatar} alt="" width={32} height={32} />
        )}
      </div>
      <div className="flex-grow-1">
        <div className="w-100">
          <div className={clsx('d-flex flex-column', received ? 'align-items-start' : 'align-items-end')}>
            {message.image ? (
              <div className="bg-light text-secondary p-2 px-3 rounded-2">
                <p className="small mb-0">{message.message}</p>
                <Card className="shadow-none p-2 border border-2 rounded mt-2">
                  <Image width={87} height={91} src={message.image} alt="image" />
                </Card>
              </div>
            ) : (
              <div className={clsx('p-2 px-3 rounded-2', received ? 'bg-light text-secondary' : 'bg-primary text-white')}>
                {message.message}
              </div>
            )}
            {message.isRead ? (
              <div className="d-flex my-2">
                <div className="small text-secondary">
                  {message.sentOn.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </div>
                <div className="small ms-2">
                  <FaCheckDouble className="text-info" />
                </div>
              </div>
            ) : message.isSend ? (
              <div className="d-flex my-2">
                <div className="small text-secondary">
                  {message.sentOn.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </div>
                <div className="small ms-2">
                  <FaCheck />
                </div>
              </div>
            ) : (
              <div className="small my-2 text-secondary">
                {message.sentOn.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ChatArea = () => {
  const { theme } = useLayoutContext()
  const { activeChat, refreshChats } = useChatContext()
  const { data: session } = useSession()
  const currentUserId = (session as any)?.user?.id
  const [userMessages, setUserMessages] = useState<ChatMessageType[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messageSchema = yup.object({
    newMessage: yup.string().required('Please enter message'),
  })

  const { reset, handleSubmit, control } = useForm({
    resolver: yupResolver(messageSchema),
  })

  const loadMessages = useCallback(async (chatId: string) => {
    if (!chatId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/chats/${chatId}/messages?per_page=50`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const messages: ChatMessageType[] = json.data.map((m: ApiMessage) => {
          const sentOn = m.created_at ? new Date(m.created_at) : new Date()
          const sender = m.sender || { id: m.sender_id, name: 'مستخدم', avatar: null }
          return {
            id: m.id,
            from: {
              id: String(sender.id),
              name: sender.name,
              avatar: sender.avatar ? (sender.avatar as any) : avatar12,
              mutualCount: 0,
              role: 'user',
              status: 'online',
              lastMessage: '',
              lastActivity: sentOn,
              isStory: false,
            },
            to: {
              id: String(currentUserId || ''),
              name: (session as any)?.user?.name || 'أنت',
              avatar: ((session as any)?.user?.image || avatar12) as any,
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
        setUserMessages(messages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUserId, session])

  useEffect(() => {
    if (activeChat?.id) {
      void loadMessages(activeChat.id)
      // Mark chat as read
      void fetch(`/api/chats/${activeChat.id}/read`, { method: 'POST' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id])

  const sendChatMessage = async (values: { newMessage?: string }) => {
    if (!activeChat?.id || !values.newMessage?.trim()) return

    setSending(true)
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
        const sender = m.sender || { id: m.sender_id, name: (session as any)?.user?.name || 'أنت', avatar: null }
        
        const newMessage: ChatMessageType = {
          id: m.id,
          from: {
            id: String(sender.id),
            name: sender.name,
            avatar: sender.avatar ? (sender.avatar as any) : ((session as any)?.user?.image || avatar12),
            mutualCount: 0,
            role: 'user',
            status: 'online',
            lastMessage: '',
            lastActivity: sentOn,
            isStory: false,
          },
          to: {
            id: String(activeChat.other_user?.id || ''),
            name: activeChat.other_user?.name || 'مستخدم',
            avatar: activeChat.other_user?.avatar ? (activeChat.other_user.avatar as any) : avatar12,
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
        }
        setUserMessages((prev) => [...prev, newMessage])
        reset()
        void refreshChats()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  if (!activeChat) {
    return (
      <Card className="card-chat rounded-start-lg-0 border-start-lg-0">
        <CardBody className="h-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <p>اختر دردشة للبدء</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  const otherUser = activeChat.other_user
  const otherUserName = otherUser?.name || 'مستخدم'
  const otherUserAvatar = otherUser?.avatar || null

  return (
    <Card className="card-chat rounded-start-lg-0 border-start-lg-0">
      <CardBody className="h-100">
        <div className="tab-content py-0 mb-0 h-100" id="chatTabsContent">
          <div className="fade tab-pane show active h-100" role="tabpanel">
            <div className="d-sm-flex justify-content-between align-items-center">
              <div className="d-flex mb-2 mb-sm-0">
                <div className="flex-shrink-0 avatar me-2">
                  {otherUserAvatar ? (
                    <Image className="avatar-img rounded-circle" src={otherUserAvatar} alt={otherUserName} width={40} height={40} />
                  ) : (
                    <div className="avatar-img rounded-circle bg-light d-flex align-items-center justify-content-center text-uppercase">
                      {otherUserName.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="d-block flex-grow-1">
                  <h6 className="mb-0 mt-1">{otherUserName}</h6>
                  {activeChat.post && (
                    <div className="small text-secondary">{activeChat.post.title}</div>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <OverlayTrigger placement="top" overlay={<Tooltip>Audio call</Tooltip>}>
                  <Button variant="primary-soft" className="icon-md rounded-circle me-2 px-2">
                    <BsTelephoneFill />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Video call</Tooltip>}>
                  <Button variant="primary-soft" className="icon-md rounded-circle me-2 px-2">
                    <BsCameraVideoFill />
                  </Button>
                </OverlayTrigger>
                <Dropdown>
                  <DropdownToggle as="a" className="icon-md rounded-circle btn btn-primary-soft me-2 px-2 content-none" role="button">
                    <BsThreeDotsVertical />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end" aria-labelledby="chatcoversationDropdown">
                    <li>
                      <DropdownItem href="#">
                        <BsCheckLg className="me-2 fw-icon" />
                        Mark as read
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem href="#">
                        <BsMicMute className="me-2 fw-icon" />
                        Mute conversation
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem href="#">
                        <BsPersonCheck className="me-2 fw-icon" />
                        View profile
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem href="#">
                        <BsTrash className="me-2 fw-icon" />
                        Delete chat
                      </DropdownItem>
                    </li>
                    <DropdownDivider />
                    <li>
                      <DropdownItem href="#">
                        <BsArchive className="me-2 fw-icon" />
                        Archive chat
                      </DropdownItem>
                    </li>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <hr />
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <SimpleBar className="chat-conversation-content custom-scrollbar">
                {userMessages.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <small>لا توجد رسائل بعد</small>
                  </div>
                ) : (
                  <>
                    {userMessages.map((message) => (
                      <UserMessage message={message} key={message.id} currentUserId={currentUserId || ''} />
                    ))}
                    <AlwaysScrollToBottom />
                  </>
                )}
              </SimpleBar>
            )}
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <form onSubmit={handleSubmit(sendChatMessage)} className="d-sm-flex align-items-end">
          <TextFormInput
            className="mb-sm-0 mb-3"
            name="newMessage"
            control={control}
            placeholder="اكتب رسالة..."
            noValidate
            containerClassName="w-100"
            disabled={sending}
          />
          <Dropdown drop="up" className="d-inline-block">
            <DropdownToggle type="button" className="btn h-100 btn-sm btn-danger-soft ms-sm-2 border border-transparent content-none">
              <FaFaceSmile className="fs-6" />
            </DropdownToggle>
            <DropdownMenu className="p-0 rounded-4">
              <EmojiPicker data={data} theme={theme} onEmojiSelect={(e: any) => console.info(e.native)} />
            </DropdownMenu>
          </Dropdown>
          <Button variant="secondary-soft" size="sm" className="ms-2" disabled={sending}>
            <FaPaperclip className="fs-6" />
          </Button>
          <Button variant="primary" type="submit" size="sm" className="ms-2" disabled={sending}>
            <FaPaperPlane className="fs-6" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
export default ChatArea
