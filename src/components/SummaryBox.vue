<template>
  <div class="summary-view">
    <div class="d-flex justify-space-between pa-6">
      <div class="text-h5 text-indigo-lighten-2">总结页面</div>
      <v-btn variant="outlined" color="primary" @click="handleShowAI">AI总结</v-btn>
    </div>
    <div class="d-flex mx-6">
      <RankList :enable-edit="false" max-height="630" class="mr-6" style="flex: 1" :data="GameStatus"
        @click="handleShowTeamLog" />
      <TileRank :enable-edit="false" max-height="630" style="flex: 1" :data="GameStatus" mode="student"
        @click="handleShowStudentLog" />
    </div>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <v-card v-if="overlayMode !== 'ai'">
      <div v-if="overlayMode === 'student'" class="pa-4 bg-blue-lighten-1 d-flex justify-center">{{ selectedStudentName
      }}
        - 得分日志记录</div>
      <div v-if="overlayMode === 'team'" class="pa-4 bg-blue-lighten-1 d-flex justify-center">第 {{ selectedTeamId }} 组 -
        得分日志记录</div>
      <v-data-table-server v-if="overlayMode === 'student'" v-model:items-per-page="pageSizeStudent"
        v-model:page="pageNumStudent" :items-length="totalNumStudent" no-data-text="未查询到日志信息" density="comfortable"
        :headers="studentHeaders" items-per-page-text="每页展示："
        :page-text="`第 ${pageNumStudent} 页，共 ${totalNumStudent} 项`" @update:options="useStudentLog" class="pa-4"
        :items="studentLog"></v-data-table-server>
      <v-data-table-server v-if="overlayMode === 'team'" v-model:items-per-page="pageSizeTeam"
        v-model:page="pageNumTeam" :items-length="totalNumTeam" no-data-text="未查询到日志信息" density="comfortable"
        :headers="teamHeaders" items-per-page-text="每页展示：" :page-text="`第 ${pageNumTeam} 页，共 ${totalNumTeam} 项`"
        @update:options="useTeamLog" class="pa-4" :items="teamLog"></v-data-table-server>
    </v-card>
    <ChatBox v-else :id="GameStatus.id" />
  </v-overlay>
</template>

<script setup lang="ts">
import RankList from "@/components/proposal/RankList.vue";
import TileRank from "@/components/board/TileRank.vue";
import { defineProps, ref, watch } from "vue";
import { ApiMap } from "@/api/type";
import { useApi } from "@/api/handler";
import { log } from "@/api";
import ChatBox from "@/components/ChatBox.vue";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const showOverlay = ref<boolean>(false)
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const studentLog = ref<ApiMap['/log/student/list']['resp']['list']>([])
const teamLog = ref<ApiMap['/log/team/list']['resp']['list']>([])
const overlayMode = ref<'student' | 'team' | 'ai'>('team') // true - Student, false - Team

const selectedStudentId = ref<number>(0)
const pageSizeStudent = ref<number>(10)
const pageNumStudent = ref<number>(1)
const totalNumStudent = ref<number>(0)
const selectedStudentName = ref<string>('')
const studentHeaders = [
  { title: '编号', value: 'id' },
  { title: '学生 ID', value: 'studentId' },
  { title: '小组 ID', value: 'teamId' },
  { title: '游戏 ID', value: 'gameId' },
  { title: '得分', value: 'score' },
  { title: '原因', value: 'reason' },
  { title: '轮次', value: 'round' },
  { title: '阶段', value: 'phase' },
  { title: '时间', value: 'gmtCreate' },
  { title: '备注', value: 'comment' }
]

const selectedTeamId = ref<number>(0)
const pageSizeTeam = ref<number>(10)
const pageNumTeam = ref<number>(1)
const totalNumTeam = ref<number>(0)
const teamHeaders = [
  { title: '编号', value: 'id' },
  { title: '小组 ID', value: 'teamId' },
  { title: '游戏 ID', value: 'gameId' },
  { title: '得分', value: 'score' },
  { title: '原因', value: 'reason' },
  { title: '轮次', value: 'round' },
  { title: '阶段', value: 'phase' },
  { title: '时间', value: 'gmtCreate' },
  { title: '备注', value: 'comment' }
]

function handleShowAI() {
  overlayMode.value = 'ai'
  showOverlay.value = true
}

function handleShowTeamLog(data: { item: { teamId: number }, index: number }) {
  const { item } = data
  overlayMode.value = 'team'
  showOverlay.value = true
  selectedTeamId.value = item.teamId
  useTeamLog()
}

function handleShowStudentLog(data: { mode: string, item: { studentId: number, studentName: string }, index: number }) {
  const { mode, item } = data
  if (mode === 'team') return
  overlayMode.value = 'student'
  showOverlay.value = true
  selectedStudentId.value = item.studentId
  selectedStudentName.value = item.studentName
  useStudentLog()
}

const useStudentLog = () => {
  useApi({
    api: log.StudentLog({
      gameId: GameStatus.value!.id,
      studentId: selectedStudentId.value,
      pageNum: pageNumStudent.value,
      pageSize: pageSizeStudent.value,
    }),
    onSuccess: resp => {
      studentLog.value = (resp.data as ApiMap['/log/student/list']['resp']).list
      totalNumTeam.value = (resp.data as ApiMap['/log/student/list']['resp']).total
    }
  })
}

const useTeamLog = () => {
  useApi({
    api: log.TeamLog({
      gameId: GameStatus.value!.id,
      teamId: selectedTeamId.value,
      pageNum: pageNumTeam.value,
      pageSize: pageSizeTeam.value,
    }),
    onSuccess: resp => {
      teamLog.value = (resp.data as ApiMap['/log/team/list']['resp']).list
      totalNumStudent.value = (resp.data as ApiMap['/log/team/list']['resp']).total
    }
  })
}

watch(() => props.data, newVal => {
  GameStatus.value = newVal ?? null
}, { immediate: true })
</script>


<style scoped lang="scss"></style>
