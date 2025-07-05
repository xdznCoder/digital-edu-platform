<template>
  <div class="class-detail-container">
      <div class="text-h6 my-5 ml-10" v-if="classDetail">{{classDetail.classCode}}</div>
    <v-divider />
    <div class="operate-buttons d-flex justify-space-between ma-4">
      <div class="d-flex">
        <v-text-field
            v-model="keyWord"
            variant="outlined"
            density="compact"
            rounded
            width="300px"
            append-inner-icon="mdi-magnify"
            placeholder="搜索学生"
            hide-details
            clearable
            single-line
            @click:append-inner="handleSearch"
            @click:clear="handleSearch"
        ></v-text-field>
        <v-btn class="mx-4" color="blue-darken-1" rounded @click="showOverlay = true">手动添加学生</v-btn>
      </div>

      <div class="d-flex">
        <FileUpload @upload="handleUpload"/>
        <v-btn variant="text" color="red-lighten-2" class="ml-4" @click="showDialog = true">删除班级</v-btn>
      </div>
    </div>
      <v-card rounded class="ma-4">
        <StudentList :loading="fileUploaded" ref="StudentListRef" :cid="id" :key-word="keyWord"/>
      </v-card>
    </div>
  <v-dialog v-model="showDialog" width="auto">
    <ConfirmDialog
        title="删除班级"
        text="此删除操作不可逆，是否确认删除？"
        @cancel="showDialog = false"
        @confirm="useDeleteClass"
    />
  </v-dialog>
  <v-overlay v-model="showOverlay"
             class="align-center justify-center">
    <NewStudent :cid="id" @close="handleClose"/>
  </v-overlay>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {classes} from "@/api";
import {useApi} from "@/api/handler";
import {ApiMap} from "@/api/type";
import StudentList from "@/components/class/StudentList.vue";
import FileUpload from "@/components/FileUpload.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import NewStudent from "@/components/class/NewStudent.vue";

const route = useRoute()
const routers = useRouter()
const id = Number(route.query.id)
const classDetail = ref<ApiMap['/class/:id']['resp'] | null>(null)
const showDialog = ref<boolean>(false)
const keyWord = ref<string>('')
const StudentListRef = ref<InstanceType<typeof StudentList> | null>(null)
const fileUploaded = ref<boolean>(false)
const showOverlay = ref<boolean>(false)

onMounted(() => {
  useClassDetail()
})

function handleSearch() {
  if (!StudentListRef.value) return
  StudentListRef.value.exposedStudentList(keyWord.value)
}

function handleUpload(file: File) {
  useUploadStudent(file)
}

function handleClose() {
  showOverlay.value = false
  StudentListRef.value.exposedStudentList(keyWord.value)
}

const useClassDetail = () => {
  useApi({
    api: classes.ClassDetail(id),
    onSuccess: resp => {
      classDetail.value = resp.data as ApiMap['/class/:id']['resp']
    }
  })
}

const useDeleteClass = () => {
  useApi({
    api: classes.DeleteClass(id),
    onSuccess: () => {
      routers.push('/')
    },
    tip: '删除成功'
  })
}

const useUploadStudent = (file: File) => {
  fileUploaded.value = true
  useApi({
    api: classes.UploadStudent(id, file),
    onSuccess: () => {
      if (!StudentListRef.value) return
      StudentListRef.value.exposedStudentList(keyWord.value)
    },
    Finally: () => {fileUploaded.value = false},
    tip: '上传成功'
  })
}
</script>

<style scoped lang="scss">
</style>
