<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { socialLinks, locations } from '@/data/navigation'

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}
</script>

<template>
  <footer class="py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Social links -->
      <!-- <div class="mb-16 text-center">
        <h2 class="text-base font-semibold mb-6">Follow my work</h2>
        <div class="flex flex-wrap justify-center gap-6 md:gap-12">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xl md:text-3xl font-extrabold hover:text-secondary transition-colors"
          >
            {{ social.label }}
          </a>
        </div>
      </div> -->

      <!-- Bottom section -->
      <div class="flex flex-col md:flex-row gap-10">
        <!-- Logo & Info -->
        <div class="md:w-1/3 text-center md:text-left">
          <RouterLink to="/" class="inline-block mb-4">
            <img
              :src="getImageUrl('logo-win.gif')"
              alt="Logo"
              class="h-8 md:h-10 w-8 md:w-10 rounded-full object-cover"
            />
            <img
              :src="getImageUrl('logo-name.png')"
              alt="Logo"
              class="h-10 w-auto mx-auto md:mx-0"
            />
          </RouterLink>
          <p class="text-sm mb-4">
            A <span class="font-extrabold">Win's corner</span> collects everything about my life
          </p>
          <div class="text-xs text-gray space-y-1">
            <p>&copy; 2026 engineered by Win Nguyen</p>
            <div class="flex gap-3 justify-center md:justify-start">
              <RouterLink to="/faq" class="hover:text-secondary">FAQs</RouterLink>
              <RouterLink to="/privacy" class="hover:text-secondary">Privacy Policy</RouterLink>
              <RouterLink to="/terms" class="hover:text-secondary">Terms of Use</RouterLink>
            </div>
          </div>
        </div>

        <!-- Location links -->
        <!-- <div class="md:w-2/3">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div v-for="loc in locations" :key="loc.country">
              <RouterLink :to="loc.to" class="block group">
                <h3 class="text-base font-extrabold mb-1">{{ loc.country }}</h3>
                <p
                  v-for="city in loc.cities"
                  :key="city"
                  class="text-sm"
                >
                  {{ city }}
                </p>
              </RouterLink>
            </div>
          </div>
        </div> -->
        <div class="mb-16 mt-8 text-center">
          <h2 class="text-base font-semibold mb-6">Follow my work</h2>
          <div class="flex flex-wrap justify-center gap-6 md:gap-12">
            <a
              v-for="social in socialLinks"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xl md:text-3xl font-extrabold hover:text-secondary transition-colors"
            >
              {{ social.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
