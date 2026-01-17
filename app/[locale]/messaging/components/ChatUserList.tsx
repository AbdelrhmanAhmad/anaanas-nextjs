'use client'
import { useChatContext } from '@/context/useChatContext'
import useViewPort from '@/hooks/useViewPort'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'react-bootstrap'
import ChatUsers from './ChatUsers'

const ChatUserList = () => {
  const { width } = useViewPort()
  const { chatList } = useChatContext()

  return (
    <>
      {width >= 992 ? (
        <ChatUsers />
      ) : (
        <Offcanvas show={chatList.open} onHide={chatList.toggle} placement="start" tabIndex={-1} id="offcanvasNavbar">
          <OffcanvasHeader closeButton />
          <OffcanvasBody className="p-0">
            <ChatUsers />
          </OffcanvasBody>
        </Offcanvas>
      )}
    </>
  )
}
export default ChatUserList
