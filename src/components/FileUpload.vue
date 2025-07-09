<template>
  <div class="file-upload d-flex">
    <input
        ref="fileInput"
        type="file"
        class="hidden-input"
        @change="handleFileChange"
        accept=".xlsx"
    />

    <v-btn color="primary" variant="outlined" rounded @click="triggerFileInput">
      <v-icon start icon="mdi-upload" />
      {{ text ?? '上传学生数据' }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, defineProps} from "vue";

defineProps<{
  text?: string
}>()

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const emits = defineEmits(['upload'])

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    file.value = selectedFile
    emits('upload', selectedFile)
  }
  target.value = ''
}
</script>

<style scoped lang="scss">
.hidden-input {
  display: none;
}
</style>
