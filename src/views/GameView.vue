<template>
  <div class="game-view-container">
    <div class="game-view-header">
      <v-tabs
          v-model="tab"
          class="ml-10"
          height="60px"
      >
        <v-tab value="one" class="tabs-title">游戏管理</v-tab>
        <v-tab value="two" class="tabs-title">游戏设置</v-tab>
      </v-tabs>
    </div>
    <v-divider />
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <div class="operate-buttons d-flex mx-8 mt-4">
          <ClassSelect @change="handleChange" @submit="handleSelected"/>
        </div>
        <div class="mx-4">
          <v-empty-state
              class="mt-12"
              v-if="!gameList || gameList.length === 0"
              icon="$error"
              title="该课程无游戏记录"
              text="若未选择课程请先点击左上角选择框选择课程，若已选择课程则该课程并无任何游戏保存记录"
          />
          <GameCards color="green-darken-1" v-if="gameList && gameList.length > 0" :data="gameList" />
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item value="two">
        <div class="d-flex">
          <NewGame :cid="classSelected" @update-team-list="handleUpdateTeamList"/>
          <TeamList ref="TeamListRef"/>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>

  </div>
</template>

<script setup lang="ts">
import ClassSelect from "@/components/game/ClassSelect.vue";
import {ref} from "vue";
import NewGame from "@/components/game/NewGame.vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {game} from "@/api";
import GameCards from "@/components/game/GameCards.vue";
import TeamList from "@/components/game/TeamList.vue";

const tab = ref<string>('one')
const classSelected = ref<number | null>(null)
const gameList = ref<ApiMap['/game/list/:cid']['resp'] | null>(null)
const TeamListRef = ref<InstanceType<typeof TeamList> | null>(null)

function handleSelected (id: number) {
  classSelected.value = id
  tab.value = "two"
}

function handleChange (id: number) {
  classSelected.value = id
  useGameList()
}

function handleUpdateTeamList (gameId: number) {
  TeamListRef.value.useTeamList(gameId)
}

const useGameList = () => {
  if (!classSelected.value) return
  useApi({
    api: game.GameList(classSelected.value),
    onSuccess: resp => {gameList.value = resp.data as ApiMap['/game/list/:cid']['resp']}
  })
}
</script>

<style scoped lang="scss">
</style>
