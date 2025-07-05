<template>
  <div class="classes-container mx-4 mr-8">
    <v-row dense>
      <v-col
          v-for="(value, index) in data"
          :key="index"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="px-2"
      >
        <v-card
            class="py-2"
            hover
            prepend-icon="mdi-equalizer-outline"
            :title="`${value.lastSavedAt} 保存`"
            :color="color ?? 'indigo-lighten-2'"
            @click="routers.push({path: '/detail', query: {id: value.id}})"
        >
          <v-card-item>
            <v-card-subtitle>
              进行情况：{{ value.status === 1 ? '进行中' : '已结束' }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            <div>
              小组总数：{{ value.teamCount }}
            </div>
            <div>
              学生总数：{{value.studentCount}}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script setup lang="ts">
import {defineProps} from 'vue'
import {useRouter} from "vue-router";
import {ApiMap} from "@/api/type";

const routers = useRouter()

defineProps<{
  data: ApiMap['/game/list/:cid']['resp']
  color?: string
}>()
</script>
