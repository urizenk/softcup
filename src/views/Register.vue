<template>
  <div class="register-page">
    <main class="register-container">
      <h2>用户注册</h2>
      <p class="register-subtitle">请输入注册信息</p>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="account">
            <i class="fas fa-user"></i> 账号
          </label>
          <input 
            type="text" 
            id="account" 
            v-model="registerForm.account"
            placeholder="请输入账号" 
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
            v-model="registerForm.password"
            placeholder="请输入密码" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">
            <i class="fas fa-lock"></i> 确认密码
          </label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="registerForm.confirmPassword"
            placeholder="请再次输入密码" 
            required
          >
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <i class="fas fa-pen"></i> 
            {{ loading ? '注册中...' : '注册' }}
          </button>
        </div>
        
        <div class="footer-text">
          <p>已有账号？<router-link to="/login">立即登录</router-link></p>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const registerForm = ref({
  account: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    if (!registerForm.value.account || !registerForm.value.password) {
      errorMessage.value = '请输入账号和密码！'
      return
    }
    
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      errorMessage.value = '两次输入的密码不一致！'
      return
    }
    
    const result = userStore.register(registerForm.value.account, registerForm.value.password)
    
    if (result.success) {
      successMessage.value = result.message
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '注册过程发生错误，请稍后再试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.register-container {
  background-color: #fff;
  max-width: 400px;
  width: 90%;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.register-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.register-container h2 {
  text-align: center;
  color: #4a6fa5;
  margin-bottom: 10px;
  padding-bottom: 10px;
  position: relative;
}

.register-container h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background-color: #4a6fa5;
}

.register-subtitle {
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

.success-message {
  background-color: #efe;
  color: #2ecc71;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}
</style>