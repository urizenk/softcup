import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const avatar = ref('')
  const username = ref('用户名')

  // 计算属性
  const isLoggedIn = computed(() => !!currentUser.value)

  // 初始化用户数据
  function initUser() {
    const savedUser = localStorage.getItem('currentUser')
    const savedAvatar = localStorage.getItem('userAvatar')
    const savedUsername = localStorage.getItem('username')
    
    if (savedUser) {
      currentUser.value = JSON.parse(savedUser)
    }
    if (savedAvatar) {
      avatar.value = savedAvatar
    }
    if (savedUsername) {
      username.value = savedUsername
    }
  }

  // 登录
  function login(account, password) {
    // 验证固定账号密码
    if (account === '15112372368' && password === '545625177') {
      const user = {
        account,
        loginTime: new Date().toISOString()
      }
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return { success: true, message: '登录成功！' }
    } else {
      return { success: false, message: '账号或密码错误！' }
    }
  }

  // 注册
  function register(account, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.some(user => user.account === account)) {
      return { success: false, message: '该账号已被注册！' }
    }
    
    const newUser = {
      account,
      password,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    
    return { success: true, message: '注册成功！' }
  }

  // 登出
  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  // 更新头像
  function updateAvatar(newAvatar) {
    avatar.value = newAvatar
    localStorage.setItem('userAvatar', newAvatar)
  }

  // 更新用户名
  function updateUsername(newUsername) {
    username.value = newUsername
    localStorage.setItem('username', newUsername)
  }

  return {
    currentUser,
    avatar,
    username,
    isLoggedIn,
    initUser,
    login,
    register,
    logout,
    updateAvatar,
    updateUsername
  }
})