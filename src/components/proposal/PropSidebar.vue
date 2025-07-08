<template>
  <v-card class="prop-sidebar white" style="min-width: 300px">
    <div v-if="GameStatus">
      <div class="text-h6 pa-4 d-flex align-center justify-center bg-indigo-lighten-2">
        提案赛阶段
      </div>
      <v-divider></v-divider>

      <div class="pa-4">
        <div class="ma-2">游戏 ID：
          <span class="font-weight-bold">
            {{ GameStatus.id }}</span>
        </div>

        <div class="ma-2">当前总学生数：
          <span class="font-weight-bold">
          {{ GameStatus.studentCount }}</span>
        </div>

        <div class="ma-2">当前组数：
          <span class="font-weight-bold">
          {{ GameStatus.teamCount }}</span>
        </div>

        <div class="ma-2">每组基准人数：
          <span class="font-weight-bold">
          {{ GameStatus.teamMemberCount }}</span>
        </div>
      </div>

      <v-divider class="my-2" />

      <div class="pa-4">
        <div class="ma-2">提案阶段：
          <v-chip color="orange" text-color="white" class="mb-1">
            {{ propStage[GameStatus.proposalStage] }}
          </v-chip>
        </div>

        <div class="ma-2">提案赛轮次：
          <v-chip color="red-lighten-1" text-color="white" class="mb-1">
            第 {{ GameStatus.proposalRound }} 组
          </v-chip>
        </div>

        <div class="ma-2" v-if="proposalTeam">本轮提案小组：
          <v-chip v-for="(v, i) of proposalTeam" density="compact" :key="i" class="ma-1">
            第 {{ v.proposerTeamId }} 组
          </v-chip>
        </div>
      </div>

      <v-divider class="my-2" />

      <div class="pa-4 text-caption text-grey">
        <div>上次保存时间：{{ GameStatus.lastSavedAt }}</div>
        <div>创建时间：{{ GameStatus.gmtCreate }}</div>
        <div>更新时间：{{ GameStatus.gmtUpdate }}</div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import {defineProps, ref, watch} from 'vue'
import {ApiMap} from '@/api/type'
import {useApi} from "@/api/handler";
import {proposal} from "@/api";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const propStage = ['初始化提案积分', '选择提案提出轮次', '每轮提出提案', '投票', '正式游戏']
const proposalTeam = ref<ApiMap['/proposal/list']['resp']>([])

const useProposalList = () => {
  if (!GameStatus.value) return
  if (GameStatus.value.proposalRound === 0) return
  useApi({
    api: proposal.ProposalList(GameStatus.value.id, GameStatus.value.proposalRound),
    onSuccess: resp => {
      proposalTeam.value = resp.data as ApiMap['/proposal/list']['resp']
    }
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  useProposalList()
}, {immediate: true})
</script>

<style scoped lang="scss">
.prop-sidebar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
  background-color: #fff;
}
</style>

