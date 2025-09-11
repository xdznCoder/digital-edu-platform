<template>
  <v-card
    class="d-flex justify-center py-4 align-center"
    max-width="400"
    prepend-icon="mdi-help"
    :text="text"
    :title="title"
  >
    <div style="width: 150px">
      <slot></slot>
    </div>
    <template v-slot:actions>
      <v-btn
        text="确认"
        color="primary"
        :loading="loading"
        @click="emits('confirm')"
      ></v-btn>
      <v-btn text="取消" color="error" @click="emits('cancel')"></v-btn>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
defineProps<{
  title: string;
  text: string;
  loading?: boolean;
}>();

const emits = defineEmits(["confirm", "cancel"]);
</script>

<style scoped lang="scss"></style>
