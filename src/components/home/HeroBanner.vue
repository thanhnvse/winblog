<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useTextRotation } from '@/composables/useTextRotation'
import VideoPlayer from '@/components/ui/VideoPlayer.vue'

const rotatingTexts = [
  'technologies',
  'economics',
  'experiences'
]
const { currentText, isVisible } = useTextRotation(rotatingTexts)

const sectionRef = ref<HTMLElement>()

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}

onMounted(() => {
  if (!sectionRef.value) return
  gsap.from(sectionRef.value.querySelectorAll('.hero-animate'), {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
  })
})
</script>

<template>
  <section ref="sectionRef" class="section-padding pb-0 pt-28 md:pt-32">
    <!-- Heading -->
    <div class="max-w-6xl mx-auto px-4 mb-10 md:mb-16">
      <h1
        class="hero-animate text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-10 max-w-5xl mx-auto md:pl-12"
      >
        Win's space for everyday discoveries — through the lens of
        <span
          class="text-secondary inline-block transition-opacity duration-400"
          :class="isVisible ? 'opacity-100' : 'opacity-0'"
          style="min-width: 280px"
        >
          {{ currentText }}
        </span>
      </h1>

      <!-- Stats -->
      <ul class="hero-animate flex flex-col md:flex-row gap-10 md:gap-20 mt-12 max-w-5xl mx-auto md:pl-12">
        <li>
          <span class="text-2xl md:text-3xl font-extrabold">Two Billion+</span>
          <p class="text-sm text-gray mt-1">Lives Touched</p>
        </li>
        <li>
          <span class="text-2xl md:text-3xl font-extrabold">50+</span>
          <p class="text-sm text-gray mt-1">Global Awards</p>
        </li>
        <li>
          <span class="text-2xl md:text-3xl font-extrabold">1000+</span>
          <p class="text-sm text-gray mt-1">Clients</p>
        </li>
      </ul>
    </div>

    <!-- Video -->
    <!-- <div class="hero-animate max-w-6xl mx-auto px-4">
      <VideoPlayer
        video-id="OP9ofBIrs0E"
        poster="https://lollypop.design/wp-content/uploads/2022/09/homepage-video-thumbnail.webp"
      />
    </div> -->

    <!-- Home page image -->
    <div class="hero-animate max-w-6xl mx-auto px-4">
      <img
        :src="getImageUrl('home-page.jpg')"
        alt="Home page"
        class="w-full rounded-2xl"
      />
    </div>
  </section>
</template>
