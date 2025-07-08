<template>
  <div class="sidebar">
    <ul class="menu">
      <li @mouseenter="showHistory = true" @mouseleave="showHistory = false">
        历史记录
        <ul v-show="showHistory" class="submenu history-list">
          <li v-for="(item, index) in chatStore.history" :key="index">
            {{ item.length > 20 ? item.substring(0, 20) + '...' : item }}
          </li>
        </ul>
        <a v-show="showHistory" href="#" class="view-more" @click.prevent>查看更多</a>
      </li>
      <li>
        <router-link to="/knowledge">我的知识库</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'

const chatStore = useChatStore()
const showHistory = ref(false)

onMounted(() => {
  // 可以在这里初始化一些历史记录
})
</script>

<style scoped>
.sidebar {
  width: 200px;
  border-right: 1px solid #eee;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

.menu {
  list-style: none;
}

.menu li {
  padding: 15px 20px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #f5f5f5;
}

.menu li:hover {
  background-color: #f8f9fa;
  padding-left: 25px;
}

.menu a {
  color: inherit;
  display: block;
}

.submenu {
  position: absolute;
  left: 100%;
  top: 0;
  width: 250px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.submenu li {
  padding: 10px 15px;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.submenu li:hover {
  background-color: #f1f1f1;
  padding-left: 20px;
}

.view-more {
  position: absolute;
  left: 100%;
  top: 100%;
  padding: 8px 15px;
  font-size: 12px;
  color: #007bff;
  background-color: #fff;
  border: 1px solid #eee;
  border-top: none;
  width: 250px;
  text-align: center;
}

.view-more:hover {
  background-color: #f1f1f1;
}
</style>