<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  videoId: string
  poster?: string
}>()

const isPlaying = ref(false)

function play() {
  isPlaying.value = true
}
</script>

<template>
  <div class="relative w-full aspect-video overflow-hidden bg-black rounded-lg">
    <!-- Poster / Click to play -->
    <div
      v-if="!isPlaying"
      class="absolute inset-0 cursor-pointer z-[2] group"
      :style="
        props.poster
          ? { backgroundImage: `url(${props.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : {}
      "
      @click="play"
    >
      <span
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform"
      >
        <svg class="w-8 h-8 text-secondary ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>

    <!-- YouTube iframe -->
    <iframe
      v-if="isPlaying"
      :src="`https://www.youtube-nocookie.com/embed/${props.videoId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1`"
      class="absolute inset-0 w-full h-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>
