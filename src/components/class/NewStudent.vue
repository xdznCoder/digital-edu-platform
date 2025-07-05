<template>
  <div class="new-student-container pa-6 rounded-lg">
    <div class="text-h6 mb-4">手动添加学生</div>
    <div>
      <v-text-field
          v-model="studentID"
          variant="outlined"
          density="compact"
          placeholder="请输入学号"
          :rules="[rules.snoRequired]"
          prepend-inner-icon="mdi-identifier"
          class="my-2"
      ></v-text-field>
      <v-text-field
          v-model="studentName"
          variant="outlined"
          density="compact"
          placeholder="请输入姓名"
          :rules="[rules.nameRequired]"
          prepend-inner-icon="mdi-account"
      ></v-text-field>
    </div>
    <div class="d-flex justify-end">
      <v-btn color="info" class="mr-4" @click="handleSubmit">确认</v-btn>
      <v-btn color="red-lighten-2" @click="emits('close')">取消</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, defineProps} from "vue";
import {classes} from "@/api";
import {useApi} from "@/api/handler";
const props = defineProps<{
  cid: number
}>()

const studentID = ref<string>('')
const studentName = ref<string>('')

const emits = defineEmits(['close'])
const rules = {
  snoRequired: (value: string) => !!value || '学号不可为空',
  nameRequired: (value: string) => !!value || '姓名不可为空'
}

function handleSubmit() {
  if (studentID.value === "" || studentName.value === "") {
    return
  }
  useNewClass()
}

const useNewClass = () => {
  useApi({
    api: classes.UploadStudentSingle(props.cid, studentID.value, studentName.value),
    onSuccess: () => {emits('close')},
    tip: '添加成功'
  })
}
</script>

<style scoped lang="scss">
.new-student-container {
  background-color: white;
  min-width: 500px;
}
</style>
