<template>
  <div class="knowledge-page">
    <!-- 顶部导航 -->
    <TopNav />

    <!-- 知识库筛选区域 -->
    <div class="filter-container">
      <div class="filter-item">
        <span class="filter-label">科目:</span>
        <ul class="filter-options">
          <li :class="{ active: knowledgeStore.filters.subject === 'all' }" 
              @click="updateFilter('subject', 'all')">全部</li>
          <li :class="{ active: knowledgeStore.filters.subject === '语文' }" 
              @click="updateFilter('subject', '语文')">语文</li>
          <li :class="{ active: knowledgeStore.filters.subject === '数学' }" 
              @click="updateFilter('subject', '数学')">数学</li>
          <li :class="{ active: knowledgeStore.filters.subject === '英语' }" 
              @click="updateFilter('subject', '英语')">英语</li>
        </ul>
      </div>
      <div class="filter-item">
        <span class="filter-label">类型:</span>
        <ul class="filter-options">
          <li :class="{ active: knowledgeStore.filters.type === 'all' }" 
              @click="updateFilter('type', 'all')">全部</li>
          <li :class="{ active: knowledgeStore.filters.type === 'PPT' }" 
              @click="updateFilter('type', 'PPT')">PPT</li>
          <li :class="{ active: knowledgeStore.filters.type === '课件' }" 
              @click="updateFilter('type', '课件')">课件</li>
          <li :class="{ active: knowledgeStore.filters.type === '笔记' }" 
              @click="updateFilter('type', '笔记')">笔记</li>
        </ul>
      </div>
      <div class="filter-item">
        <span class="filter-label">标签:</span>
        <input 
          type="text" 
          v-model="knowledgeStore.filters.tags"
          @input="updateFilter('tags', $event.target.value)"
          placeholder="输入标签筛选"
        >
      </div>
    </div>

    <!-- 加号按钮 -->
    <div class="add-button" @click="showUploadModal = true">+</div>

    <!-- 隐藏的文件上传弹窗 -->
    <div v-if="showUploadModal" class="upload-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close-modal" @click="showUploadModal = false">&times;</span>
        <h2>添加文件</h2>
        <form @submit.prevent="handleUpload">
          <div class="form-group">
            <label for="file-name">文件名:</label>
            <input type="text" id="file-name" v-model="uploadForm.name" required>
          </div>
          <div class="form-group">
            <label for="subject">科目:</label>
            <select id="subject" v-model="uploadForm.subject" required>
              <option value="语文">语文</option>
              <option value="数学">数学</option>
              <option value="英语">英语</option>
            </select>
          </div>
          <div class="form-group">
            <label for="file-type">类型:</label>
            <select id="file-type" v-model="uploadForm.type" required>
              <option value="PPT">PPT</option>
              <option value="课件">课件</option>
              <option value="笔记">笔记</option>
            </select>
          </div>
          <div class="form-group">
            <label for="tags">标签 (用逗号分隔):</label>
            <input type="text" id="tags" v-model="uploadForm.tagsInput" placeholder="例如: 重点, 复习">
          </div>
          <div class="form-group">
            <label for="file-upload">本地上传文件:</label>
            <input type="file" id="file-upload" @change="handleFileSelect" accept=".ppt,.pptx,.doc,.docx,.txt">
          </div>
          <button type="submit" class="btn btn-primary">添加文件</button>
        </form>
      </div>
    </div>

    <!-- 知识库内容区域 -->
    <div class="knowledge-container">
      <div v-for="file in knowledgeStore.filteredFiles" :key="file.id" class="file-card">
        <button class="delete-btn" @click="deleteFile(file.id)">×</button>
        <div class="file-info">
          <h3>{{ file.name }}</h3>
          <p>科目: {{ file.subject }} | 类型: {{ file.type }}</p>
          <a v-if="file.url" :href="file.url" download>下载文件</a>
          <div class="file-tags">
            <span v-for="tag in file.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useKnowledgeStore } from '../stores/knowledge'
import TopNav from '../components/TopNav.vue'

const userStore = useUserStore()
const knowledgeStore = useKnowledgeStore()

const showUploadModal = ref(false)
const uploadForm = ref({
  name: '',
  subject: '语文',
  type: 'PPT',
  tagsInput: '',
  file: null
})

// 更新筛选条件
const updateFilter = (key, value) => {
  knowledgeStore.updateFilter(key, value)
}

// 处理文件选择
const handleFileSelect = (event) => {
  uploadForm.value.file = event.target.files[0]
}

// 处理文件上传
const handleUpload = () => {
  const tags = uploadForm.value.tagsInput
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag)

  const fileData = {
    name: uploadForm.value.name,
    subject: uploadForm.value.subject,
    type: uploadForm.value.type,
    tags,
    url: uploadForm.value.file ? URL.createObjectURL(uploadForm.value.file) : null
  }

  knowledgeStore.addFile(fileData)
  
  // 重置表单
  uploadForm.value = {
    name: '',
    subject: '语文',
    type: 'PPT',
    tagsInput: '',
    file: null
  }
  
  showUploadModal.value = false
}

// 删除文件
const deleteFile = (fileId) => {
  knowledgeStore.deleteFile(fileId)
}

// 关闭弹窗
const closeModal = (event) => {
  if (event.target.classList.contains('upload-modal')) {
    showUploadModal.value = false
  }
}

onMounted(() => {
  userStore.initUser()
})
</script>

<style scoped>
.knowledge-page {
  min-height: 100vh;
}

.filter-container {
  background-color: #fff;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-label {
  font-weight: bold;
  margin-right: 15px;
  color: #666;
}

.filter-options {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
}

.filter-options li {
  padding: 5px 15px;
  margin-right: 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-options li:hover {
  background-color: #f0f0f0;
}

.filter-options li.active {
  background-color: #007bff;
  color: white;
}

.filter-item input {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
}

.knowledge-container {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  gap: 20px;
}

.file-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.3s;
}

.file-card:hover {
  transform: translateY(-5px);
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  border: none;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.file-info {
  flex: 1;
  padding: 15px;
  overflow: hidden;
}

.file-info h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.file-info p {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.file-info a {
  color: #007bff;
  font-size: 14px;
}

.file-tags {
  margin-top: 10px;
}

.file-tags span {
  background-color: #f0f0f0;
  color: #666;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-right: 5px;
  display: inline-block;
}

.add-button {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.add-button:hover {
  transform: scale(1.1);
}

.upload-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.modal-content .form-group {
  margin-bottom: 15px;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #666;
}

.modal-content input, 
.modal-content select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}
</style>