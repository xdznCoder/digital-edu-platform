<template>
  <v-card rounded :max-height="maxHeight ?? 400">
    <div class="text-lg-h6 px-4 py-2 bg-indigo-lighten-2 d-flex justify-space-between align-center">
      <span>{{ computedMode ? '占领格子数排行榜' : '个人积分排行榜' }}</span>
      <v-btn
          size="small"
          @click="internalMode = !internalMode"
          class="text-caption"
          color="white"
          variant="tonal"
          v-if="!isLocked && showChange"
      >
        切换
      </v-btn>
    </div>

    <!-- 团队排行榜 -->
    <div v-if="computedMode && tileRank" class="ml-2" :style="`overflow-y: auto; height: ${maxHeight - 50}px`">
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
        <tr
            v-for="(item, index) in sortedTeamData"
            :key="item.teamId"
            @click="emits('click', { mode: 'team', item, index })"
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
          <td>{{ item.leaderName }}</td>
          <td>{{ item.totalTile }}</td>
        </tr>
        </tbody>
      </v-table>
    </div>

    <!-- 学生排行榜 -->
    <div v-if="!computedMode && individualRank" class="ml-2" :style="`overflow-y: auto; height: ${maxHeight - 50}px`">
      <v-table density="compact" class="rounded">
        <thead>
        <tr>
          <th>排名</th>
          <th>姓名</th>
          <th>学号</th>
          <th>组号</th>
          <th>得分</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in sortedIndividualData"
            :key="item.studentId"
            @click="emits('click', { mode: 'student', item, index })"
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
          <td>{{ item.studentName }}</td>
          <td>{{ item.memberSno }}</td>
          <td>第 {{ item.teamId }} 组</td>
          <td>{{ item.individualScore }}</td>
        </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {ref, computed, defineProps, defineEmits, onMounted, watch} from 'vue'
import {ApiMap} from '@/api/type'
import {game} from '@/api'
import {useApi} from '@/api/handler'

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
  maxHeight?: number
  showChange?: boolean
  mode?: 'team' | 'student'
}>()

const emits = defineEmits<{
  (e: 'click', payload: { mode: 'team' | 'student', item: any, index: number }): void
}>()

const internalMode = ref(true) // 默认展示 team
const isLocked = computed(() => props.mode !== undefined)
const computedMode = computed(() =>
    props.mode === 'team' ? true :
        props.mode === 'student' ? false :
            internalMode.value
)

const tileRank = ref<ApiMap['/game/rank/team/:id']['resp']>([])
const individualRank = ref<ApiMap['/game/rank/student/:id']['resp']>([])

const rankColors = ['amber darken-2', 'blue-grey lighten-1', 'deep-orange lighten-1']

const sortedTeamData = computed(() =>
    [...tileRank.value].sort((a, b) =>
        b.totalTile !== a.totalTile ? b.totalTile - a.totalTile : b.totalScore - a.totalScore
    )
)

const sortedIndividualData = computed(() =>
    [...individualRank.value].sort((a, b) => b.individualScore - a.individualScore)
)

watch(() => props.data, () => loadRankData())
watch(computedMode, () => loadRankData())

onMounted(() => loadRankData())

function loadRankData() {
  if (!props.data) return
  if (computedMode.value) {
    useApi({
      api: game.TileRank(props.data.id),
      onSuccess: resp => {
        tileRank.value = resp.data as ApiMap['/game/rank/team/:id']['resp']
      }
    })
  } else {
    useApi({
      api: game.IndividualRank(props.data.id),
      onSuccess: resp => {
        individualRank.value = resp.data as ApiMap['/game/rank/student/:id']['resp']
      }
    })
  }
}
</script>

