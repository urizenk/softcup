<template>
  <div id="app">
    <!-- 顶部导航 -->
    <TopNav :user="user" @logout="handleLogout" />
    
    <!-- 主体容器：侧边栏 + 主内容 -->
    <div class="container flex h-[calc(100vh-60px)]">
      <!-- 左侧侧边栏 -->
      <Sidebar :history="chatHistory" @view-more="handleViewMore" />
      
      <!-- 右侧主内容 -->
      <MainContent 
        :messages="messages" 
        :filePreviews="filePreviews"
        @send-message="handleSendMessage"
        @upload-files="handleUploadFiles"
      />
    </div>
  </div>
</template>
