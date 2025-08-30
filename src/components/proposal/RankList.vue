<template>
  <v-card rounded :max-height="maxHeight ?? 400" max-width="800" min-width="500">
    <div class="text-lg-h6 px-4 py-2 bg-indigo-lighten-2">
      提案赛阶段小组积分排行榜
    </div>

    <div class="ml-2" :style="`overflow-y: auto; height:${maxHeight - 50}px;`">
      <v-table density="compact" class="rounded">
        <thead>
          <tr>
            <th>排名</th>
            <th>组号</th>
            <th>姓名</th>
            <th>得分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in sortedList" :key="item.teamId" @click="handleRowClick(item, index)"
            style="cursor: pointer">
            <td>
              <v-chip v-if="index < 3" :color="rankColors[index]" text-color="white" density="compact" small label
                class="font-weight-bold">
                第 {{ index + 1 }} 名
              </v-chip>
              <span class="ml-3" v-else>第 {{ index + 1 }} 名</span>
            </td>
            <td>第 {{ item.teamId }} 组</td>
            <td>{{ item.name }}</td>
            <td>{{ item.score }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
  <v-overlay v-model="submitObject.showOverlay" class="align-center justify-center">
    <DynamicForm :model="submitObject.data" title="请输入小组积分变更" :headers="['', '', '', '', '小组分数变更', '评论']"
      :excluded-keys="['type', 'stage', 'id', 'gameId']" @submit="useSubmitScoreEditor"
      @close="submitObject.showOverlay = false" />
  </v-overlay>
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch, defineEmits, reactive } from 'vue'
import { ApiMap } from "@/api/type";
import { useApi } from "@/api/handler";
import { proposal } from "@/api";
import DynamicForm from '../DynamicForm.vue';
import { game } from '@/api';


const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
  maxHeight?: number
  enableEdit?: boolean
}>()

const enableEdit = computed(() => props.enableEdit ?? true)

const emits = defineEmits(['click'])

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const scoreList = ref<ApiMap['/proposal/rank/all']['resp']>([])

const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']

const sortedList = computed(() =>
  [...scoreList.value].sort((a, b) => b.score - a.score)
)

const submitObject = reactive({
  type: 1,
  showOverlay: false,
  data: {}
})

const useAllRank = () => {
  if (!GameStatus.value) return
  useApi({
    api: proposal.AllRank(GameStatus.value.id),
    onSuccess: resp => {
      scoreList.value = resp.data as ApiMap['/proposal/rank/all']['resp']
    }
  })
}

function handleRowClick(item: any, index: number) {
  emits('click', { item, index })
  if (!enableEdit.value) return;
  if (!GameStatus.value) return;
  submitObject.data = {
    type: submitObject.type,
    stage: 2,
    id: item.teamId,
    gameId: GameStatus.value.id,
    num: 0,
    comment: ""
  }
  submitObject.showOverlay = true
}

function useSubmitScoreEditor(data: ApiMap['/game/score/update']['req']) {
  console.log(data)
  useApi({
    api: game.SubmitScoreEditor(data),
    Finally: () => { submitObject.showOverlay = false },
    onSuccess: () => {
      submitObject.showOverlay = false
      useAllRank()
    },
    tip: '更改成功'
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  useAllRank()
}, { immediate: true })
</script>
