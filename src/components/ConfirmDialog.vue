<template>
    <v-card
        max-width="400"
        prepend-icon="mdi-help"
        :text="text"
        :title="title"
    >
      <template v-slot:actions>
        <v-btn
            text="确认"
            color="primary"
            @click="emits('confirm')"
        ></v-btn>
        <v-btn
            text="取消"
            color="error"
            @click="emits('cancel')"
        ></v-btn>
      </template>
    </v-card>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
defineProps<{
  title: string
  text: string
}>()

const emits = defineEmits(['confirm', 'cancel'])
</script>

<style scoped lang="scss">

</style>
