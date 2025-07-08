document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const sendButton = document.querySelector('.input-area button');
    const inputField = document.querySelector('.input-area input[type="text"]');
    const historyList = document.querySelector('.history-list');
    const viewMore = document.querySelector('.view-more');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.querySelector('.file-preview');

    const savedAvatar = localStorage.getItem('userAvatar');
    const savedUsername = localStorage.getItem('username');

    if (savedAvatar) {
        userAvatar.style.backgroundImage = `url('${savedAvatar}')`;
        userAvatar.textContent = '';
    }
    if (savedUsername) {
        userName.textContent = savedUsername;
    }

    // 监听发送按钮点击事件
    sendButton.addEventListener('click', function() {
        const inputText = inputField.value.trim();
        if (inputText) {
            // 创建新的历史记录项
            const newHistoryItem = document.createElement('li');
            newHistoryItem.textContent = inputText;
            historyList.insertBefore(newHistoryItem, historyList.firstChild);

            // 限制历史记录数量不超过 8 条
            if (historyList.children.length > 8) {
                historyList.removeChild(historyList.lastChild);
            }

            // 在对话框中添加用户消息
            const chatContent = document.querySelector('.chat-content');
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            // 获取用户头像的背景图片并应用到对话框头像上
            avatar.style.backgroundImage = userAvatar.style.backgroundImage;
            avatar.style.width = '32px';
            avatar.style.height = '32px';
            avatar.style.borderRadius = '50%';
            avatar.style.backgroundSize = 'cover';
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = inputText;
            userMessage.appendChild(avatar);
            userMessage.appendChild(messageContent);
            chatContent.appendChild(userMessage);
            chatContent.scrollTop = chatContent.scrollHeight;

            // 清空输入框
            inputField.value = '';
        }
    });

    // 监听输入框回车事件
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // 监听文件选择事件
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.dataset.fileUrl = URL.createObjectURL(file);
            fileItem.dataset.fileName = file.name;

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                fileItem.appendChild(img);
            } else {
                const icon = document.createElement('div');
                icon.textContent = '📄';
                icon.style.fontSize = '24px';
                icon.style.marginRight = '10px';
                fileItem.appendChild(icon);
            }

            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            fileItem.appendChild(fileName);

            // 添加点击事件，点击打开文件
            fileItem.addEventListener('click', function() {
                window.open(this.dataset.fileUrl);
            });

            filePreview.appendChild(fileItem);
        });
    });

    // 修改发送按钮点击事件，将文件添加到对话框
    sendButton.addEventListener('click', function() {
        const inputText = inputField.value.trim();
        const files = Array.from(fileInput.files);
        if (inputText || files.length > 0) {
            // 创建新的历史记录项
            let historyText = inputText;
            if (files.length > 0) {
                historyText += files.map(file => ` [${file.name}]`).join('');
            }
            const newHistoryItem = document.createElement('li');
            newHistoryItem.textContent = historyText;
            historyList.insertBefore(newHistoryItem, historyList.firstChild);

            // 限制历史记录数量不超过 8 条
            if (historyList.children.length > 8) {
                historyList.removeChild(historyList.lastChild);
            }

            // 在对话框中添加用户消息
            const chatContent = document.querySelector('.chat-content');
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            // 获取用户头像的背景图片并应用到对话框头像上
            avatar.style.backgroundImage = userAvatar.style.backgroundImage;
            avatar.style.width = '32px';
            avatar.style.height = '32px';
            avatar.style.borderRadius = '50%';
            avatar.style.backgroundSize = 'cover';
            userMessage.appendChild(avatar);

            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            if (inputText) {
                messageContent.textContent = inputText;
            }
            userMessage.appendChild(messageContent);

            // 添加文件到对话框
            if (files.length > 0) {
                const fileContainer = document.createElement('div');
                fileContainer.className = 'message-files';
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        img.className = 'message-image';
                        // 添加点击事件，点击显示大图
                        img.addEventListener('click', function() {
                            largeImage.src = this.src;
                            overlay.style.display = 'flex';
                            // 仅虚化背景内容
                            backgroundContent.style.filter = 'blur(5px)';
                            sidebar.style.filter = 'blur(5px)';
                            mainContent.style.filter = 'blur(5px)';
                        });
                        fileContainer.appendChild(img);
                    } else {
                        const fileLink = document.createElement('a');
                        fileLink.href = URL.createObjectURL(file);
                        fileLink.target = '_blank';
                        fileLink.textContent = file.name;
                        fileLink.style.display = 'block';
                        fileLink.style.marginTop = '5px';
                        fileContainer.appendChild(fileLink);
                    }
                });
                userMessage.appendChild(fileContainer);
            }

            chatContent.appendChild(userMessage);
            chatContent.scrollTop = chatContent.scrollHeight;

            // 清空输入框
            inputField.value = '';
            // 清空文件选择和预览
            fileInput.value = '';
            filePreview.innerHTML = '';
        }
    });

    // 检查是否登录，如果未登录则跳转回登录页面
    
    // 在页面加载时检查登录状态
    // 创建遮罩层和大图显示元素
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.style.display = 'none';
    
    // 获取需要虚化的背景内容
    const backgroundContent = document.querySelector('.top-nav');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main');
    
    // 将遮罩层插入到 body 最前面，确保层级正确
    document.body.insertBefore(overlay, document.body.firstChild);
    
    const largeImage = document.createElement('img');
    largeImage.className = 'large-image';
    overlay.appendChild(largeImage);
    
    // 添加关闭按钮
    const closeButton = document.createElement('div');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    overlay.appendChild(closeButton);
    
    let scale = 1;
    const scaleStep = 0.1;
    
    // 点击遮罩层关闭大图
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target === closeButton) {
            overlay.style.display = 'none';
            scale = 1;
            largeImage.style.transform = `scale(${scale})`;
            // 恢复背景内容清晰度
            backgroundContent.style.filter = '';
            sidebar.style.filter = '';
            mainContent.style.filter = '';
        }
    });
    
    // 滚轮缩放图片
    overlay.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY < 0) {
            scale += scaleStep;
        } else {
            scale = Math.max(1, scale - scaleStep);
        }
        largeImage.style.transform = `scale(${scale})`;
    });

    // 修改发送按钮点击事件部分，添加图片点击事件
    sendButton.addEventListener('click', function() {
        const inputText = inputField.value.trim();
        const files = Array.from(fileInput.files);
        if (inputText || files.length > 0) {
            // 创建新的历史记录项
            let historyText = inputText;
            if (files.length > 0) {
                historyText += files.map(file => ` [${file.name}]`).join('');
            }
            const newHistoryItem = document.createElement('li');
            newHistoryItem.textContent = historyText;
            historyList.insertBefore(newHistoryItem, historyList.firstChild);

            // 限制历史记录数量不超过 8 条
            if (historyList.children.length > 8) {
                historyList.removeChild(historyList.lastChild);
            }

            // 在对话框中添加用户消息
            const chatContent = document.querySelector('.chat-content');
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            // 获取用户头像的背景图片并应用到对话框头像上
            avatar.style.backgroundImage = userAvatar.style.backgroundImage;
            avatar.style.width = '32px';
            avatar.style.height = '32px';
            avatar.style.borderRadius = '50%';
            avatar.style.backgroundSize = 'cover';
            userMessage.appendChild(avatar);

            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            if (inputText) {
                messageContent.textContent = inputText;
            }
            userMessage.appendChild(messageContent);

            // 添加文件到对话框
            if (files.length > 0) {
                const fileContainer = document.createElement('div');
                fileContainer.className = 'message-files';
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        img.className = 'message-image';
                        fileContainer.appendChild(img);
                    } else {
                        const fileLink = document.createElement('a');
                        fileLink.href = URL.createObjectURL(file);
                        fileLink.target = '_blank';
                        fileLink.textContent = file.name;
                        fileLink.style.display = 'block';
                        fileLink.style.marginTop = '5px';
                        fileContainer.appendChild(fileLink);
                    }
                });
                userMessage.appendChild(fileContainer);
            }

            chatContent.appendChild(userMessage);
            chatContent.scrollTop = chatContent.scrollHeight;

            // 清空输入框
            inputField.value = '';
            // 清空文件选择和预览
            fileInput.value = '';
            filePreview.innerHTML = '';
        }
    });

    // 检查是否登录，如果未登录则跳转回登录页面
    const checkLoginStatus = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentAccount = localStorage.getItem('currentAccount');
        const currentPassword = localStorage.getItem('currentPassword');
        const isLoggedIn = users.some(user => user.account === currentAccount && user.password === currentPassword);

        if (!isLoggedIn) {
            // 清除可能存在的无效登录信息
            localStorage.removeItem('currentAccount');
            localStorage.removeItem('currentPassword');
            window.location.href = '登录页面.html';
        }
    };

    // 在页面加载时检查登录状态
});

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.querySelector('.input-area input[type="text"]');
    const sendBtn = document.querySelector('.input-area button');
    const chatContent = document.querySelector('.chat-content');

    // 点击发送按钮时触发的函数
    sendBtn.addEventListener('click', async function() {
        const message = userInput.value.trim();
        if (message) {
            // 显示用户消息
            displayMessage(message, 'user');
            try {
                // 调用智能体接口
                const response = await callAgentAPI(message);
                // 显示智能体回复
                displayMessage(response, 'ai');
            } catch (error) {
                console.error('调用智能体接口出错:', error);
                displayMessage('抱歉，与智能体通信时出现错误，请稍后再试。', 'ai');
            }
            // 清空输入框
            userInput.value = '';
        }
    });

    // 显示消息的函数
    function displayMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        messageDiv.textContent = message;
        chatContent.appendChild(messageDiv);
        // 滚动到最新消息
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    // 调用智能体接口的函数
    async function callAgentAPI(message) {
        try {
            const response = await fetch('https://api.example.com/agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                }),
            });

            if (!response.ok) {
                throw new Error('网络响应不正常');
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            throw error;
        }
    }
});
