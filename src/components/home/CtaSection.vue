<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()

onMounted(() => {
  if (!sectionRef.value) return
  gsap.from(sectionRef.value.querySelectorAll('.cta-animate'), {
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
  })
})
</script>

<template>
  <section ref="sectionRef" class="section-padding">
    <div class="max-w-5xl mx-auto px-4">
      <div class="bg-primary rounded-2xl py-16 md:py-20 px-6 text-center text-white">
        <span class="cta-animate block text-xl md:text-2xl mb-4">Got An Idea?</span>
        <h2 class="cta-animate text-[32px] md:text-[45px] lg:text-[50px] font-extrabold mb-8">
          Let's craft brilliance together!
        </h2>
        <RouterLink
          to="/contact"
          class="cta-animate inline-block px-10 py-4 bg-secondary text-white font-bold rounded-full text-lg hover:bg-red-600 transition-colors"
        >
          Get a Free Audit
        </RouterLink>
      </div>
    </div>
  </section>
</template>
