'use client'
import { createContext, use, useCallback, useEffect, useState } from 'react'

import type { ChatContextType, ChatOffcanvasStatesType, OffcanvasControlType } from '@/types/context'
import type { ChatType } from '@/types/data'
import type { ChildrenType } from '@/types/component'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = use(ChatContext)
  if (!context) {
    throw new Error('useChatContext can only be used within ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }: ChildrenType) => {
  const [activeChat, setActiveChat] = useState<ChatType>()
  const [chats, setChats] = useState<ChatType[]>([])
  const [offcanvasStates, setOffcanvasStates] = useState<ChatOffcanvasStatesType>({
    showChatList: false,
    showMessageToast: false,
  })

  const changeActiveChat = useCallback(async (chatId: ChatType['id']) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (json.success && json.data) {
        setActiveChat(json.data)
      }
    } catch (error) {
      console.error('Error fetching chat:', error)
    }
  }, [])

  const refreshChats = useCallback(async () => {
    try {
      const res = await fetch('/api/chats?per_page=50', {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setChats(json.data)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }, [])

  const toggleChatList: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showChatList: !offcanvasStates.showChatList })
  }

  const toggleMessageToast: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showMessageToast: !offcanvasStates.showMessageToast })
  }

  const chatList: ChatContextType['chatList'] = {
    open: offcanvasStates.showChatList,
    toggle: toggleChatList,
  }

  const chatToast: ChatContextType['chatToast'] = {
    open: offcanvasStates.showMessageToast,
    toggle: toggleMessageToast,
  }

  useEffect(() => {
    void refreshChats()
  }, [refreshChats])

  return (
    <ChatContext.Provider
      value={{
        activeChat,
        changeActiveChat,
        chatList,
        chatToast,
        refreshChats,
      }}>
      {children}
    </ChatContext.Provider>
  )
}
