import type { ChatType, UserType } from './data'

export type ThemeType = 'light' | 'dark' | 'auto'

export type OffcanvasControlType = {
  open: boolean
  toggle: () => void
}

export type LayoutState = {
  theme: ThemeType
}

export type DialogControlType = {
  open: boolean
  toggle: () => void
}

export type LayoutOffcanvasStatesType = {
  showMobileMenu: boolean
  showStartOffcanvas: boolean
  showMessagingOffcanvas: boolean
}

export type LayoutType = LayoutState & {
  updateTheme: (theme: LayoutState['theme']) => void
  mobileMenu: DialogControlType
  startOffcanvas: DialogControlType
  messagingOffcanvas: DialogControlType
}

export type ChatContextType = {
  activeChat?: ChatType
  changeActiveChat: (chatId: ChatType['id']) => Promise<void>
  chatList: OffcanvasControlType
  chatToast: OffcanvasControlType
  refreshChats: () => Promise<void>
}

export type ChatOffcanvasStatesType = {
  showChatList: boolean
  showMessageToast: boolean
}
