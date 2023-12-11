import React from 'react'
import Input from './Input'
import ndjsonStream from 'can-ndjson-stream'
import { useStore } from '../lib/store'
import Markdown from './Markdown'

export default function ChatBot() {
  const endRef = React.useRef()

  const messages = useStore((state) => state.messages)
  const addMessage = useStore((state) => state.addMessage)
  const thinking = useStore((state) => state.thinking)
  const setThinking = useStore((state) => state.setThinking)
  const inlineMessage = useStore((state) => state.inlineMessage)
  const addPartialMessage = useStore((state) => state.addPartialMessage)
  const clearInlineMessage = useStore((state) => state.clearInlineMessage)

  const addUserMessage = (message) => addMessage({ message, sender: 'user' })
  const addBotMessage = (message) => addMessage({ message, sender: 'bot' })

  const handleSend = async (message) => {
    addUserMessage(message)
    setThinking(true)
    clearInlineMessage()

    const fetchndsjon = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {},
      body: JSON.stringify({
        model: 'llama2',
        prompt: message,
      }),
    })

    const ndsjon = ndjsonStream(fetchndsjon.body).getReader()

    let result = ''
    while (true) {
      const { done, value } = await ndsjon.read()
      if (done || value.done) break
      result += value.response
      addPartialMessage(inlineMessage + value.response)
    }
    console.log(result)
    addBotMessage(result)
    setThinking(false)
    clearInlineMessage()
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [inlineMessage, messages])

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const actors = {
    user: 'You',
    bot: 'Bot',
  }

  return (
    <div className='content'>
      <div className='chatbot'>
        <div className='chatbot-header'>
          <h1 className='chatbot-title'>ChatBot</h1>
        </div>
        <div className='chatbot-body'>
          <div>
            <div className='chatbot-spacer' />
            <div className='chatbot-messages'>
              {messages.length > 0 &&
                messages.map((message, index) => {
                  return (
                    <div className='chatbot-message' key={index}>
                      <div className='chatbot-message-sender'>
                        {actors[message.sender]}
                      </div>
                      <div className='chatbot-message-text'>
                        <Markdown>{message.message}</Markdown>
                      </div>
                    </div>
                  )
                })}
              {messages.length === 0 && (
                <div className='chatbot-message'>
                  <div className='chatbot-message-text'>
                    Hello, how can I help you?
                  </div>
                </div>
              )}
              {inlineMessage && (
                <div className='chatbot-message'>
                  <div className='chatbot-message-sender'>{actors['bot']}</div>
                  <div className='chatbot-message-inline'>
                    <Markdown>{inlineMessage}</Markdown>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        <Input send={handleSend} thinking={thinking} />
      </div>
    </div>
  )
}
