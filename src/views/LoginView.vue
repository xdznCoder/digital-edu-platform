<template>
  <div class="login-view-container">
    <div class="login-header">数字化智能教学互动平台</div>
    <div class="login-box-container d-flex justify-center align-center">
      <v-sheet :width="500" class="login-box rounded-xl">
        <div class="mx-12 my-10">
          <div class="text-h5 mb-8 font-weight-bold">教师登录</div>
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
                target="_blank"
            >
              忘记密码?</a>
          </div>
          <v-btn block rounded color="blue-lighten-1" class="mt-8" size="large" @click="handleLogin">登录</v-btn>
        </div>
      </v-sheet>
    </div>
    <div class="login-footer d-flex justify-center align-center">
      <div>Copyright © 2025 西南石油大学</div>
    </div>
    <v-snackbar :color="snackBar.color" v-model="snackBar.show" :text="snackBar.message" location="top"></v-snackbar>
  </div>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {SnackBar} from "@/types/snackbar";
import {useRouter} from "vue-router";

const routers = useRouter();

const passwordVisible = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");
const snackBar = ref<SnackBar>(new SnackBar());

function handleLogin() {
  if (password.value === "123456" && email.value === "admin") {
    snackBar.value.showSuccessMessage('登录成功')
    setTimeout(() => {
      routers.push("/")
    }, 1000)
    return
  }

  snackBar.value.showErrorMessage('邮箱或密码错误')
}
</script>



<style lang="scss" scoped>
.login-header {
  position: relative;
  top: 3vh;
  left: 3vw;
  height: 0;
  color: white;
  font-weight: bold;
  font-size: 40px;
}
.login-view-container {
  min-width: 1200px;
  background-image: url('https://shanghairanking.cn/api/static/uimg/univ_env/10615/1595001218465.jpg');
  background-size: cover;
}
.login-box-container {
  margin-left: 50vw;
  height: 95vh;
}
.login-box {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
}
.login-footer {
  height: 5vh;
}
</style>
