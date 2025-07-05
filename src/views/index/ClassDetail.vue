<template>
  <div class="class-detail-container">
      <div class="text-h6 my-5 ml-10" v-if="classDetail">{{classDetail.classCode}}</div>
    <v-divider />
    <div class="operate-buttons d-flex justify-space-between ma-4">
      <v-text-field
          v-model="keyWord"
          variant="outlined"
          density="compact"
          rounded
          max-width="300px"
          append-inner-icon="mdi-magnify"
          placeholder="搜索学生"
          hide-details
          clearable
          single-line
          @click:append-inner="handleSearch"
          @click:clear="handleSearch"
      ></v-text-field>

      <div class="d-flex">
        <FileUpload/>
        <v-btn variant="text" color="red-lighten-2" class="ml-4" @click="showDialog = true">删除班级</v-btn>
      </div>
    </div>
      <v-card rounded class="ma-4">
        <StudentList ref="StudentListRef" :cid="id" :key-word="keyWord"/>
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

const route = useRoute()
const routers = useRouter()
const id = Number(route.query.id)
const classDetail = ref<ApiMap['/class/:id']['resp'] | null>(null)
const showDialog = ref<boolean>(false)
const keyWord = ref<string>('')
const StudentListRef = ref<InstanceType<typeof StudentList> | null>(null)

onMounted(() => {
  useClassDetail()
})

function handleSearch() {
  if (!StudentListRef.value) return
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
</script>

<style scoped lang="scss">
</style>
