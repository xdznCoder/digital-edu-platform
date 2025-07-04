<template>
  <div class="login-view-container">
    <div class="login-header">数字化智能教学互动平台</div>
    <div class="login-box-container d-flex justify-center align-center">
      <v-sheet :width="500" class="login-box rounded-xl">

        <div class="h-0 ml-6 mt-4 text-lg return-button" v-if="registerMode" @click="registerMode = false">
          <v-icon class="mb-1" icon="mdi-chevron-left"/>{{ ' 返回' }}</div>
        <div class="mx-12 my-10">
          <div class="text-h5 mb-8 font-weight-bold" v-if="!registerMode">教师登录</div>
          <div class="text-h5 mb-8 font-weight-bold" v-if="registerMode">新用户注册</div>
          <RegisterBox v-if="registerMode" @push-back="registerMode = false"/>
          <CaptchaLogin v-if="!registerMode && captchaMode" />
          <PasswordLogin v-if="!registerMode && !captchaMode"/>
          <div class="d-flex justify-end mt-3 mr-2">
            <a class="text-caption text-decoration-none text-blue" v-if="!registerMode" href="#" @click="registerMode = true">新用户注册</a>
            <div class="mx-2 login-box-divider" v-if="!registerMode">|</div>
            <a class="text-caption text-decoration-none text-blue" v-if="!registerMode" href="#" @click="captchaMode = !captchaMode">{{captchaMode ? '邮箱密码登录' : '验证码登录'}}</a>
          </div>
        </div>
      </v-sheet>
    </div>
    <div class="login-footer d-flex justify-center align-center">
      <div>Copyright © 2025 西南石油大学</div>
    </div>
  </div>
</template>


<script setup lang="ts">
import PasswordLogin from "@/components/login/PasswordLogin.vue";
import {ref} from "vue";
import CaptchaLogin from "@/components/login/CaptchaLogin.vue";
import RegisterBox from "@/components/login/RegisterBox.vue";

const captchaMode = ref<boolean>(false)
const registerMode = ref<boolean>(false)
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
.login-box-divider {
  position: relative;
  bottom: 2px;
  color: #8a8a8a;
}
.return-button {
  user-select: none;
  cursor: pointer;
}
</style>
