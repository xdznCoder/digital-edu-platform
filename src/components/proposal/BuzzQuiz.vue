<template>
  <div class="knockout-container">
    <div class="py-6 px-8 d-flex justify-space-between">
      <div class="text-h5 text-indigo-lighten-2">第三轮提案 抢答赛</div>
      <div class="d-flex">
        <v-btn class="ml-4" rounded color="primary" variant="outlined" @click="useSubmitBuzz">结束抢答赛</v-btn>
      </div>
    </div>
    <v-card class="mx-4">
      <div class="py-4 d-flex text-h6 justify-center bg-indigo-lighten-2">当前抢答赛排名</div>
      <v-data-table :items="handleTeamList() ?? []"
                    height="550"
                    :headers="headers"
                    item-value="teamId"
                    hide-default-footer
                    no-data-text="请先传入学习通数据"
                    class="pa-4"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.rank ="{ index }">
          <v-chip
              v-if="index < 3"
              :color="rankColors[index]"
              text-color="white"
              density="compact"
              small
              label
              class="font-weight-bold"
          >
            第 {{ index + 1 }} 名
          </v-chip>
          <span class="ml-3" v-else>第 {{ index + 1 }} 名</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template v-slot:item.action ="{ index }">
          <v-btn variant="text" prepend-icon='mdi-pencil-plus'
                 @click="handleChange(index)">更改</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <DynamicForm :model="scoreMap.get(tempIndex)"
                 v-if="scoreMap.get(tempIndex)"
                 title="请输入积分变更数据"
                 :headers="['', '', '分数变更', '评论']"
                 :excluded-keys="[ 'gameId', 'teamId']"
                 @submit="useBuzzSetScore"
                 @close="showOverlay = false"
    />
  </v-overlay>
</template>

<script setup lang="ts">
import {ApiMap} from "@/api/type";
import {defineEmits, defineProps, reactive, ref, watch} from "vue";
import {useApi} from "@/api/handler";
import {proposal} from "@/api";
import DynamicForm from "@/components/DynamicForm.vue";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const teamList = ref<ApiMap['/proposal/rank/third']['resp'] | null>(null)
const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']
const headers = [
  { title: '排名', value: 'rank'},
  { title: '组号', value: 'teamId'},
  { title: '分数', value: 'score' },
  { title: '组长', value: 'leaderName' },
  { title: '操作', value: 'action', align: 'center' },
]
const showOverlay = ref<boolean>(false)
const tempIndex = ref<number>(0)
const scoreMap = reactive(new Map<number, ApiMap['/proposal/buzzed']['req']>())

function handleChange(index: number) {
  tempIndex.value = index
  console.log(index)
  if (!scoreMap.has(index)) scoreMap.set(index, {
    gameId: GameStatus.value!.id,
    teamId: teamList.value![index].teamId ,
    score: 0,
    comment: ""
  })
  console.log(scoreMap.get(index))
  showOverlay.value = true
}

function handleTeamList () {
  if (!teamList.value) return
  return teamList.value.map(item => ({
    rank: item.rank,
    teamId: `第 ${item.teamId} 组`,
    leaderName: item.leaderName,
    score: `${item.score} 分`,
    action: true
  }))
}

const useThirdRank = () => {
  if (!GameStatus.value) return
  useApi({
    api: proposal.ThirdRank(GameStatus.value.id),
    onSuccess: resp => {
      teamList.value = resp.data as ApiMap['/proposal/rank/third']['resp']
    }
  })
}

const useSubmitBuzz = () => {
  useApi({
    api: proposal.SubmitBuzz(GameStatus.value!.id),
    onSuccess: () => {
      emits('update')
    },
    tip: '上传成功'
  })
}

const useBuzzSetScore = (data: ApiMap['/proposal/buzzed']['req']) => {
  data.score = +data.score
  useApi({
    api: proposal.BuzzSetScore(data),
    onSuccess: () => {
      showOverlay.value = false
      useThirdRank()
    },
    tip: '更改成功'
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  useThirdRank()
}, {immediate: true})
</script>
