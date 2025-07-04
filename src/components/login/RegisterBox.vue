<template>
  <v-text-field
      density="compact"
      placeholder="请输入邮箱"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      prefix="   "
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

  <v-text-field
      :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      density="compact"
      placeholder="请输入密码"
      prefix="   "
      variant="outlined"
      rounded
      v-model="password"

      prepend-inner-icon="mdi-lock-outline"
      :type="passwordVisible ? 'text' : 'password'"
      @click:append-inner="passwordVisible = !passwordVisible"
  ></v-text-field>

  <v-text-field
      :append-inner-icon="rePasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      density="compact"
      placeholder="请再次输入密码"
      prefix="   "
      variant="outlined"
      rounded
      v-model="rePassword"

      prepend-inner-icon="mdi-lock-outline"
      :type="rePasswordVisible ? 'text' : 'password'"
      @click:append-inner="rePasswordVisible = !rePasswordVisible"
  ></v-text-field>
  <v-btn block rounded color="blue-lighten-1" class="mt-4" size="large" @click="handleRegister">注册</v-btn>
</template>

<script setup lang="ts">
import {ref, defineEmits} from "vue";
import store from "@/store";
import {useApi} from "@/api/handler";
import {user} from "@/api";

const emits = defineEmits(['pushBack'])

const codeSent = ref<boolean>(false)
const countDown = ref<number>(60)
let counter: ReturnType<typeof setInterval> | null = null

const email = ref<string>('')
const code = ref<string>('')
const password = ref<string>('')
const rePassword = ref<string>('')

const passwordVisible = ref<boolean>(false)
const rePasswordVisible = ref<boolean>(false)

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

function handleRegister(): void {
  if (password.value !== rePassword.value) {
    store.dispatch('snackBarModule/showError', '两次密码输入不一致')
    return
  }
  if (password.value.length < 6 || password.value.length > 20) {
    store.dispatch('snackBarModule/showError', '密码长度应介于6与20之间')
    return
  }
  useRegister()
}

const useSendEmail = () => {
  useApi({api: user.SendEmail(email.value), tip: '发送成功'})
}

const useRegister = () => {
  useApi({
    api: user.Register({
      username: email.value,
      email: email.value,
      password: password.value,
      nickname: email.value,
      avatar: '',
      type: 0,
      code: code.value
    }),
    onSuccess: () => {
      setTimeout(() => {
        emits('pushBack')
      }, 1000)
    },
    tip: '注册成功'
  })
}
</script>

<style scoped lang="scss">

</style>
