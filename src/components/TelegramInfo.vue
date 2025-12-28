<template>
  <div class="telegram-info">
    <!-- 加载状态 -->
    <div v-if="!isReady" class="flex items-center justify-center p-8 bg-white/10 rounded-lg">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span class="ml-3 text-white">正在加载 Telegram SDK...</span>
    </div>

    <!-- 用户信息卡片 -->
    <div v-if="displayUser" class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <!-- 头像和基本信息 -->
      <div class="flex items-center space-x-4 mb-6">
        <div v-if="displayUser.photo_url" class="relative">
          <img 
            :src="displayUser.photo_url" 
            alt="用户头像" 
            class="w-16 h-16 rounded-full border-2 border-white/30 shadow-md"
          />
          <div v-if="displayUser.is_premium" class="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
            <svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-white/30 shadow-md">
          <span class="text-2xl font-bold text-white">{{ getUserInitials() }}</span>
        </div>
        
        <div class="flex-1">
          <h3 class="text-xl font-bold text-white mb-1">
            {{ displayUser.first_name }} {{ displayUser.last_name || '' }}
          </h3>
          <p v-if="displayUser.username" class="text-blue-200 font-medium">
            @{{ displayUser.username }}
          </p>
          <p v-else class="text-gray-300 text-sm">
            无用户名
          </p>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 用户ID -->
        <div class="bg-black/20 rounded-lg p-4">
          <div class="text-gray-300 text-sm font-medium mb-1">用户 ID</div>
          <div class="text-white font-mono text-lg">{{ displayUser.id }}</div>
        </div>

        <!-- Chat Instance -->
        <div class="bg-black/20 rounded-lg p-4">
          <div class="text-gray-300 text-sm font-medium mb-1">Chat Instance</div>
          <div class="text-white font-mono text-lg">{{ getChatInstance() || '未设置' }}</div>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="mt-4 text-sm text-gray-300 space-y-1">
        <div class="flex justify-between">
          <span>语言:</span>
          <span class="text-white">{{ displayUser.language_code || '未知' }}</span>
        </div>
        <div class="flex justify-between">
          <span>Premium:</span>
          <span class="text-white">{{ displayUser.is_premium ? '是' : '否' }}</span>
        </div>
        <div class="flex justify-between">
          <span>聊天类型:</span>
          <span class="text-white">{{ getChatType() }}</span>
        </div>
      </div>
    </div>

    <!-- 无用户信息提示 -->
    <div v-else-if="isReady" class="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
      <div class="text-yellow-200 mb-2">
        <svg class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      </div>
      <h3 class="text-yellow-200 font-semibold mb-1">未检测到用户信息</h3>
      <p class="text-yellow-100 text-sm">请确保在Telegram环境中打开此应用</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTelegram } from '../composables/useTelegram.js';
import { parseTelegramWebAppUrl } from '../utils/urlParser.js';

const { 
  user, 
  initDataUnsafe, 
  isReady, 
  getChatInstance
} = useTelegram();
const urlData = ref(null);

// 从 URL 解析的数据（作为备用）
urlData.value = parseTelegramWebAppUrl();

// 合并 SDK 和 URL 解析的数据
const displayUser = computed(() => user.value || urlData.value?.tgWebAppData?.user);

const getChatType = () => {
  return initDataUnsafe.value?.chat_type || urlData.value?.tgWebAppData?.chat_type || '未知';
};

// 获取用户姓名的首字母（用于默认头像）
const getUserInitials = () => {
  if (!displayUser.value) return '?';
  const { first_name, last_name } = displayUser.value;
  let initials = '';
  if (first_name) initials += first_name.charAt(0).toUpperCase();
  if (last_name) initials += last_name.charAt(0).toUpperCase();
  return initials || 'U';
};
</script>

<style scoped>
/* 保留空样式标签，TailwindCSS已处理所有样式 */
</style>
