<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { register } from 'swiper/element/bundle'

register()

defineProps<{
  slidesPerView?: number | 'auto'
  spaceBetween?: number
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween?: number }>
  loop?: boolean
  navigation?: boolean
}>()

const swiperEl = ref<HTMLElement | null>(null)

function prev() {
  ;(swiperEl.value as any)?.swiper?.slidePrev()
}

function next() {
  ;(swiperEl.value as any)?.swiper?.slideNext()
}

defineExpose({ prev, next })

onMounted(() => {
  // Swiper element is auto-initialized by register()
})

onUnmounted(() => {
  // cleanup if needed
})
</script>

<template>
  <div class="relative group">
    <swiper-container
      ref="swiperEl"
      :slides-per-view="slidesPerView ?? 1"
      :space-between="spaceBetween ?? 20"
      :loop="loop ?? false"
      :breakpoints="breakpoints ? JSON.stringify(breakpoints) : undefined"
      grab-cursor="true"
    >
      <slot />
    </swiper-container>

    <template v-if="navigation">
      <button
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        @click="prev"
        aria-label="Previous slide"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        @click="next"
        aria-label="Next slide"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </template>
  </div>
</template>
