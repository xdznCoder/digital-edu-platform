<template>
  <div>
    <div class="d-flex justify-space-between ma-4">
      <div class="d-flex">
        <v-text-field
          width="200"
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
      <v-btn
        v-if="ProposalStatus() === 2"
        variant="outlined"
        color="primary"
        @click="useSubmitProposal"
        >提交提案</v-btn
      >
      <v-btn
        v-if="ProposalStatus() === 3"
        variant="outlined"
        color="primary"
        @click="useSubmitVote"
        >提交投票</v-btn
      >
      <v-btn
        v-if="ProposalStatus() === 4"
        variant="outlined"
        color="primary"
        @click="emits('update')"
        >开始抢答赛</v-btn
      >
    </div>
    <v-card rounded min-height="650" class="ma-4">
      <v-data-table
        :items="proposalList ? GetTableData() : []"
        hide-default-footer
        no-data-text="请先提交游戏设置"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon
                color="medium-emphasis"
                icon="mdi-book-multiple"
                size="x-small"
                start
              ></v-icon>
              提案列表
            </v-toolbar-title>
          </v-toolbar>
        </template>

        <!--      eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.操作="{ index }">
          <v-icon
            v-if="ProposalStatus() === 2"
            color="medium-emphasis"
            icon="mdi-pencil"
            size="small"
            @click="handleEditProp(index)"
          >
          </v-icon>
          <v-btn
            v-if="ProposalStatus() === 3"
            class="px-2"
            prepend-icon="mdi-vote"
            @click="
              () => {
                showOverlay = true;
                proposalIndex = index;
              }
            "
            variant="text"
            >投票</v-btn
          >
        </template>
        <!--      eslint-disable-next-line vue/valid-v-slot-->
        <template v-slot:item.是否被选中="{ value }">
          <v-chip
            v-if="ProposalStatus() === 4"
            :color="value ? 'green' : 'red'"
            >{{ value ? "选中" : "落选" }}</v-chip
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <SubmitPropThree
      v-if="ProposalStatus() === 2"
      :team="proposalList[proposalIndex]"
      :list="teamList"
      @submit="handleSubmitPropThree"
      @close="showOverlay = false"
    />
    <SubmitVote
      v-if="ProposalStatus() === 3"
      class="pa-8"
      width="600"
      :list="teamList"
      :votes="voteMap.get(proposalIndex)"
      :proposer-id="proposalList[proposalIndex].id"
      @submit="handleVote"
      @close="showOverlay = false"
    />
  </v-overlay>
  <v-overlay v-model="isTile" class="align-center justify-center">
    <TileSelect
      v-if="isTile"
      :tile-options="tileOptions"
      @close="isTile = false"
      @submit="useSubmitTile"
    />
  </v-overlay>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { ApiMap } from "@/api/type";
import { useApi } from "@/api/handler";
import { game, proposal, team } from "@/api";
import SubmitPropThree from "@/components/proposal/vote/SubmitPropThree.vue";
import store from "@/store";
import SubmitVote from "@/components/proposal/vote/SubmitVote.vue";
import TileSelect from "../TileSelect.vue";

const props = defineProps<{
  data: ApiMap["/game/status/:id"]["resp"];
}>();
const emits = defineEmits(["update"]);
const GameStatus = ref<ApiMap["/game/status/:id"]["resp"] | null>(null);
const showOverlay = ref<boolean>(false);
const teamList = ref<ApiMap["/team/game/:id"]["resp"]["teams"]>([]);
const proposalNum = ref<number | null>(null);

const proposalList = ref<ApiMap["/proposal/upload/third"]["req"]["proposals"]>(
  []
);
const voteForm = ref<Array<{ data: string; teamId: number }>>([]);
const proposalIndex = ref<number>(0);
const voteMap = new Map<
  number,
  { teamId: number; proposalId: number; score: number }[]
>();
const removedList = ref<Array<number>>([]);

let isTile = ref(false);
const tileOptions = ref<{ label: string; value: number }[]>([]);

function handleEditProp(index: number) {
  proposalIndex.value = index;
  showOverlay.value = true;
}

function handleVote(
  input: { teamId: number; proposalId: number; score: number }[]
) {
  voteMap.set(proposalIndex.value, input);
  showOverlay.value = false;
}

function ProposalStatus(): number {
  if (!GameStatus.value) return 0;
  if (GameStatus.value.proposalStage < 3) return GameStatus.value.proposalStage;
  else if (GameStatus.value.proposalStage === 3) {
    if (
      proposalList.value &&
      proposalList.value.filter((item: any) => item.isSelected).length > 0
    )
      return 4;
    else return 3;
  } else return 5;
}

