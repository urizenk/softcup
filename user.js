document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.getElementById('avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const usernameInput = document.getElementById('username');
    const saveUsernameBtn = document.getElementById('save-username-btn');

    // 初始化显示已保存的头像和用户名
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedUsername = localStorage.getItem('username');

    if (savedAvatar) {
        avatar.style.backgroundImage = `url('${savedAvatar}')`;
        avatar.textContent = '';
    }
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    // 更改头像逻辑
    changeAvatarBtn.addEventListener('click', () => {
        avatarUpload.click();
    });

    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatar.style.backgroundImage = `url('${event.target.result}')`;
                avatar.textContent = '';
                localStorage.setItem('userAvatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 保存用户名逻辑
    saveUsernameBtn.addEventListener('click', () => {
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            localStorage.setItem('username', newUsername);
        }
    });
});