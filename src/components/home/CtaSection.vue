<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()
const email = ref('')
const isSubmitted = ref(false)
const isFocused = ref(false)

function handleSubmit() {
  if (!email.value.trim()) return
  isSubmitted.value = true
  setTimeout(() => {
    isSubmitted.value = false
    email.value = ''
  }, 3000)
}

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
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-primary rounded-2xl py-10 md:py-14 px-6 md:px-12 text-center text-white">
        <!-- Icon -->
        <div class="cta-animate mb-4">
          <svg class="w-10 h-10 mx-auto text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <!-- Heading -->
        <h2 class="cta-animate text-[24px] md:text-[32px] lg:text-[38px] font-extrabold leading-tight mb-3">
          Stay in the loop
        </h2>

        <!-- Subtext -->
        <p class="cta-animate text-sm md:text-base text-white/70 max-w-md mx-auto mb-6">
          Drop your email and receive new post alerts. No spam, just fresh content delivered to your inbox.
        </p>

        <!-- Email Form -->
        <form
          @submit.prevent="handleSubmit"
          class="cta-animate max-w-lg mx-auto"
        >
          <div
            class="flex items-center rounded-full transition-all duration-300"
            :class="isFocused ? 'bg-white shadow-lg shadow-white/10' : 'bg-white/10'"
          >
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              required
              @focus="isFocused = true"
              @blur="isFocused = false"
              class="flex-1 min-w-0 bg-transparent px-6 py-4 text-base outline-none placeholder:text-white/40"
              :class="isFocused ? 'text-primary placeholder:text-gray' : 'text-white'"
            />
            <button
              type="submit"
              :disabled="isSubmitted"
              class="shrink-0 mr-1.5 px-6 md:px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300"
              :class="isSubmitted
                ? 'bg-green-500 text-white'
                : 'bg-secondary text-white hover:bg-red-600 active:scale-95'"
            >
              <span v-if="isSubmitted" class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Subscribed
              </span>
              <span v-else>Subscribe</span>
            </button>
          </div>
        </form>

        <!-- Trust line -->
        <p class="cta-animate text-xs text-white/40 mt-4">
          Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  </section>
</template>
