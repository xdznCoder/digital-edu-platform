<template>
  <router-view/>
  <v-snackbar :color="snackBar.color" v-model="snackBar.show" :text="snackBar.message" location="top" :timeout="2000"></v-snackbar>
</template>

<script setup lang="ts">
import {computed} from "vue";
import store from "@/store";

const snackBar = computed(() => store.getters['snackBarModule/snackBar']);
</script>
