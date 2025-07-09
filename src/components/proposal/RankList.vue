<template>
  <v-card rounded :max-height="maxHeight ?? 400">
    <div class="text-lg-h6 px-4 py-2 bg-indigo-lighten-2">
      提案赛阶段小组积分排行榜
    </div>

    <div class="ml-2" :style="`overflow-y: auto; height: ${maxHeight - 50}px`">
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
        <tr
            v-for="(item, index) in sortedList"
            :key="item.teamId"
            @click="emits('click',{item, index})"
            style="cursor: pointer"
        >
          <td>
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
          </td>
          <td>第 {{ item.teamId }} 组</td>
          <td>{{ item.name }}</td>
          <td>{{ item.score }}</td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, watch, defineEmits} from 'vue'
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {proposal} from "@/api";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
  maxHeight?: number
}>()

const emits = defineEmits(['click'])

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const scoreList = ref<ApiMap['/proposal/rank/all']['resp']>([])

const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']

const sortedList = computed(() =>
    [...scoreList.value].sort((a, b) => b.score - a.score)
)

const useAllRank = () => {
  if (!GameStatus.value) return
  useApi({
    api: proposal.AllRank(GameStatus.value.id),
    onSuccess: resp => {
      scoreList.value = resp.data as ApiMap['/proposal/rank/all']['resp']
    }
  })
}

watch(() => props.data, newVal => {
  GameStatus.value = newVal ?? null
  useAllRank()
}, {immediate: true})
</script>


