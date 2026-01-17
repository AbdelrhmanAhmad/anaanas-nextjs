'use client'
import SimpleBar from "simplebar-react";
import { useChatContext } from '@/context/useChatContext'
import type { ChatType } from '@/types/data'
import clsx from 'clsx'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import avatar12 from '@/assets/images/avatar/12.jpg'

const ChatItem = ({ chat }: { chat: ChatType }) => {
  const { changeActiveChat, activeChat } = useChatContext()
  const otherUser = chat.other_user
  const lastMessage = chat.last_message

  return (
    <li data-bs-dismiss="offcanvas" onClick={() => void changeActiveChat(chat.id)}>
      <div className={clsx('nav-link text-start', { active: activeChat?.id === chat.id })} role="tab">
        <div className="d-flex">
          <div className="flex-shrink-0 avatar me-2 status-online">
            {otherUser?.avatar ? (
              <Image 
                className="avatar-img rounded-circle" 
                src={otherUser.avatar} 
                alt={otherUser.name || ''} 
                width={40}
                height={40}
              />
            ) : (
              <div className="avatar-img rounded-circle bg-light d-flex align-items-center justify-content-center text-uppercase">
                {(otherUser?.name || '?').slice(0, 1)}
              </div>
            )}
          </div>
          <div className="flex-grow-1 d-block">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 mt-1">{otherUser?.name || 'مستخدم'}</h6>
              {chat.unread_count > 0 && (
                <span className="badge bg-primary rounded-pill">{chat.unread_count}</span>
              )}
            </div>
            <div className="small text-secondary">
              {lastMessage?.body ? (
                <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                  {lastMessage.body}
                </span>
              ) : (
                <span className="text-muted">لا توجد رسائل</span>
              )}
            </div>
            {chat.post && (
              <div className="small text-muted mt-1">
                {chat.post.title}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  )
}

const ChatUsers = () => {
  const [chats, setChats] = useState<ChatType[]>([])
  const [filteredChats, setFilteredChats] = useState<ChatType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await fetch('/api/chats?per_page=50', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setChats(json.data)
          setFilteredChats(json.data)
        }
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        setLoading(false)
      }
    }
    void loadChats()
  }, [])

  const search = (text: string) => {
    if (!text.trim()) {
      setFilteredChats(chats)
      return
    }
    const filtered = chats.filter((chat) => {
      const otherUserName = chat.other_user?.name?.toLowerCase() || ''
      const postTitle = chat.post?.title?.toLowerCase() || ''
      const searchText = text.toLowerCase()
      return otherUserName.includes(searchText) || postTitle.includes(searchText)
    })
    setFilteredChats(filtered)
  }

  if (loading) {
    return (
      <Card className="card-chat-list rounded-end-lg-0 card-body border-end-lg-0 rounded-top-0 overflow-hidden">
        <div className="text-center py-4">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="card-chat-list rounded-end-lg-0 card-body border-end-lg-0 rounded-top-0 overflow-hidden">
      <form className="position-relative">
        <input 
          className="form-control py-2" 
          type="search" 
          placeholder="البحث في الدردشات" 
          aria-label="Search" 
          onKeyUp={(e: any) => search(e.target.value)}
        />
        <button className="btn bg-transparent text-secondary px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="button">
          <BsSearch className="fs-5" />
        </button>
      </form>
      <div className="mt-4 h-100">
        <SimpleBar className="chat-tab-list custom-scrollbar">
          <ul className="nav flex-column nav-pills nav-pills-soft">
            {filteredChats.length === 0 ? (
              <li className="text-center py-4 text-muted">
                <small>لا توجد دردشات</small>
              </li>
            ) : (
              filteredChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))
            )}
          </ul>
        </SimpleBar>
      </div>
    </Card>
  )
}
export default ChatUsers
