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
  <div class="d-flex justify-end">
    <a
        class="text-caption text-decoration-none text-blue"
        href="#"
        rel="noopener noreferrer"
        @click="handleForgetPassword"
    >
      忘记密码?</a>
  </div>
  <v-btn block rounded color="blue-lighten-1" class="mt-4" size="large" @click="handleLogin">登录</v-btn>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {user} from "@/api";
import {useApi} from "@/api/handler";
import store from "@/store";

const routers = useRouter();

const passwordVisible = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");

function handleLogin() {
  useUserLogin()
}

function handleForgetPassword() {
  store.dispatch('snackBarModule/showError', '功能暂未开放')
}

const useUserLogin = () => {
  useApi({
    api: user.PasswordLogin(email.value, password.value),
    onSuccess: callback => {
      window.localStorage.setItem("user", JSON.stringify(callback.data));
      setTimeout(() => {routers.push("/")}, 1000)
    },
    tip: '登录成功'
  })
}

</script>

<style scoped lang="scss">

</style>
