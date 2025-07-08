// ===== 公共用户管理模块 =====
const UserManager = {
    // 获取所有用户
    getUsers() {
      return JSON.parse(localStorage.getItem('users')) || [];
    },
    
    // 保存用户列表
    saveUsers(users) {
      localStorage.setItem('users', JSON.stringify(users));
    },
    
    // 注册新用户
    register(account, password) {
      const users = this.getUsers();
      
      // 检查账号是否已存在
      if (users.some(user => user.account === account)) {
        return { success: false, message: '该账号已被注册！' };
      }
      
      // 创建新用户
      const newUser = {
        account,
        password, // 注意：生产环境需要加密存储
        createdAt: new Date().toISOString()
      };
      
      // 添加到用户列表
      users.push(newUser);
      this.saveUsers(users);
      
      return { success: true, message: '注册成功！' };
    }
  };
  
  // ===== 通用UI助手模块 =====
  const UiHelper = {
    // 显示错误消息
    showError(elementId, message, containerId = 'register-form') {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      let errorElement = document.getElementById(elementId);
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = elementId;
        errorElement.className = 'error-message';
        container.insertBefore(errorElement, container.firstChild);
      }
      
      errorElement.textContent = message;
      errorElement.style.color = '#e74c3c';
      errorElement.style.marginBottom = '15px';
      errorElement.style.textAlign = 'center';
      errorElement.style.opacity = '0';
      
      // 淡入动画
      setTimeout(() => {
        errorElement.style.transition = 'opacity 0.3s ease';
        errorElement.style.opacity = '1';
      }, 10);
      
      // 5秒后淡出
      setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => errorElement.textContent = '', 300);
      }, 5000);
    },
    
    // 显示成功消息
    showSuccess(elementId, message, containerId = 'register-form') {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      let successElement = document.getElementById(elementId);
      
      if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = elementId;
        successElement.className = 'success-message';
        container.insertBefore(successElement, container.firstChild);
      }
      
      successElement.textContent = message;
      successElement.style.color = '#2ecc71';
      successElement.style.marginBottom = '15px';
      successElement.style.textAlign = 'center';
      successElement.style.opacity = '0';
      
      // 淡入动画
      setTimeout(() => {
        successElement.style.transition = 'opacity 0.3s ease';
        successElement.style.opacity = '1';
      }, 10);
    },
    
    // 按钮状态转换
    setButtonState(buttonId, state, text) {
      const button = document.getElementById(buttonId);
      if (!button) return;
      
      if (state === 'loading') {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + text;
        button.classList.add('loading');
      } else if (state === 'success') {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-check"></i> ' + text;
        button.classList.add('success');
        button.classList.remove('loading');
      } else if (state === 'normal') {
        button.disabled = false;
        button.innerHTML = text;
        button.classList.remove('loading', 'success');
      }
    },
    
    // 输入框抖动动画
    shakeInput(elementId) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      element.classList.add('shake');
      setTimeout(() => element.classList.remove('shake'), 500);
    }
  };
  
  // ===== 注册页面逻辑 =====
  // 注意：原代码中表单 ID 使用错误，已修正
  document.addEventListener('DOMContentLoaded', function() {
      const registerForm = document.getElementById('reg-form');
  
      if (registerForm) {
          registerForm.addEventListener('submit', function(e) {
              e.preventDefault();
  
              try {
                  const account = document.getElementById('reg-account').value.trim();
                  const password = document.getElementById('reg-password').value.trim();
                  const confirmPassword = document.getElementById('reg-confirm').value.trim();
  
                  // 输入验证
                  if (!account || !password) {
                      UiHelper.showError('register-error', '请输入账号和密码！');
                      return;
                  }
  
                  if (password !== confirmPassword) {
                      UiHelper.showError('register-error', '两次输入的密码不一致！');
                      UiHelper.shakeInput('reg-confirm');
                      return;
                  }
  
                  // 显示加载状态
                  UiHelper.setButtonState('reg-btn', 'loading', '注册中...');
  
                  // 使用 AJAX 调用注册接口
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', 'register_api.php', true);
                  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                  xhr.onreadystatechange = function() {
                      if (xhr.readyState === 4 && xhr.status === 200) {
                          try {
                              const result = JSON.parse(xhr.responseText);
                              if (result.success) {
                                  UiHelper.setButtonState('reg-btn', 'success', '注册成功');
                                  UiHelper.showSuccess('register-success', result.message);
                                  // 2秒后跳转到登录页面
                                  setTimeout(() => {
                                      window.location.href = '登录页面.html';
                                  }, 2000);
                              } else {
                                  UiHelper.setButtonState('reg-btn', 'normal', '注册');
                                  UiHelper.showError('register-error', result.message);
                                  UiHelper.shakeInput('reg-account');
                              }
                          } catch (parseError) {
                              console.error('解析响应出错:', parseError);
                              UiHelper.setButtonState('reg-btn', 'normal', '注册');
                              UiHelper.showError('register-error', '解析响应出错，请稍后再试');
                          }
                      }
                  };
                  xhr.send(`account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}`);
              } catch (error) {
                  console.error('注册过程发生错误:', error);
                  UiHelper.setButtonState('reg-btn', 'normal', '注册');
                  UiHelper.showError('register-error', '注册过程发生错误，请稍后再试');
              }
          });
      }
  });