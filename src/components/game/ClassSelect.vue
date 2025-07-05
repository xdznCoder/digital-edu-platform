<template>
  <v-select
      placeholder="请选择班级"
      max-width="300"
      density="compact"
      rounded
      :items="classList ? classList.list : []"
      item-title="classCode"
      item-value="id"
      variant="outlined"
      v-model="selectedClass"
      @update:model-value="emits('change', selectedClass)"
  ></v-select>
  <v-btn
      color="indigo-lighten-1"
      rounded
      prepend-icon="mdi-plus"
      class="ml-4"
      style="margin-top: 2px"
      @click="emits('submit', selectedClass)"
  >新增游戏</v-btn>
</template>

<script setup lang="ts">
import {onMounted, ref, defineEmits} from "vue";
import {ApiMap} from "@/api/type";
import {useApi} from "@/api/handler";
import {classes} from "@/api";

const classList = ref<ApiMap['/class/list']['resp'] | null>(null)
const selectedClass = ref<number | null>(null)

const emits = defineEmits(['change', 'submit'])

onMounted(() => {
  useClassList()
})

const useClassList = () => {
  useApi({
    api: classes.ClassList(0, 50, ''),
    onSuccess: resp => {
      classList.value = resp.data as ApiMap['/class/list']['resp']
    }
  })
}
</script>

<style scoped lang="scss">

</style>
