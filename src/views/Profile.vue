<template>
  <div class="profile-page">
    <!-- 顶部导航 -->
    <TopNav />
    
    <div class="user-center-container">
      <div class="profile-section">
        <h2>个人资料</h2>
        <div class="avatar-container">
          <div class="avatar" :style="avatarStyle">
            {{ userStore.avatar ? '' : '无' }}
          </div>
          <input 
            type="file" 
            ref="avatarUpload"
            @change="handleAvatarChange"
            accept="image/*" 
            style="display: none;"
          >
          <button @click="$refs.avatarUpload.click()" class="btn btn-primary">
            更改头像
          </button>
        </div>
        <div class="form-group">
          <label>用户名:</label>
          <input type="text" v-model="username">
        </div>
        <div class="button-group">
          <button @click="saveUsername" class="btn btn-primary">保存用户名</button>
        </div>
      </div>
      
      <div class="password-section">
        <h2>修改密码</h2>
        <div class="form-group">
          <label>旧密码:</label>
          <input type="password" v-model="passwordForm.oldPassword">
        </div>
        <div class="form-group">
          <label>新密码:</label>
          <input type="password" v-model="passwordForm.newPassword">
        </div>
        <div class="form-group">
          <label>确认新密码:</label>
          <input type="password" v-model="passwordForm.confirmPassword">
        </div>
        <div class="button-group">
          <button @click="changePassword" class="btn btn-primary">修改密码</button>
        </div>
      </div>
    </div>
    
    <router-link to="/home" class="back-to-home-btn">返回主页</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import TopNav from '../components/TopNav.vue'

const userStore = useUserStore()

const username = ref('')
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

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
    backgroundColor: '#ccc'
  }
})

// 处理头像更改
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userStore.updateAvatar(e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

// 保存用户名
const saveUsername = () => {
  if (username.value.trim()) {
    userStore.updateUsername(username.value.trim())
    alert('用户名保存成功！')
  }
}

// 修改密码
const changePassword = () => {
  if (!passwordForm.value.oldPassword || !passwordForm.value.newPassword) {
    alert('请填写完整的密码信息！')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('新密码和确认密码不一致！')
    return
  }
  
  // 这里可以添加密码修改的逻辑
  alert('密码修改功能待完善！')
}

onMounted(() => {
  userStore.initUser()
  username.value = userStore.username
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.user-center-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.profile-section, .password-section {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-section h2, .password-section h2 {
  font-size: 20px;
  color: #007bff;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.avatar-container {
  text-align: center;
  margin-bottom: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #ccc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 18px;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.button-group {
  margin-top: 20px;
}

.button-group button {
  margin-right: 10px;
}

.back-to-home-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  height: 40px;
  padding: 0 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.back-to-home-btn:hover {
  background-color: #0056b3;
}
</style>