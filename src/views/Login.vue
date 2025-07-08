<template>
  <div class="login-page">
    <main class="login-container">
      <h2>账户登录</h2>
      <p class="login-subtitle">请输入您的账号和密码</p>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i> 账号
          </label>
          <input 
            type="text" 
            id="username" 
            v-model="loginForm.username"
            placeholder="请输入用户名" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i> 密码
          </label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password"
            placeholder="请输入密码" 
            required
          >
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="fas fa-sign-in-alt"></i> 
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <div class="footer-text">
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const result = userStore.login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      router.push('/home')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '登录过程中出现错误，请稍后重试！'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  userStore.initUser()
})
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.login-container {
  background-color: #fff;
  max-width: 400px;
  width: 90%;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.login-container h2 {
  text-align: center;
  color: #4a6fa5;
  margin-bottom: 10px;
  padding-bottom: 10px;
  position: relative;
}

.login-container h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: #4a6fa5;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-actions {
  margin-top: 20px;
}

.form-actions button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
}

.footer-text {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.footer-text a {
  color: #4a6fa5;
  font-weight: 500;
}

.footer-text a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #fee;
  color: #e74c3c;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}
</style>