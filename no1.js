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
  
  // 用户登录
  login(account, password) {
    const users = this.getUsers();
    const user = users.find(
      user => user.account === account && user.password === password
    );
    
    if (user) {
      // 保存登录状态
      this.saveCurrentUser(account);
      return { success: true, message: '登录成功！' };
    } else {
      return { success: false, message: '账号或密码错误！' };
    }
  },
  
  // 保存当前登录用户
  saveCurrentUser(account) {
    localStorage.setItem('currentUser', JSON.stringify({
      account,
      loginTime: new Date().toISOString()
    }));
  },
  
  // 获取当前登录用户
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  // 检查用户是否已登录
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }
};

// ===== 通用UI助手模块 =====
const UiHelper = {
  // 显示错误消息
  showError(elementId, message, containerId = 'login-form') {
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

// ===== 登录页面逻辑 =====
  document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        try {
          const account = document.getElementById('login-username').value.trim();
          const password = document.getElementById('login-password').value.trim();

          // 输入验证
          if (!account || !password) {
            UiHelper.showError('login-error', '请输入账号和密码！');
            return;
          }

          // 验证指定账号和密码
          if (account === '15112372368' && password === '545625177') {
            // 登录成功，跳转到主页
            window.location.href = '主页.html'; 
          } else {
            // 账号或密码错误，显示错误提示
            UiHelper.showError('login-error', '账号或密码错误！');
          }
        } catch (error) {
          console.error('登录过程中出现错误:', error);
          UiHelper.showError('login-error', '登录过程中出现错误，请稍后重试！');
        }
      });
    }
  });
  
  // 检查是否已登录
  // 检查是否已登录
  // if (UserManager.isLoggedIn()) {
  //   window.location.href = '主页.html';
  // }
