<template>
  <div class="not-found-container">
    <h1 class="code">404</h1>
    <p class="title">页面未找到</p>
    <p class="tip">你访问的页面不存在或已被删除</p>
    <a class="back-link" @click.prevent="goHome" href="#">返回首页</a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  color: #333;
}

.code {
  font-size: 96px;
  font-weight: bold;
  margin: 0;
}

.title {
  font-size: 24px;
  margin: 12px 0 8px;
}

.tip {
  font-size: 16px;
  color: #888;
  margin-bottom: 24px;
}

.back-link {
  font-size: 16px;
  color: #1976d2;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}

.back-link:hover {
  border-color: #1976d2;
}
</style>


