<template>
  <div class="top-nav">
    <div class="logo">
      <router-link to="/home">主页</router-link>
    </div>
    
    <!-- 用户中心板块 -->
    <div class="user-center" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
      <div class="user-avatar" :style="avatarStyle">
        {{ userStore.avatar ? '' : '无' }}
      </div>
      <span class="user-name">{{ userStore.username }}</span>
      
      <!-- 下拉菜单 -->
      <div v-show="showMenu" class="user-menu">
        <ul>
          <li><router-link to="/profile">个人资料</router-link></li>
          <li>我的收藏</li>
          <li>使用记录</li>
          <li>设置</li>
          <li><a href="#" @click="handleLogout">退出登录</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const showMenu = ref(false)

// 计算头像样式
const avatarStyle = computed(() => {
  if (userStore.avatar) {
    return {
      backgroundImage: `url(${userStore.avatar})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {
    backgroundColor: '#007bff'
  }
})

// 处理登出
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  userStore.initUser()
})
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

.logo a {
  color: inherit;
}

.user-center {
  margin-left: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
}

.user-name {
  font-size: 14px;
  color: #333;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 150px;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;
  border-radius: 8px;
  overflow: hidden;
}

.user-menu ul {
  list-style: none;
}

.user-menu li {
  padding: 12px 15px;
  font-size: 14px;
  color: #666;
  transition: background-color 0.3s;
  cursor: pointer;
}

.user-menu li:hover {
  background-color: #f1f1f1;
}

.user-menu a {
  color: inherit;
  display: block;
}
</style>