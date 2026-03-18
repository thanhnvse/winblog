<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { menuLinks, menuSecondaryLinks, industryLinks, socialLinks, locations } from '@/data/navigation'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Transition name="menu">
    <div
      v-if="isOpen"
      class="fixed inset-0 top-16 md:top-20 z-40 overflow-y-auto"
    >
      <!-- Red panel -->
      <div class="min-h-full flex flex-col md:flex-row">
        <div class="bg-secondary text-white flex-1 px-6 md:px-12 py-10 md:py-16">
          <div class="max-w-lg mx-auto md:mx-0">
            <!-- Main links -->
            <nav class="mb-10">
              <RouterLink
                v-for="link in menuLinks"
                :key="link.to"
                :to="link.to"
                class="block text-3xl md:text-5xl font-extrabold capitalize mb-3 hover:opacity-80 transition-opacity"
                @click="emit('close')"
              >
                {{ link.label }}
              </RouterLink>
            </nav>

            <!-- Secondary links -->
            <div class="flex flex-wrap gap-x-12 gap-y-1 mb-10">
              <div>
                <RouterLink
                  v-for="link in menuSecondaryLinks"
                  :key="link.to"
                  :to="link.to"
                  class="block text-lg capitalize mb-1 hover:opacity-80 transition-opacity"
                  @click="emit('close')"
                >
                  {{ link.label }}
                </RouterLink>
              </div>
              <div class="hidden md:block">
                <RouterLink
                  v-for="link in industryLinks"
                  :key="link.to"
                  :to="link.to"
                  class="block text-lg capitalize mb-1 hover:opacity-80 transition-opacity"
                  @click="emit('close')"
                >
                  {{ link.label }}
                </RouterLink>
              </div>
            </div>

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

        <!-- Dark panel -->
        <div class="bg-primary text-white flex-1 px-6 md:px-12 py-10 md:py-16 flex flex-col justify-center">
          <div class="max-w-lg mx-auto md:mx-0">
            <p class="text-lg mb-3">Got An Idea?</p>
            <h3 class="text-3xl md:text-4xl font-extrabold mb-6">
              Let's craft<br />brilliance together!
            </h3>
            <RouterLink
              to="/contact"
              class="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-full hover:bg-red-600 transition-colors"
              @click="emit('close')"
            >
              Get in touch
            </RouterLink>

            <!-- Location links -->
            <div class="flex gap-6 mt-auto pt-10">
              <RouterLink
                v-for="loc in locations"
                :key="loc.country"
                :to="loc.to"
                class="text-lg hover:opacity-80 transition-opacity"
                @click="emit('close')"
              >
                {{ loc.country }}
              </RouterLink>
            </div>
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
