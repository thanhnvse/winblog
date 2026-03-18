<script setup lang="ts">
import { awards } from '@/data/awards'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}
</script>

<template>
  <section class="section-padding bg-primary text-white">
    <div class="max-w-5xl mx-auto px-4">
      <div class="max-w-3xl mx-auto mb-10">
        <h2 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-3">
          Our Achievements
        </h2>
        <p class="fade-up text-lg md:text-xl opacity-80">
          Our design solutions have not only won hearts and people, but also many awards and
          recognitions for exceptional digital experiences.
        </p>
      </div>

      <!-- Awards grid -->
      <div class="max-w-3xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="award in awards"
            :key="`${award.title}-${award.event}`"
            class="fade-up text-center"
          >
            <img
              :src="getImageUrl('award.svg')"
              :alt="award.title"
              class="w-16 h-16 mx-auto mb-2 invert"
              loading="lazy"
            />
            <h3 class="text-base md:text-lg font-extrabold mb-1">{{ award.title }}</h3>
            <p class="text-xs opacity-70">{{ award.event }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
