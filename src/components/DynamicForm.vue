<template>
  <v-card width="500" class="pa-4">
    <div class="mb-6 text-lg-h6">{{title ?? '请填写事件结果'}}</div>
    <div class="ma-4">
      <div
          v-for="(key, index) in fieldKeys"
          :key="key"
      >
        <div class="d-flex" v-if="!key.includes('Type') && !key.includes('tile')">
          <div class="mt-1" style="width: 150px">{{headers?.[index] || key}}</div>
          <v-text-field
              density="compact"
              variant="outlined"
              v-model="form[key]"
              :placeholder="'请输入' + (headers?.[index] || key)"
              :type="typeof form[key] === 'number' ? 'number' : 'text'"
              clearable
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-end mr-4">
      <v-btn color="primary" @click="emits('submit',{ ...form })">提交</v-btn>
      <v-btn color="red-lighten-2" class="ml-4" @click="emits('close')">取消</v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  model: Record<string, any>
  headers?: string[]
  title?: string
}>()

const emits = defineEmits<{
  (e: 'submit', value: Record<string, any>): void
  (e: 'close'): void
}>()

const form = reactive({ ...props.model })
const fieldKeys = computed(() => Object.keys(props.model))
</script>
