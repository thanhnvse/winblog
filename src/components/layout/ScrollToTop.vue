<script setup lang="ts">
import { useScrollProgress } from '@/composables/useScrollProgress'

const { isScrolled } = useScrollProgress()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}
</script>

<template>
  <Transition name="fade">
    <button
      v-if="isScrolled"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <img :src="getImageUrl('pg-scroll.svg')" alt="" class="w-8 h-8" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
