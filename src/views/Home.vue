<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <TopNav />
    
    <!-- 主体容器：侧边栏 + 主内容 -->
    <div class="container">
      <!-- 左侧侧边栏 -->
      <Sidebar />
      
      <!-- 右侧主内容 -->
      <div class="main">
        <!-- 对话框 -->
        <div class="chat-dialog">
          <!-- 对话内容显示区域 -->
          <div class="chat-content" ref="chatContent">
            <div v-for="message in chatStore.messages" :key="message.id" 
                 :class="message.type === 'user' ? 'user-message' : 'ai-message'">
              <div class="avatar" :style="getAvatarStyle(message.type)"></div>
              <div class="message-content">
                <div v-if="message.content">{{ message.content }}</div>
                <div v-if="message.files && message.files.length > 0" class="message-files">
                  <template v-for="file in message.files" :key="file.name">
                    <img v-if="file.type.startsWith('image/')" 
                         :src="file.url" 
                         class="message-image"
                         @click="showLargeImage(file.url)" />
                    <a v-else :href="file.url" target="_blank" class="file-link">
                      {{ file.name }}
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 文件预览容器 -->
          <div v-if="filePreviews.length > 0" class="file-preview">
            <div v-for="(file, index) in filePreviews" :key="index" class="file-item">
              <img v-if="file.type.startsWith('image/')" :src="file.url" />
              <div v-else class="file-icon">📄</div>
              <div class="file-name">{{ file.name }}</div>
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="input-area">
            <input 
              type="text" 
              v-model="inputText"
              @keypress.enter="sendMessage"
              placeholder="输入文字"
            >
            <input 
              type="file" 
              ref="fileInput"
              @change="handleFileSelect"
              accept=".pptx,.ppt,.mp4,.jpg,.png,.pdf" 
              multiple 
              style="display: none;"
            >
            <label for="file-input" class="upload-btn" @click="$refs.fileInput.click()">
              上传
            </label>
            <button @click="sendMessage" class="btn btn-primary">发送</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片遮罩层 -->
    <div v-if="showImageOverlay" class="image-overlay" @click="closeImageOverlay">
      <img :src="largeImageSrc" class="large-image" />
      <div class="close-button" @click="closeImageOverlay">&times;</div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useChatStore } from '../stores/chat'
import TopNav from '../components/TopNav.vue'
import Sidebar from '../components/Sidebar.vue'

const userStore = useUserStore()
const chatStore = useChatStore()

const inputText = ref('')
const filePreviews = ref([])
const chatContent = ref(null)
const fileInput = ref(null)
const showImageOverlay = ref(false)
const largeImageSrc = ref('')

// 获取头像样式
const getAvatarStyle = (type) => {
  if (type === 'user' && userStore.avatar) {
    return {
      backgroundImage: `url(${userStore.avatar})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {
    backgroundColor: type === 'user' ? '#007bff' : '#ccc'
  }
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  filePreviews.value = files.map(file => ({
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file),
    file
  }))
}

// 发送消息
const sendMessage = () => {
  if (inputText.value.trim() || filePreviews.value.length > 0) {
    chatStore.addMessage(inputText.value, 'user', filePreviews.value)
    
    // 模拟AI回复
    if (inputText.value.trim()) {
      chatStore.simulateAIResponse(inputText.value)
    }
    
    // 清空输入
    inputText.value = ''
    filePreviews.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // 滚动到底部
    nextTick(() => {
      if (chatContent.value) {
        chatContent.value.scrollTop = chatContent.value.scrollHeight
      }
    })
  }
}

// 显示大图
const showLargeImage = (src) => {
  largeImageSrc.value = src
  showImageOverlay.value = true
}

// 关闭大图
const closeImageOverlay = () => {
  showImageOverlay.value = false
  largeImageSrc.value = ''
}

onMounted(() => {
  userStore.initUser()
})
</script>

<style scoped>
.home-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  display: flex;
  flex: 1;
}

.main {
  flex: 1;
  padding: 20px;
}

.chat-dialog {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  max-width: 90%;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #fdfdfd;
}

.user-message, .ai-message {
  display: flex;
  margin-bottom: 20px;
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-content {
  background-color: #dcf8c6;
  margin-right: 10px;
}

.ai-message .message-content {
  background-color: #ffffff;
  margin-left: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.message-content {
  max-width: 60%;
  padding: 12px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-files {
  margin-top: 10px;
}

.message-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}

.file-link {
  display: block;
  color: #007bff;
  margin: 5px 0;
}

.file-preview {
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  max-height: 150px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.file-item img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  object-fit: contain;
}

.file-icon {
  font-size: 24px;
  margin-right: 10px;
}

.input-area {
  display: flex;
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.input-area input[type="text"] {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
}

.upload-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.upload-btn:hover {
  background-color: #5a6268;
}

.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.large-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 30px;
  color: white;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover {
  color: #ccc;
}
</style>