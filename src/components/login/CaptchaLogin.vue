<template>
  <v-text-field
      density="compact"
      placeholder="请输入邮箱"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      prefix="   "
      class="mb-2"
      rounded
      v-model="email"
  ></v-text-field>

  <div class="d-flex">
    <v-text-field
      density="compact"
      placeholder="请输入验证码"
      prefix="   "
      variant="outlined"
      rounded
      v-model="code"

      prepend-inner-icon="mdi-security"
  ></v-text-field>
    <v-btn class="ml-4 code-button" color="primary" :disabled="codeSent" @click="handleSendEmail">{{ codeSent ? countDown + '秒后重试' : '获取验证码' }}</v-btn>
  </div>

  <v-btn block rounded color="blue-lighten-1" class="mt-4" size="large" @click="handleLogin">登录</v-btn>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {user} from "@/api";
import {useApi} from "@/api/handler";
import store from "@/store";
import {useRouter} from "vue-router";

const routers = useRouter();
const email = ref<string>('')
const code = ref<string>('')

const codeSent = ref<boolean>(false)
const countDown = ref<number>(60)
let counter: ReturnType<typeof setInterval> | null = null

function handleSendEmail(): void {
  if (codeSent.value) return
  if (email.value === '') {
    store.dispatch('snackBarModule/showError', '请正确填写邮箱')
    return
  }
  codeSent.value = true
  counter = setInterval(() => {
    countDown.value -= 1
    if (countDown.value === 0) {
      countDown.value = 60
      codeSent.value = false
      if (counter) clearInterval(counter)
    }
  }, 1000)
  useSendEmail()
}

function handleLogin(): void {
  useCaptchaLogin()
}

const useSendEmail = () => {
  useApi({api: user.SendEmail(email.value), tip: '发送成功'})
}

const useCaptchaLogin = () => {
  useApi({
    api: user.CaptchaLogin(email.value, code.value),
    onSuccess: callback => {
      window.localStorage.setItem("user", JSON.stringify(callback.data));
      setTimeout(() => {
        routers.push("/")}, 1000)
    },
    tip: '登录成功'
  })
}
</script>

<style scoped lang="scss">
.code-button {
  position: relative;
  top: 2px;
}
</style>
