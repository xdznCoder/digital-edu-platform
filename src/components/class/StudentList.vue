<template>
  <div class="student-list-container">
    <div class="w-100 bg-indigo-lighten-2 text-h6 pl-6 py-4">学生列表</div>
    <div class="student-table">
      <v-data-table-server
          :headers="headers"
          v-model="selectedStudent"
          show-select
          v-if="studentList"
          :items="studentList"
          v-model:items-per-page="pageSize"
          v-model:page="pageNum"
          :items-length="totalNum"
          no-data-text="该班级尚未导入学生"
          density="comfortable"
          items-per-page-text="每页展示："
          :page-text="`第 ${pageNum} 页，共 ${totalNum} 名`"
          @update:options="useStudentList"
          :loading="loading"
          hover
      />
      <v-btn color="red-lighten-2"
             v-if="selectedStudent && Object.keys(selectedStudent).length > 0"
             class="ml-6 delete-button"
             @click="useDeleteStudent"
      >删除</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps,onMounted, ref, defineExpose} from 'vue'
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {classes} from "@/api";

const props = defineProps<{
  cid: number,
  loading: boolean,
}>()

const studentList = ref<ApiMap['/class/student/list']['resp']['list'] | null>(null)
const headers = [{ title: 'ID', key: 'id', align: 'begin' }, { title: '学号', key: 'sno', align: 'begin' }, { title: '名称', key: 'name', align: 'begin' }]

const selectedStudent = ref<Array<number> | null>(null)
const pageSize = ref<number>(10)
const pageNum = ref<number>(1)
const totalNum = ref<number>(0)
const keyWord = ref<string>('')

onMounted(() => {
  useStudentList()
})

function exposedStudentList(key: string) {
  keyWord.value = key
  useStudentList()
}

const useStudentList = () => {
  useApi({
    api: classes.StudentList(props.cid, pageNum.value, pageSize.value, keyWord.value),
    onSuccess: resp => {
      const data = resp.data as ApiMap['/class/student/list']['resp']
      totalNum.value = data.total
      studentList.value = data.list
    }
  })
}

const useDeleteStudent = () => {
  if (!selectedStudent.value) return
  useApi({
    api: classes.DeleteStudent(selectedStudent.value),
    onSuccess: () => {
      useStudentList()
      selectedStudent.value = []
    },
    tip: '删除成功'
  })
}

defineExpose({ exposedStudentList })
</script>

<style scoped lang="scss">
.student-list-container {
  min-width: 700px;
  min-height: 650px;
}
.delete-button {
  position: relative;
  bottom: 50px;
}
</style>
