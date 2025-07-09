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
    </div>
    <v-card rounded min-height="650" class="ma-4">
      <v-data-table
          :items="proposalList ? proposalList.map((item: any) => (
            {
            '提出提案': `第 ${item.proposerTeamId} 组`,
            '参与游戏': item.involvedTeamIds.map((i: number) => `第 ${i} 组`).join('，'),
            '操作':true
            })) : []"
          hide-default-footer
          no-data-text="请先提交游戏设置"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
              提案列表
            </v-toolbar-title>
            <v-btn
                v-if="GameStatus && GameStatus.proposalStage === 2"
                class="me-2"
                prepend-icon="mdi-plus"
                rounded="lg"
                text="添加"
                border
                @click="showOverlay = true"
            ></v-btn>
          </v-toolbar>
        </template>

        <!--      eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.操作="{ index }">
          <v-icon
              v-if="GameStatus && GameStatus.proposalStage === 2"
              color="medium-emphasis"
              icon="mdi-delete"
              size="small"
              @click="proposalList.splice(index, 1)">
          </v-icon>
          <v-btn v-if="GameStatus && GameStatus.proposalStage === 3"
                 class="px-2"
                 prepend-icon="mdi-vote"
                 @click="()=> {showOverlay = true; proposalIndex = index}"
                 variant="text">投票</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <SubmitPropThree v-if="GameStatus && GameStatus.proposalStage === 2"
                   :list="teamList" @submit="handleSubmitPropThree" @close="showOverlay = false"/>
    <v-card v-if="GameStatus && GameStatus.proposalStage === 3" class="pa-8" width="600">
      <div class="text-lg-h6 mb-6">请填写投票结果</div>
      <div v-for="(value, index) of voteForm" :key="index">
        <div class="d-flex" v-if="index === proposalIndex">
          <div style="width: 200px" class="mt-1">投票结果</div>
          <v-text-field max-width="400"
                        class="mb-6"
                        placeholder="请填写投票结果"
                        hint="请按从小到大依次填入投票票数，用英文逗号隔开"
                        density="compact"
                        variant="outlined"
                        v-model="value.data"
          ></v-text-field>
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn class="mr-4" color="primary" @click="showOverlay = false">确认</v-btn>
      </div>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, ref, watch} from "vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {proposal, team} from "@/api";
import SubmitPropThree from "@/components/proposal/vote/SubmitPropThree.vue";
import store from "@/store";

const props = defineProps<{
  data: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const showOverlay = ref<boolean>(false)
const teamList = ref<ApiMap['/team/game/:id']['resp']['teams']>([])
const proposalNum = ref<number | null>(null)

const proposalList = ref<ApiMap['/proposal/upload/third']['req']['proposals']>([])
const voteForm = ref<Array<{ data: string, teamId: number }>>([])
const proposalIndex = ref<number>(0)

function handleSubmitPropThree(payload: {id: number, ids: number[], score: number[]}) {
  proposalList.value.push({
    proposerTeamId: payload.id,
    involvedTeamIds: payload.ids,
  })
  showOverlay.value = false
}

const useProposalList = () => {
  if (!GameStatus.value) return
  if (GameStatus.value.proposalRound === 0) return
  useApi({
    api: proposal.ProposalList(GameStatus.value.id, GameStatus.value.proposalRound),
    onSuccess: resp => {
      proposalList.value = resp.data as ApiMap['/proposal/list']['resp']
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
    }
  })
}

const useSubmitProposal = () => {
  if (!proposalNum.value) {
    store.dispatch('snackBarModule/showError', '请填写参与的小组个数')
    return
  }
  useApi({
    api: proposal.ThirdProposal({
      gameId: GameStatus.value!.id,
      num: Number(proposalNum.value) ?? 0,
      proposals: proposalList.value
    }),
    onSuccess: () => {emits('update') },
    tip: '上传成功'
  })
}

const useSubmitVote = () => {
  let votesList: ApiMap['/proposal/vote']['req']['votes'] = []
  voteForm.value.map(item => {
    item.data.split(',').forEach((v, i) => {
      votesList.push({
        teamId: i + 1,
        score: Number(v),
        proposalId: (proposalList.value as ApiMap['/proposal/list']['resp']).filter(i => i.proposerTeamId === item.teamId)[0].id
      })
    })
  })
  useApi({
    api: proposal.SubmitVote({
      gameId: GameStatus.value!.id,
      round: GameStatus.value!.proposalRound,
      votes: votesList}),
    onSuccess: () => {emits('update')},
    tip: '上传成功'
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
  useTeamList()
  useProposalList()
}, {immediate: true})
</script>
