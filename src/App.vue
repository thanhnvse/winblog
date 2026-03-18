<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/layout/ScrollToTop.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col m-5 p-8 bg-white rounded-2xl">
    <AppHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <AppFooter />
    <ScrollToTop />
  </div>
</template>
