<template>
  <div class="classes-container mx-4 mt-6 mr-8">
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
            prepend-icon="mdi-school-outline"
            :title="value.classCode"
            color="indigo-lighten-2"
            @click="routers.push({path: '/detail', query: {id: value.id}})"
        >
          <v-card-item>
            <v-card-subtitle>
              班级人数：{{ value.currentStudents }}
            </v-card-subtitle>
          </v-card-item>
          <v-card-text>
            创建时间：{{ value.gmtCreate }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script setup lang="ts">
import {defineProps} from 'vue'
import {useRouter} from "vue-router";

const routers = useRouter()

defineProps<{
  data: Array<{
    id: number
    classCode: string
    courseId: number
    currentStudents: number
    status: number
    gmtCreate: string
    gmtModified: string
    tid: number
}>
}>()
</script>


<style scoped lang="scss">

</style>
