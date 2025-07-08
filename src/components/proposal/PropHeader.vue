<template>
  <div class="index-header py-6 px-6 d-flex">
    <div class="title text-h6 font-weight-bold text-white">
      数字化智能教学互动平台
    </div>
    <v-btn prepend-icon="mdi-home"
           variant="text"
           class="mr-4 btn"
           color="white"
           @click="router.push('/')"
    >
      返回首页
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<style scoped lang="scss">
.index-header {
  width: 100vw;
  height: 80px;
  background-image: linear-gradient(135deg, #5b75cc 0%, #253de3 100%);
  justify-content: space-between
}
.btn {
  font-size: 16px ;
}
</style>
