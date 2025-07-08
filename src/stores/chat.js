import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const history = ref([])

  // 添加消息
  function addMessage(content, type = 'user', files = []) {
    const message = {
      id: Date.now(),
      content,
      type,
      files,
      timestamp: new Date()
    }
    messages.value.push(message)
    
    // 添加到历史记录
    if (type === 'user' && content.trim()) {
      let historyText = content
      if (files.length > 0) {
        historyText += files.map(file => ` [${file.name}]`).join('')
      }
      history.value.unshift(historyText)
      
      // 限制历史记录数量
      if (history.value.length > 8) {
        history.value = history.value.slice(0, 8)
      }
    }
  }

  // 清空消息
  function clearMessages() {
    messages.value = []
  }

  // 模拟AI回复
  function simulateAIResponse(userMessage) {
    setTimeout(() => {
      const responses = [
        '我理解您的问题，让我来帮助您。',
        '这是一个很好的问题，我来为您分析一下。',
        '根据您提供的信息，我建议...',
        '让我为您查找相关资料。',
        '我需要更多信息来更好地帮助您。'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      addMessage(randomResponse, 'ai')
    }, 1000)
  }

  return {
    messages,
    history,
    addMessage,
    clearMessages,
    simulateAIResponse
  }
})