function GetTableData() {
  if (ProposalStatus() === 4)
    return proposalList.value
      ? proposalList.value.map((item: any) => ({
          提出提案: `第 ${item.proposerTeamId} 组`,
          参与小组: item.involvedTeamIds
            .map((i: number) => `第 ${i} 组`)
            .join("，"),
          总票数: `${item.voteCount} 票`,
          是否被选中: item.isSelected,
        }))
      : [];
  else
    return proposalList.value
      ? proposalList.value.map((item: any) => ({
          提出提案: `第 ${item.proposerTeamId} 组`,
          参与小组: item.involvedTeamIds
            .map((i: number) => `第 ${i} 组`)
            .join("，"),
          操作: true,
        }))
      : [];
}

function handleSubmitPropThree(payload: {
  id: number;
  ids: number[];
  score: number[];
}) {
  proposalList.value[proposalIndex.value] = {
    proposerTeamId: payload.id,
    involvedTeamIds: payload.ids,
  };
  showOverlay.value = false;
}

const useProposalList = () => {
  if (!GameStatus.value) return;
  if (GameStatus.value.proposalRound === 0) return;
  useApi({
    api: proposal.ProposalList(
      GameStatus.value.id,
      GameStatus.value.proposalRound
    ),
    onSuccess: (resp) => {
      proposalList.value = resp.data as ApiMap["/proposal/list"]["resp"];
      voteForm.value = proposalList.value.map((item) => ({
        data: "",
        teamId: item.proposerTeamId,
      }));
    },
  });
};

const useTeamList = () => {
  if (!GameStatus.value) return;
  useApi({
    api: team.TeamList(GameStatus.value.id),
    onSuccess: (resp) => {
      teamList.value = (
        resp.data as ApiMap["/team/game/:id"]["resp"]
      ).teams.filter((item: any) => !removedList.value.includes(item.teamId));
    },
  });
};

const useSubmitProposal = () => {
  if (!proposalNum.value) {
    store.dispatch("snackBarModule/showError", "请填写参与的小组个数");
    return;
  }
  useApi({
    api: proposal.ThirdProposal({
      gameId: GameStatus.value!.id,
      num: Number(proposalNum.value) ?? 0,
      proposals: proposalList.value,
    }),
    onSuccess: () => {
      emits("update");
    },
    tip: "上传成功",
  });
};

const getVotesList = (): ApiMap["/proposal/vote"]["req"]["votes"] => {
  let votesList: ApiMap["/proposal/vote"]["req"]["votes"] = [];
  voteMap.forEach((value) => {
    votesList.push(...value);
  });
  return votesList;
};
function getTeamIdByProposalId(proposalId: number) {
  const vote = proposalList.value.find((v) => v.id === proposalId);
  return vote ? vote.proposerTeamId : null;
}

const useSubmitVote = () => {
  const votesList = getVotesList();
  if (new Set(votesList.map((value) => value.teamId)).size < votesList.length) {
    store.dispatch("snackBarModule/showError", "存在重复投票");
    return;
  }

  const voteCountMap: Record<number, number> = {};
  votesList.forEach((vote) => {
    voteCountMap[vote.proposalId] =
      (voteCountMap[vote.proposalId] || 0) + vote.score;
    console.log(vote.teamId);
  });
  const maxVote = Math.max(...Object.values(voteCountMap));
  const topProposals = Object.entries(voteCountMap)
    .filter(([, count]) => count === maxVote)
    .map(([proposalId]) => Number(proposalId));
  if (topProposals.length > 1) {
    isTile.value = true;
    tileOptions.value = topProposals.map((id) => ({
      label: `${getTeamIdByProposalId(id)}组提案`,
      value: id,
    }));
  } else {
    useApi({
      api: proposal.SubmitVote({
        gameId: GameStatus.value!.id,
        round: GameStatus.value!.proposalRound,
        votes: votesList,
        hasTie: isTile.value,
      }),
      onSuccess: () => {
        useProposalList();
      },
      tip: "上传成功",
    });
  }
};
const useSubmitTile = (id: number) => {
  const votesList = getVotesList();
  useApi({
    api: proposal.SubmitVote({
      gameId: GameStatus.value!.id,
      round: GameStatus.value!.proposalRound,
      hasTie: isTile.value,
      votes: votesList,
      winnerProposalId: id,
    }),
    onSuccess: () => {
      emits("update");
    },
    tip: "上传成功",
  });
};

const useRemovedList = () => {
  if (!GameStatus.value) return;
  useApi({
    api: game.RemoveList(GameStatus.value.id),
    onSuccess: (resp) => {
      removedList.value = resp.data as Array<number>;
      useTeamList();
    },
  });
};

watch(
  () => props.data,
  () => {
    GameStatus.value = props.data ?? null;
    useRemovedList();
    useProposalList();
  },
  { immediate: true }
);
</script>
