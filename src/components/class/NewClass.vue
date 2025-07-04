<template>
  <div class="new-class-container pa-6 rounded-lg">
    <div class="text-h6 mb-4">添加班级</div>
    <div>
      <v-text-field
          v-model="classCode"
          variant="outlined"
          density="compact"
          placeholder="请输入课程编号"
          :rules="[rules.required]"
      ></v-text-field>
    </div>
    <div class="d-flex justify-end">
      <v-btn color="info" class="mr-4" @click="handleSubmit">确认</v-btn>
      <v-btn color="red-lighten-2" @click="emits('close')">取消</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from "vue";
import {classes} from "@/api";
import {useApi} from "@/api/handler";

const classCode = ref<string>('')

const emits = defineEmits(['close'])
const rules = {
  required: (value: string) => !!value || '课程编号不可为空'
}

function handleSubmit() {
  if (classCode.value === "") {
    return
  }
  useNewClass()
}

const useNewClass = () => {
  useApi({
    api: classes.NewClass(classCode.value),
    onSuccess: () => {emits('close')},
    tip: '添加成功'
  })
}
</script>

<style scoped lang="scss">
.new-class-container {
  background-color: white;
  min-width: 500px;
}
</style>
