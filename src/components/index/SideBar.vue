<template>
  <div class="index-sidebar mx-4">
    <v-sheet class="sidebar-container" height="800px" min-width="240px">
      <div class="user-info py-6" v-if="info">
        <div class="d-flex justify-center my-3">
          <v-avatar size="110" :image="info.avatar"/>
        </div>
        <div class="text-md-h6 font-weight-bold d-flex justify-center text-white">{{info.nickname}}</div>
        <div class="text-sm d-flex justify-center text-white">{{info.username}}</div>
      </div>
      <v-divider color="white" thickness="1px" opacity="0.6"/>
      <div>
        <v-list class="navigation-buttons" v-model:selected="selected" mandatory>
        <v-list-item
            base-color="white"
            v-for="(item, i) in items"
            :key="i"
            :value="item.value"
            height="50px"
            @click="router.push(item.path)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" class="ml-4"></v-icon>
          </template>

          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
          </v-list>
      </div>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import {user} from "@/api";
import {onMounted, ref} from "vue";
import store from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()
const selected = ref<[number]>([0])

const info = ref<ReturnType<typeof user.GetUserInfo> | null>(null)

onMounted(() => {
  info.value = user.GetUserInfo()
  if (!info.value) {
    store.dispatch('snackBarModule/showError', '请先登录')
    router.push({ path: '/login' })
  }
})

const items = [
  { text: '班级管理', icon: 'mdi-clock', value: 0, path: '/' },
  { text: '游戏管理', icon: 'mdi-flag', value: 1, path: '/game' },
  { text: '用户设置', icon: 'mdi-account', value: 2, path: '/user' },
]
</script>

<style scoped lang="scss">
.sidebar-container {
  border-radius: 10px;
  box-shadow: 4px 6px 6px 0 rgba(0, 0, 0, 0.2);
  background-color: #3a51b9;
}
.navigation-buttons {
  background-color: #3a51b9;
}
</style>
