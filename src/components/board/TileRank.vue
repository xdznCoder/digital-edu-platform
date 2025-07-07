<template>
  <v-card rounded min-height="400px">
    <div class="text-lg-h6 px-4 py-2 bg-indigo-lighten-2">占领格子数排行榜</div>
    <div v-if="tileRank" class="ml-2" style="overflow-y: auto;">
      <v-table density="compact" class="rounded">
        <thead>
        <tr>
          <th>排名</th>
          <th>组号</th>
          <th>组长</th>
          <th>格子数</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in sortedData" :key="item.teamId">
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
          <td>{{ item.totalTile }}</td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {computed, defineProps, onMounted, ref, watch} from 'vue'
import {ApiMap} from "@/api/type";
import {game} from "@/api";
import {useApi} from "@/api/handler";

const props = defineProps<{
  data: ApiMap['/game/status/:id']['resp']
}>()

const tileRank = ref<ApiMap['/game/rank/team/:id']['resp']>([])

const sortedData = computed(() =>
      [...tileRank.value].sort((a, b) => {
        if (b.totalTile !== a.totalTile) return b.totalTile - a.totalTile
        return b.totalScore - a.totalScore
      })
)
const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']

watch(() => props.data, () => {
  useTileRank()
})

onMounted(() => {
  useTileRank()
})

const useTileRank = () => {
  if (!props.data) return
  useApi({
    api: game.TileRank(props.data.id),
    onSuccess: resp => {
      tileRank.value = resp.data as ApiMap['/game/rank/team/:id']['resp']
    }
  })
}
</script>

