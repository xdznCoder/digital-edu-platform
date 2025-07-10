<template>
  <div class="edit-user-view d-flex" v-if="info">
    <div class="pa-6 edit-user-form">
      <div class="text-h5 font-weight-bold text-blue-lighten-2 ma-6">修改用户信息</div>

      <div class="d-flex form-row nickname-setting">
        <div class="px-8 mt-1 text-label">昵称</div>
        <v-text-field
            v-model="info.nickname"
            placeholder="请输入昵称"
            variant="outlined"
            density="compact"
            :rules="[rules.required]"
        />
      </div>

      <div class="d-flex form-row avatar-setting">
        <div class="px-8 mt-1 text-label">头像链接</div>
        <v-text-field
            v-model="info.avatar"
            placeholder="请输入头像图片链接"
            variant="outlined"
            density="compact"
            :rules="[rules.url]"
        />
      </div>

      <div class="d-flex form-row avatar-preview" v-if="info.avatar">
        <div class="px-8 mt-1 text-label">头像预览</div>
        <v-avatar size="64">
          <v-img :src="info.avatar" />
        </v-avatar>
      </div>

      <div class="ml-6 mt-4">
        <v-btn block color="blue-lighten-1" height="40px" @click="handleSubmitForm">保存</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import store from '@/store'
import {useApi} from "@/api/handler";
import {user} from "@/api";
import {ApiMap} from "@/api/type";
import router from "@/router";

const info = ref<ApiMap['/user/login']['resp'] | null>(null)

onMounted(() => {
  info.value = user.GetUserInfo()
})

const rules = {
  required: (v: string) => !!v || '不能为空',
  url: (v: string) =>
      !v || /^https?:\/\/.+/.test(v) || '请输入合法的链接地址',
}

function handleSubmitForm () {
  if (!info.value) return
  if (!info.value.nickname) {
    store.dispatch('snackBarModule/showError', '昵称不能为空')
    return
  }
  useUpdateUser()
  store.dispatch('snackBarModule/showSuccess', '更新成功')
}

const useUpdateUser = () => {
  if (!info.value) return
  useApi({
    api: user.UpdateUser({
      id: +info.value.id,
      nickname: info.value.nickname,
      avatar: info.value.avatar,
      username: info.value.username,
    }),
    onSuccess: () => {
      window.localStorage.removeItem('user')
      router.push('/login')
    },
    tip: '更改成功'
  })
}
</script>

<style lang="scss" scoped>
.text-label {
  font-size: 18px;
  min-width: 180px;
}

.edit-user-form {
  min-width: 550px;
}

.form-row {
  margin-top: 10px;
}
</style>

