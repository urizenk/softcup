// 初始化文件数据
let files = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 表单提交事件
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', handleFileUpload);

    // 筛选事件
    const filterOptions = document.querySelectorAll('.filter-options li');
    filterOptions.forEach(option => {
        option.addEventListener('click', handleFilterClick);
    });

    const tagFilter = document.getElementById('tag-filter');
    tagFilter.addEventListener('input', handleTagFilter);

    // 加号按钮点击事件
    const addButton = document.querySelector('.add-button');
    const uploadModal = document.querySelector('.upload-modal');
    const closeModal = document.querySelector('.close-modal');

    addButton.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });
});

// 处理文件上传
function handleFileUpload(e) {
    e.preventDefault();

    const fileName = document.getElementById('file-name').value;
    const subject = document.getElementById('subject').value;
    const fileType = document.getElementById('file-type').value;
    const tagsInput = document.getElementById('tags').value;
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    const newFile = {
        id: Date.now(),
        name: fileName,
        subject,
        type: fileType,
        tags,
        file: file ? URL.createObjectURL(file) : null
    };

    files.push(newFile);
    renderFiles();
    e.target.reset();
}

// 修改渲染文件列表函数
function renderFiles() {
    const knowledgeContainer = document.querySelector('.knowledge-container');
    knowledgeContainer.innerHTML = '';

    const selectedSubject = document.querySelector('.filter-item:nth-child(1) .active').dataset.subject;
    const selectedType = document.querySelector('.filter-item:nth-child(2) .active').dataset.type;
    const tagFilter = document.getElementById('tag-filter').value.trim().toLowerCase();

    const filteredFiles = files.filter(file => {
        const subjectMatch = selectedSubject === 'all' || file.subject === selectedSubject;
        const typeMatch = selectedType === 'all' || file.type === selectedType;
        const tagMatch = tagFilter === '' || file.tags.some(tag => 
            tag.toLowerCase().includes(tagFilter)
        );
        return subjectMatch && typeMatch && tagMatch;
    });

    filteredFiles.forEach(file => {
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        fileCard.dataset.subject = file.subject;
        fileCard.dataset.type = file.type;

        fileCard.innerHTML = `
            <button class="delete-btn">×</button>
            <div class="file-info">
                <h3>${file.name}</h3>
                <p>科目: ${file.subject} | 类型: ${file.type}</p>
                ${file.file ? `<a href="${file.file}" download>下载文件</a>` : ''}
                <div class="file-tags">
                    ${file.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // 添加删除按钮事件监听
        const deleteBtn = fileCard.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            files = files.filter(f => f.id !== file.id);
            renderFiles();
        });

        knowledgeContainer.appendChild(fileCard);
    });
}

// 处理筛选点击事件
function handleFilterClick() {
    const filterType = this.parentElement.parentElement.querySelector('.filter-label').textContent.replace(':', '');
    const filterValue = this.dataset.subject || this.dataset.type;

    // 更新激活状态
    this.parentElement.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
    });
    this.classList.add('active');

    renderFiles();
}

// 处理标签筛选
function handleTagFilter() {
    renderFiles();
}