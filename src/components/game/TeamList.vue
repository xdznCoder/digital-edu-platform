<template>
  <v-card class="w-100 my-4 mx-10 team-list-table">
    <div class="px-10 py-4 bg-indigo-lighten-2 text-lg-h6">分组情况</div>
    <v-data-table
        :items="teamList ? teamList.teams : []"
        :headers="headers"
        item-value="teamId"
        hide-default-footer
        show-expand
        no-data-text="请先提交游戏设置"
    >

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="bg-grey-lighten-4">
            <div class="my-3 mx-4">
              <div class="d-flex justify-center py-2 bg-blue-lighten-1">第{{item.teamId}}组</div>
              <v-data-table :items="item.members" hide-default-footer :headers="subheaders">
                <!-- eslint-disable-next-line vue/valid-v-slot -->
                <template v-slot:item.isLeader="{ value }">
                  <v-chip density="compact" :color="value ? 'green' : 'red'">{{value ? '是' : '否'}}</v-chip>
                </template>
              </v-data-table>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import {ref, defineExpose} from "vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {team} from "@/api";

const teamList = ref<ApiMap['/team/game/:id']['resp'] | null>(null)
const headers = [
  { title: '组号', key: 'teamId', align: 'center' },
  { title: '组长姓名', key: 'leaderName', align: 'center' },
  { title: '组长学号', key: 'leaderSno', align: 'center' },
  { title: '组长ID', key: 'leaderId', align: 'begin' },
  { title: '组员数量', key: 'totalMembers', align: 'begin'},
]

const subheaders = [
  { title: '学生ID', key: 'studentId', align: 'center' },
  { title: '学生姓名', key: 'studentName', align: 'center' },
  {title: '学号', key: 'studentSno', align: 'center' },
  {title: '是否组长', key: 'isLeader', align: 'begin' },
]

const useTeamList = (gameId: number) => {
  useApi({
    api: team.TeamList(gameId),
    onSuccess: resp => {
      teamList.value = resp.data as ApiMap['/team/game/:id']['resp']
    }
  })
}

defineExpose({useTeamList})
</script>

<style scoped lang="scss">
.team-list-table {
  min-height: 700px;
}
</style>
