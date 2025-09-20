<template>
  <div>
    <v-card class="pa-8" width="500">
      <div class="mb-6 text-h6">选择平票提案</div>
      <div class="mb-6">
        <v-select
          v-model="selectedProposal"
          :items="props.tileOptions"
          item-title="label"
          item-value="value"
          placeholder="请选择一个提案"
          density="comfortable"
          variant="outlined"
        />
      </div>
      <div class="d-flex justify-end">
        <v-btn class="mr-4" color="primary" @click="handleTile">确认</v-btn>
        <v-btn color="red-lighten-2" @click="emits('close')">取消</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  tileOptions: {
    value: number;
    label: string;
  }[];
}>();

const emits = defineEmits<{
  (e: "submit", value: number): void;
  (e: "close"): void;
}>();

const selectedProposal = ref<number | null>(null);

const handleTile = () => {
  if (!selectedProposal.value) return;
  emits("submit", selectedProposal.value);
  emits("close");
};
</script>
