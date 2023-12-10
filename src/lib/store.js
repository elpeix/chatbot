import { create } from 'zustand'

export const useStore = create((set) => ({
  messages: [],
  inlineMessage: '',
  thinking: false,
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }))
  },
  clearMessages: () => {
    set({ messages: [] })
  },
  addPartialMessage: (message) => {
    set((state) => ({ inlineMessage: state.inlineMessage + message }))
  },
  clearInlineMessage: () => {
    set({ inlineMessage: '' })
  },
  setThinking: (thinking) => {
    set({ thinking })
  },
}))
