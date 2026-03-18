<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cultureImages } from '@/data/stories'
import { locations } from '@/data/navigation'

gsap.registerPlugin(ScrollTrigger)

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}

const sectionRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()

onMounted(() => {
  if (!sectionRef.value) return

  // Animate text on scroll
  gsap.from(sectionRef.value.querySelectorAll('.culture-animate'), {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
  })

  // Horizontal scroll animation for images
  if (sliderRef.value) {
    gsap.to(sliderRef.value, {
      scrollTrigger: {
        trigger: sliderRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
      x: -200,
      ease: 'none',
    })
  }
})
</script>

<template>
  <section ref="sectionRef" class="section-padding bg-primary text-white">
    <div class="max-w-6xl mx-auto px-4">
      <div class="max-w-3xl mb-10">
        <h2 class="culture-animate text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-4">
          Lollypop Design Studio is a leading UI UX design agency driven by innovation,
          impact, culture, and creativity!
        </h2>
        <p class="culture-animate text-lg md:text-xl opacity-80 mb-6">
          We are a team of 180+ creative rebels spread across the USA, India, the UAE, and
          Vietnam, making us a truly global design agency. Driven by a culture of innovation
          and technology, we deliver well-crafted, award-winning digital designs and products
          that have impacted over two billion lives globally.
        </p>

        <!-- Location links -->
        <div class="culture-animate flex flex-wrap gap-3 mb-6">
          <RouterLink
            v-for="loc in locations"
            :key="loc.country"
            :to="loc.to"
            class="px-4 py-2 border border-white/30 rounded-full text-base hover:bg-white/10 transition-colors"
          >
            {{ loc.country }}
          </RouterLink>
        </div>

        <RouterLink to="/about" class="culture-animate hover-line text-base">
          About Us
        </RouterLink>
      </div>
    </div>

    <!-- Horizontal image slider -->
    <div class="overflow-hidden mt-10">
      <div ref="sliderRef" class="flex gap-5 pl-4 md:pl-20" style="width: max-content">
        <div
          v-for="(img, i) in cultureImages"
          :key="i"
          class="flex-shrink-0 w-64 md:w-80"
        >
          <img
            :src="getImageUrl(img)"
            alt="Team culture"
            class="w-full h-48 md:h-56 object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>
