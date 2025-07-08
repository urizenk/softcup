import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const files = ref([])
  const filters = ref({
    subject: 'all',
    type: 'all',
    tags: ''
  })

  // 计算过滤后的文件
  const filteredFiles = computed(() => {
    return files.value.filter(file => {
      const subjectMatch = filters.value.subject === 'all' || file.subject === filters.value.subject
      const typeMatch = filters.value.type === 'all' || file.type === filters.value.type
      const tagMatch = !filters.value.tags || file.tags.some(tag => 
        tag.toLowerCase().includes(filters.value.tags.toLowerCase())
      )
      return subjectMatch && typeMatch && tagMatch
    })
  })

  // 添加文件
  function addFile(fileData) {
    const newFile = {
      id: Date.now(),
      ...fileData,
      createdAt: new Date().toISOString()
    }
    files.value.push(newFile)
  }

  // 删除文件
  function deleteFile(fileId) {
    const index = files.value.findIndex(file => file.id === fileId)
    if (index > -1) {
      files.value.splice(index, 1)
    }
  }

  // 更新筛选条件
  function updateFilter(key, value) {
    filters.value[key] = value
  }

  // 清空筛选条件
  function clearFilters() {
    filters.value = {
      subject: 'all',
      type: 'all',
      tags: ''
    }
  }

  return {
    files,
    filters,
    filteredFiles,
    addFile,
    deleteFile,
    updateFilter,
    clearFilters
  }
})