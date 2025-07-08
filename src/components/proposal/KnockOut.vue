<template>
  <div>
    <FileUpload @upload="useFirstUpload" />
    <v-data-table :items="gradeList ?? []">
      <!--      eslint-disable-next-line vue/valid-v-slot-->
      <template v-slot:item.eliminated="{ value, index }">
        <v-icon
            v-if="!value.eliminated"
            color="medium-emphasis"
            icon="mdi-delete"
            size="small"
            @click="proposalList.splice(index, 1)">
        </v-icon>
        <v-btn v-if="value.eliminated">已淘汰</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import {ApiMap} from "@/api/type";
import {defineEmits, defineProps, ref, watch} from "vue";
import {useApi} from "@/api/handler";
import {proposal} from "@/api";
import FileUpload from "@/components/FileUpload.vue";

const props = defineProps<{
  data?: ApiMap['/game/status/:id']['resp']
}>()
const emits = defineEmits(['update'])
const GameStatus = ref<ApiMap['/game/status/:id']['resp'] | null>(null)
const gradeList = ref<ApiMap['/proposal/upload/first/xxt']['resp'] | null>(null)

const useFirstUpload = (file: File) => {
  useApi({
    api: proposal.FirstUploadGrade(GameStatus.value!.id, file),
    onSuccess: resp => {
      gradeList.value = resp.data as ApiMap['/proposal/upload/first/xxt']['resp']
      emits('update')
    },
    tip: '上传成功'
  })
}

watch(() => props.data, () => {
  GameStatus.value = props.data ?? null
}, {immediate: true})
</script>

<style scoped lang="scss">

</style>
