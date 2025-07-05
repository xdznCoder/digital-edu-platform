<template>
  <div class="index-header py-6 px-6 d-flex">
    <div class="title text-h6 font-weight-bold text-white">
      数字化智能教学互动平台
    </div>
    <v-menu
        open-on-hover
    >
      <template v-slot:activator="{ props }">
        <div class="mr-10 d-flex setting" v-bind="props" v-if="info">
          <v-avatar size="30" class="mr-3" :image="info.avatar"></v-avatar>
          <div class="text-white mt-1">{{info.nickname}}</div>
          <v-icon class="mt-1" icon="mdi-chevron-down" color="white"></v-icon>
        </div>
      </template>
      <v-list density="compact" class="mt-2">
        <v-list-item link title="用户设置"></v-list-item>
        <v-list-item link title="退出登录" @click="handleLogout"></v-list-item>
      </v-list>
    </v-menu>

  </div>
</template>

<script setup lang="ts">
import {user} from "@/api";
import {onMounted, ref} from "vue";
import store from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()

const info = ref<ReturnType<typeof user.GetUserInfo> | null>(null)

onMounted(() => {
  info.value = user.GetUserInfo()
  if (!info.value) {
    store.dispatch('snackBarModule/showError', '请先登录')
    router.push({ path: '/login' })
  }
})

function handleLogout() {
  window.localStorage.removeItem("user")
  store.dispatch('snackBarModule/showSuccess', '退出登录成功')
  router.push({ path: '/login' })
}
</script>

<style scoped lang="scss">
.index-header {
  width: 100vw;
  height: 80px;
  background-image: linear-gradient(135deg, #5b75cc 0%, #253de3 100%);
  justify-content: space-between
}
.setting {
  cursor: pointer;
  user-select: none;
}
</style>
