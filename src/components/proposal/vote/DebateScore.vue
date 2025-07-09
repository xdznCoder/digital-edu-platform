<template>
  <v-card class="pa-8" width="600">
    <div class="mb-6 text-h6">辩论赛结果打分</div>

    <div class="d-flex mb-4">
      <div class="mt-1" style="width: 150px">老师正方评分</div>
      <v-text-field
          v-model.number="tempTeacherScorePro"
          type="number"
          min="0"
          max="100"
          variant="outlined"
          density="compact"
          placeholder="请输入老师正方评分"
      ></v-text-field>
    </div>

    <div class="d-flex mb-6">
      <div class="mt-1" style="width: 150px">老师反方评分</div>
      <v-text-field
          v-model.number="tempTeacherScoreCon"
          type="number"
          min="0"
          max="100"
          variant="outlined"
          density="compact"
          placeholder="请输入老师反方评分"
      ></v-text-field>
    </div>

    <div class="mb-4 text-subtitle-1 font-weight-medium">学生评分</div>

    <div
        v-for="(score, index) in tempStudentScores"
        :key="index"
        class="d-flex align-center mb-3"
    >
      <div style="width: 150px" class="mt-1">小组 {{ score.fromTeamId }} 分数</div>

      <v-text-field
          v-model.number="score.scorePro"
          type="number"
          min="0"
          max="100"
          label="正方分"
          variant="outlined"
          density="compact"
          class="mr-4"
          hide-details
          style="max-width: 120px"
          placeholder="正方"
      ></v-text-field>

      <v-text-field
          v-model.number="score.scoreCon"
          type="number"
          min="0"
          max="100"
          label="反方分"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 120px"
          placeholder="反方"
      ></v-text-field>
    </div>

    <div class="d-flex justify-end">
      <v-btn class="mr-4" color="primary" @click="handleSubmit">提交</v-btn>
      <v-btn color="red-lighten-2" @click="emits('close')">取消</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'
import { useApi } from '@/api/handler'
import { proposal } from '@/api'
import type { ApiMap } from '@/api/type'

const props = defineProps<{
  data: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['submit', 'close'])

const GameStatus = ref(props.data)
const needScoreTeams = ref<number[]>([])

const tempStudentScores = ref<{ fromTeamId: number; scorePro: number; scoreCon: number }[]>([])

const tempTeacherScorePro = ref(0)
const tempTeacherScoreCon = ref(0)

const useNeedScoreList = () => {
  if (!GameStatus.value) return
  useApi({
    api: proposal.NeedScoreList(GameStatus.value.id),
    onSuccess: (resp) => {
      needScoreTeams.value = resp.data as number[]
      tempStudentScores.value = needScoreTeams.value.map((teamId) => ({
        fromTeamId: teamId,
        scorePro: 0,
        scoreCon: 0,
      }))
    },
  })
}

watch(
    () => props.data,
    (newVal) => {
      GameStatus.value = newVal
      useNeedScoreList()
    },
    { immediate: true }
)

onMounted(() => {
  useNeedScoreList()
})

function handleSubmit() {
  emits('submit', {
    teacherScorePro: tempTeacherScorePro.value,
    teacherScoreCon: tempTeacherScoreCon.value,
    studentScores: tempStudentScores.value,
  })
}
</script>
