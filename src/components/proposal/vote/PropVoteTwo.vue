<template>
  <div>
    <div class="d-flex justify-space-between ma-4">
      <div class="d-flex">
        <v-text-field width="200"
                      prepend-inner-icon="mdi-account"
                      height="20"
                      density="compact"
                      variant="outlined"
                      placeholder="请输入小组数"
                      rounded
                      hide-details
                      :min="0"
                      v-model="proposalNum"
        ></v-text-field>
      </div>
      <v-btn v-if="GameStatus && GameStatus.proposalStage === 2"
             variant="outlined"
             color="primary"
             @click="useSubmitProposal">提交提案</v-btn>
      <v-btn v-if="GameStatus && GameStatus.proposalStage === 3"
             variant="outlined"
             color="primary"
             @click="useSubmitVote">提交投票</v-btn>
      <v-btn v-if="GameStatus && GameStatus.proposalStage === 4"
             variant="outlined"
             color="primary"
             @click="showOverlay = true">为选中提案打分</v-btn>
    </div>
    <v-card rounded min-height="650" class="ma-4">
      <v-data-table
          :items="GetTableData()"
          hide-default-footer
          no-data-text="请先提交游戏设置"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              提案列表
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <!--      eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.操作="{ index }">
          <v-icon
              v-if="GameStatus && GameStatus.proposalStage === 2"
              color="medium-emphasis"
              icon="mdi-pencil"
              size="small"
              @click="handleEditProp(index)">
          </v-icon>
          <v-btn v-if="GameStatus && GameStatus.proposalStage === 3"
                 class="px-2"
                 prepend-icon="mdi-vote"
                 @click="()=> {showOverlay = true; proposalIndex = index}"
                 variant="text">投票</v-btn>
        </template>

        <!--      eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.是否被选中="{ value }">
          <v-chip v-if="GameStatus && GameStatus.proposalStage === 4"
                  :color="value ? 'green' : 'red'"
          >{{value ? '选中' : '落选'}}</v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <SubmitPropTwo v-if="GameStatus && GameStatus.proposalStage === 2"
                   :team="proposalList[proposalIndex]"
                   :list="teamList" @submit="handleSubmitPropTwo" @close="showOverlay = false"/>
    <SubmitVote v-if="GameStatus && GameStatus.proposalStage === 3" class="pa-8" width="600"
                :list="teamList" :votes="voteMap.get(proposalIndex)"
                :proposer-id="proposalList[proposalIndex].id"
                @submit="handleVote" @close="showOverlay = false"/>
    <DebateScore v-if="GameStatus && GameStatus.proposalStage === 4" :data="GameStatus"
                 @submit="useEvaluateDebate"
                 @close="showOverlay = false"/>
  </v-overlay>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch} from "vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {game, proposal, team} from "@/api";
import SubmitPropTwo from "@/components/proposal/vote/SubmitPropTwo.vue";
import DebateScore from "@/components/proposal/vote/DebateScore.vue";
import store from "@/store";
import SubmitVote from "@/components/proposal/vote/SubmitVote.vue";

