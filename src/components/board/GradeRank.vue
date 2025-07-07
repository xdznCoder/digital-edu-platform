<template>
  <v-card rounded class="mt-3" height="400px">
    <div class="pa-4 bg-blue-lighten-1 text-lg-h6">本回合答题排行榜</div>
    <div class="d-flex justify-center align-center" style="height: 350px" v-if="GameStatus.chessPhase === 0 || !gradeRank">
      <FileUpload text="上传答题数据" @upload="useUploadGrade"/>
    </div>
    <div class="pa-4" ref="chartRef" style="width: 100%; height: 350px;"></div>
  </v-card>
</template>

<script setup lang="ts">
import {defineEmits, defineProps, onMounted, ref, watch} from 'vue'
import FileUpload from "@/components/FileUpload.vue";
import {useApi} from "@/api/handler";
import {game} from "@/api";
import * as echarts from 'echarts';
import {ApiMap} from "@/api/type";

const chartRef = ref<HTMLDivElement | null>(null)
const props = defineProps<{
  gameId: number
  data: ApiMap['/game/status/:id']['resp']
}>()

const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp']>(props.data)
const gradeRank = ref<ApiMap['/game/upload/chess']['resp'] | null>(null)

const useUploadGrade = (file: File) => {
  useApi({
    api: game.UploadGrade(props.gameId, file),
    onSuccess: async resp => {
      gradeRank.value = resp.data as ApiMap['/game/upload/chess']['resp']
      emits('update')
      renderChart()
    },
    tip: '成绩上传成功'
  })
}

const useGradeRank = () => {
  if (GameStatus.value.chessPhase === 0) return
  useApi({
    api: game.GradeRank(props.gameId),
    onSuccess: resp => {
      gradeRank.value = resp.data as ApiMap['/game/xxt/rank/:id']['resp']
      renderChart()
    }
  })
}

watch(() => props.data, newVal => {
  GameStatus.value = newVal
})

onMounted(() => {
  useGradeRank()
})

const renderChart = () => {
    if (!chartRef.value || !gradeRank.value) {
      return
    }
  const chart = echarts.init(chartRef.value);

  gradeRank.value.reverse()

  chart.setOption({
    grid: {
      top: 10,
      left: 10,
      bottom: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (!gradeRank.value) return ''
        const data = gradeRank.value[params.dataIndex]
        return `
        <strong>${data.teamName}</strong><br/>
        得分：${data.thisRoundScore}<br/>
        提交时间：${data.submitTime}`
      }
    },
     xAxis: {
       type: 'value',
     },
     yAxis: {
       type: 'category',
       data: gradeRank.value.map(item => `第 ${item.teamId} 组`)
     },
     series: [{
       name: '得分',
       type: 'bar',
       data: gradeRank.value.map(item => item.thisRoundScore),
       label: {
         show: true,
         position: 'right'
       }
     }]
   })
}
</script>

<style scoped lang="scss">

</style>
