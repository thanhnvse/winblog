<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { mainNav, socialLinks } from '@/data/navigation'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

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
</script>

<template>
  <Transition name="menu">
    <div
      v-if="isOpen"
      class="fixed inset-0 top-30 md:top-34 z-40 overflow-y-auto"
    >
      <div class="min-h-full flex flex-col md:flex-row">
        <!-- Left panel: Navigation -->
        <div class="bg-secondary text-white flex-1 px-6 md:px-12 py-10 md:py-16">
          <div class="max-w-lg mx-auto md:mx-0">
            <!-- Main nav links -->
            <nav class="mb-10">
              <RouterLink
                to="/"
                class="block text-3xl md:text-5xl font-extrabold capitalize mb-3 hover:opacity-80 transition-opacity"
                @click="emit('close')"
              >
                Home
              </RouterLink>
              <RouterLink
                v-for="link in mainNav"
                :key="link.to"
                :to="link.to"
                class="block text-3xl md:text-5xl font-extrabold capitalize mb-3 hover:opacity-80 transition-opacity"
                :class="link.highlight ? 'text-primary' : ''"
                @click="emit('close')"
              >
                {{ link.label }}
              </RouterLink>
            </nav>

            <!-- Social links -->
            <div class="flex flex-wrap gap-4">
              <a
                v-for="social in socialLinks"
                :key="social.label"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-lg hover:opacity-80 transition-opacity"
              >
                {{ social.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Right panel: CTA (same as HomePage) -->
        <div class="bg-primary text-white flex-1 px-6 md:px-12 py-10 md:py-16 flex flex-col justify-center">
          <div class="max-w-lg mx-auto md:mx-0">
            <!-- Icon -->
            <div class="mb-4">
              <svg class="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>

            <!-- Heading -->
            <h3 class="text-3xl md:text-4xl font-extrabold mb-3">
              Stay in the loop
            </h3>

            <!-- Subtext -->
            <p class="text-sm md:text-base text-white/70 mb-6">
              Drop your email and receive new post alerts. No spam, just fresh content delivered to your inbox.
            </p>

            <!-- Email Form -->
            <form @submit.prevent="handleSubmit" class="mb-4">
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

            <p class="text-xs text-white/40">
              Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: transform 0.4s ease, opacity 0.3s ease;
}
.menu-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.menu-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
