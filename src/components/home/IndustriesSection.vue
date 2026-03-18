<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { industries } from '@/data/industries'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>

<template>
  <section class="section-padding">
    <div class="max-w-5xl mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="mb-10">
          <h2 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-3">
            Our work spans across 15+ domains and 8+ industries in transforming brands
            digitally.
          </h2>
          <p class="fade-up text-lg md:text-xl text-gray">
            Our expertise and experience across industries empower us to take up new
            challenges and build impactful products and solutions.
          </p>
        </div>

        <!-- Industry list -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <RouterLink
            v-for="industry in industries"
            :key="industry.title"
            :to="industry.link"
            class="fade-up group"
          >
            <h3 class="text-xl md:text-[22px] font-extrabold mb-2 relative inline-block">
              {{ industry.title }}
              <span class="absolute bottom-0 left-0 w-1/4 h-0.5 bg-black group-hover:w-full group-hover:bg-secondary transition-all duration-300" />
            </h3>
            <p class="text-base text-gray group-hover:text-primary transition-colors">
              {{ industry.description }}
            </p>
          </RouterLink>
        </div>

        <RouterLink to="/administration" class="hover-line text-sm fade-up">
          View All Industries
        </RouterLink>
      </div>
    </div>
  </section>
</template>
