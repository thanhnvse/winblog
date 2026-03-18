<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { services } from '@/data/services'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>

<template>
  <section class="section-padding">
    <!-- Intro -->
    <div class="max-w-5xl mx-auto px-4 mb-12 md:mb-16">
      <h2 class="fade-up text-3xl md:text-5xl lg:text-[50px] font-bold leading-tight mb-4 max-w-3xl mx-auto">
        My curiosity about life has pushed me to continuously learn and explore a wide range of fields!
      </h2>
      <p class="fade-up text-lg md:text-xl text-gray mt-6 max-w-3xl mx-auto">
        As someone with a relatively weak short-term memory, I constantly look for ways to revisit and reinforce what I've learned — turning it into something more lasting when I need it.
        One of the most effective approaches I've found is a combination of chunking, spaced repetition, visual association, and focused note-taking.
        This blog exists as a second version of myself — a 'second Win' — helping the first one recall ideas, knowledge, and experiences that might otherwise fade too quickly.
      </p>
    </div>

    <!-- Services list -->
    <div class="max-w-5xl mx-auto px-4">
      <div
        v-for="service in services"
        :key="service.title"
        class="fade-up border-t border-gray-300/50 py-8 md:py-12"
      >
        <div class="md:flex gap-8">
          <div class="md:w-1/3 mb-4 md:mb-0">
            <h3 class="text-2xl md:text-[28px] font-extrabold md:text-right md:pr-8">
              {{ service.title }}
            </h3>
          </div>
          <div class="md:w-2/3">
            <div class="md:flex gap-6 justify-between">
              <div class="md:w-1/2 mb-4 md:mb-0">
                <p class="text-base mb-4">{{ service.description }}</p>
                <RouterLink
                  :to="service.link"
                  class="hover-line text-sm hidden md:inline-block"
                >
                  Learn More
                </RouterLink>
              </div>
              <div class="md:w-1/2">
                <ul class="space-y-2">
                  <li
                    v-for="item in service.items"
                    :key="item"
                    class="text-base before:content-['•'] before:mr-2 before:text-secondary"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
