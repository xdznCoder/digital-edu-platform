<template>
  <v-card rounded :max-height="maxHeight ?? 400">
    <div class="text-lg-h6 px-4 py-2 bg-indigo-lighten-2">
      棋盘赛阶段 - 小组积分排行榜
    </div>

    <div class="ml-2" :style="`overflow-y: auto; height: ${maxHeight - 50}px`">
      <v-table density="compact" class="rounded">
        <thead>
        <tr>
          <th>排名</th>
          <th>组号</th>
          <th>姓名</th>
          <th>得分</th>
          <th v-if="showDelete">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in scoreList"
            :key="item.teamId"
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
          <td>{{ item.leaderName }}</td>
          <td>{{ item.totalScore }}</td>
          <td v-if="showDelete">
            <v-btn variant="text" prepend-icon="mdi-delete"
                   class="pa-0" color="red-lighten-1"
                   v-if="item.status === 1" @click="useRemoveTeam(item.teamId, true)">淘汰</v-btn>
            <v-btn variant="text" prepend-icon="mdi-reload"
                   class="pa-0" color="green-lighten-1"
                   v-if="item.status === 2" @click="useRemoveTeam(item.teamId, false)">恢复</v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {defineProps, ref, watch, defineEmits} from 'vue'
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {game} from "@/api";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
  maxHeight?: number
  showDelete?: boolean
}>()

const emits = defineEmits(['update'])

const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const scoreList = ref<ApiMap['/game/rank/team/:id']['resp']>([])

const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']

const useAllRank = () => {
  if (!GameStatus.value) return
  useApi({
    api: game.TileRank(GameStatus.value.id),
    onSuccess: resp => {
      scoreList.value = resp.data as ApiMap['/game/rank/team/:id']['resp']
    }
  })
}

const useRemoveTeam = (teamId: number, b: boolean) => {
  if (!GameStatus.value) return
  useApi({
    api: game.RemoveTeam({gameId: GameStatus.value.id, teamIds: [teamId], type: b ? 2 : 1}),
    onSuccess: () => {
      useAllRank()
      emits('update')
    }
  })
}

watch(() => props.data, newVal => {
  GameStatus.value = newVal ?? null
  useAllRank()
}, {immediate: true})
</script>
