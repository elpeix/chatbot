import React from 'react'

export default function Input({ send = () => {}, thinking = false }) {
  const [input, setInput] = React.useState('')
  const inputRef = React.useRef()

  React.useEffect(() => {
    inputRef.current.focus()
  })

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      preareSend(event.target.value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    preareSend(input)
  }

  const preareSend = (value) => {
    if (thinking || !value) return
    send(value)
    setInput('')
    inputRef.current.focus()
  }

  return (
    <form className='chatbot-form'>
      <textarea
        ref={inputRef}
        placeholder='Ask me anything'
        onKeyDown={handleKeyDown}
        value={input}
        disabled={thinking}
        onChange={(event) => setInput(event.target.value)}
      />
      <button onClick={handleSubmit} disabled={thinking}>
        Send
      </button>
    </form>
  )
}
