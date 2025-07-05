<template>
  <div class="download-box pa-6 rounded-lg">
    <div class="text-h6 mb-4">下载模板文件</div>
    <div>
      <v-number-input
          v-model="teamMaxNum"
          variant="outlined"
          density="compact"
          placeholder="请输入每组最大人数"
          :min="0"
      ></v-number-input>
    </div>
    <div class="d-flex justify-end">
      <v-btn color="info" class="mr-4" @click="emits('download', teamMaxNum)">下载</v-btn>
      <v-btn color="red-lighten-2" @click="emits('cancel')">取消</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from "vue";

const teamMaxNum = ref<number | null>(null)

const emits = defineEmits(['download', 'cancel'])
</script>

<style scoped lang="scss">
.download-box {
  background-color: white;
  min-width: 500px;
}
</style>
