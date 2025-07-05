<template>
  <div class="index-view-container">
    <div class="index-header">
      <HeaderBox />
    </div>
    <div class="d-flex my-4">
          <div class="index-sidebar">
            <SideBar />
          </div>
          <div class="index-main ml-2 mr-10 rounded-lg">
            <router-view />
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderBox from "@/components/index/HeaderBox.vue";
import SideBar from "@/components/index/SideBar.vue";
</script>

<style scoped lang="scss">
.index-view-container {
  min-width: 100vw;
  min-height: 100vh;
  background-color: #f4f4f4;
}
.index-main {
  min-height: 800px;
  width: 100%;
  min-width: 80vw;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.index-header {
  min-width: 1000px;
}
</style>
