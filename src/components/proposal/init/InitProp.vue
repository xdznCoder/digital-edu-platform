<template>
  <div class="init-prop-view d-flex">
    <div class="init-prop-form" v-if="teamPoints">
      <div class="ma-10 text-lg-h5 text-indigo-lighten-2">
        初始化积分阶段
      </div>
      <div v-for="(value, index) of teamPoints" :key="index">
        <div class="d-flex mx-10 my-1">
          <div class="text-lg-h6" style="width: 150px">第 {{value.teamId}} 组</div>
          <v-number-input max-width="300"
                          density="compact"
                          variant="outlined"
                          :min="0"
                          v-model="value.initialScore"
                          control-variant="split"
          ></v-number-input>
        </div>
      </div>
      <v-btn class="ml-10 mt-5" color="primary" max-width="450" width="100%" @click="useProposalInit">提交</v-btn>
    </div>
    <div class="tile-rank">
      <InitDelete show-delete max-height="700" class="ma-4" :data="GameStatus" @update="emits('update')"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ApiMap} from "@/api/type";
import {ref, watch, defineProps, defineEmits} from "vue";
import {useApi} from "@/api/handler";
import {game, proposal} from "@/api";
import InitDelete from "@/components/proposal/init/InitDelete.vue";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const teamPoints = ref<Array<{teamId: number, initialScore: number, gameId: number}> | null>(null)
const removedList = ref<Array<number>>([])

function initTeamPoints() {
  if (!GameStatus.value) return
  teamPoints.value = Array.from({ length: GameStatus.value.teamCount }, (_, i) => i + 1)
      .map(item => ({
        teamId: item,
        initialScore: 0,
        gameId: GameStatus.value!.id
      })).filter(item => !removedList.value.includes(item.teamId))
}

const useProposalInit = () => {
  if (!teamPoints.value) return
  useApi({
    api: proposal.ProposalInit(teamPoints.value),
    onSuccess: () => {emits('update')},
    tip: '提案赛初始化成功'
  })
}

const useRemovedList = () => {
  if (!GameStatus.value) return
  useApi({
    api: game.RemoveList(GameStatus.value.id),
    onSuccess: resp => {
      removedList.value = resp.data as Array<number>
      initTeamPoints()
    }
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  initTeamPoints()
  useRemovedList()
}, {immediate: true})
</script>

<style scoped lang="scss">
.init-prop-form {
  overflow-y: auto;
  max-height: 700px;
  flex: 1;
  min-width: 500px;
}
.tile-rank {
  flex: 2;
  height: 700px;
}
</style>
