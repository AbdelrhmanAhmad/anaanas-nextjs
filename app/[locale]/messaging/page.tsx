'use client'

import { Card, Col, Container, Row } from 'react-bootstrap'
import type { Metadata } from 'next'
import ChatArea from './components/ChatArea'
import ChatToggler from './components/ChatToggler'
import ChatUserList from './components/ChatUserList'
import MessageToast from './components/MessageToast'
import { useChatContext } from '@/context/useChatContext'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const Messaging = () => {
  const { changeActiveChat, refreshChats } = useChatContext()
  const searchParams = useSearchParams()

  useEffect(() => {
    void refreshChats()
  }, [refreshChats])

  useEffect(() => {
    const chatId = searchParams.get('chat')
    if (chatId) {
      void changeActiveChat(chatId)
    }
  }, [searchParams, changeActiveChat])

  return (
    <main>
      <Container>
        <Row className="gx-0">
          <Col lg={4} xxl={3} id="chatTabs" role="tablist">
            <div className="d-flex align-items-center mb-4 d-lg-none">
              <ChatToggler />
            </div>
            <Card className="card-body border-end-0 border-bottom-0 rounded-bottom-0">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h5 mb-0">
                  الدردشات النشطة
                </h1>
                <MessageToast />
              </div>
            </Card>
            <nav className="navbar navbar-light navbar-expand-lg mx-0">
              <ChatUserList />
            </nav>
          </Col>
          <Col lg={8} xxl={9}>
            <ChatArea />
          </Col>
        </Row>
      </Container>
    </main>
  )
}
export default Messaging