const props = defineProps<{
  data: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const showOverlay = ref<boolean>(false)
const teamList = ref<ApiMap['/team/game/:id']['resp']['teams']>([])
const proposalNum = ref<number | null>(null)

const proposalList = ref<ApiMap['/proposal/upload/second']['req']['proposals']>([])
const voteForm = ref<Array<{ data: string, teamId: number }>>([])
const proposalIndex = ref<number>(0)
const voteMap = new Map<number, {teamId: number, proposalId: number, score: number}[]>()
const removedList = ref<Array<number>>([])

function handleEditProp(index: number) {
  proposalIndex.value = index
  showOverlay.value = true
}

function handleVote(input: {teamId: number, proposalId: number, score: number}[]) {
  voteMap.set(proposalIndex.value, input)
  showOverlay.value = false
}

function handleSubmitPropTwo(payload: {id: number, pro: number[], con: number[]}) {
  proposalList.value[proposalIndex.value] = {
    proposerTeamId: payload.id,
    proTeamIds: payload.pro,
    conTeamIds: payload.con,
  }
  showOverlay.value = false
}

function GetTableData () {
  if (GameStatus.value && GameStatus.value.proposalStage === 4)
    return proposalList.value ? proposalList.value.map((item: any) => (
        {
          '提出提案': `第 ${item.proposerTeamId} 组`,
          '正方小组': item.proTeamIds.map((i: number) => `第 ${i} 组`).join('，'),
          '反方小组': item.conTeamIds.map((i: number) => `第 ${i} 组`).join('，'),
          '是否被选中': item.isSelected
        })) : []
  else return proposalList.value ? proposalList.value.map((item: any) => (
      {
        '提出提案': `第 ${item.proposerTeamId} 组`,
        '正方小组': item.proTeamIds.map((i: number) => `第 ${i} 组`).join('，'),
        '反方小组': item.conTeamIds.map((i: number) => `第 ${i} 组`).join('，'),
        '操作': true
      })) : []
}

const useProposalList = () => {
  if (!GameStatus.value) return
  if (GameStatus.value.proposalRound === 0) return
  useApi({
    api: proposal.ProposalList(GameStatus.value.id, GameStatus.value.proposalRound),
    onSuccess: resp => {
      const tempList = resp.data as ApiMap['/proposal/list']['resp']
      proposalList.value = tempList.map(item => ({
        id: item.id,
        isSelected: item.isSelected,
        proposerTeamId: item.proposerTeamId,
        proTeamIds: item.involvedTeamIds.slice(0, Math.floor(item.involvedTeamIds.length / 2)),
        conTeamIds: item.involvedTeamIds.slice(Math.floor(item.involvedTeamIds.length / 2))
      }))
      voteForm.value = proposalList.value.map(item => ({
        data: '',
        teamId: item.proposerTeamId
      }))
    }
  })
}

const useTeamList = () => {
  if (!GameStatus.value) return
  useApi({
    api: team.TeamList(GameStatus.value.id),
    onSuccess: resp => {
      teamList.value = (resp.data as ApiMap['/team/game/:id']['resp']).teams
          .filter((item: any) => !removedList.value.includes(item.teamId))
    }
  })
}

const useSubmitProposal = () => {
  if (!proposalNum.value) {
    store.dispatch('snackBarModule/showError', '请填写参与的小组个数')
    return
  }
  useApi({
    api: proposal.SecondProposal({
      gameId: GameStatus.value!.id,
      num: Number(proposalNum.value) ?? 0,
      proposals: proposalList.value
    }),
    onSuccess: () => {emits('update')},
    tip: '上传成功'
  })
}

const useEvaluateDebate = (data: {
  teacherScorePro: number
  teacherScoreCon: number
  studentScores: {
    fromTeamId: number
    scorePro: number
    scoreCon: number
  }[]}) => {
  useApi({
        api: proposal.EvaluateDebate({...data, gameId: GameStatus.value!.id,
          proposalId: (proposalList.value as any)?.find((item: any) => item.isSelected).id}),
        onSuccess: () => {emits('update')},
        tip: '评分成功'
  },
  )
}

const useSubmitVote = () => {
  let votesList: ApiMap['/proposal/vote']['req']['votes'] = []
  voteMap.forEach(value => {
    votesList.push(...value)
  })
  if (new Set(votesList.map(value => value.teamId)).size < votesList.length) {
    store.dispatch('snackBarModule/showError', '存在重复投票')
    return
  }
  useApi({
    api: proposal.SubmitVote({
      gameId: GameStatus.value!.id,
      round: GameStatus.value!.proposalRound,
      votes: votesList}),
    onSuccess: () => {emits('update')},
    tip: '上传成功'
  })
}
const useRemovedList = () => {
  if (!GameStatus.value) return
  useApi({
    api: game.RemoveList(GameStatus.value.id),
    onSuccess: resp => {
      removedList.value = resp.data as Array<number>
      useTeamList()
    }
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  useRemovedList()
  useProposalList()
}, {immediate: true})
</script>
