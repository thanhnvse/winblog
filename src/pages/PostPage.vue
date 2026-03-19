<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { technologies } from '@/data/technologies'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>

<template>
  <div class="pt-20">
    <!-- Banner -->
    <section class="section-padding">
      <div class="max-w-5xl mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h1 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-3">
            Reimagining industries through design
          </h1>
          <p class="fade-up text-lg md:text-xl text-gray">
            From agriculture, e-commerce, edtech and enterprise solutions to fintech, healthcare,
            hospitality, IOT and HR solutions, we have designed it all.
          </p>
        </div>
      </div>
    </section>

    <!-- Technology List -->
    <section class="section-padding pt-0">
      <div class="max-w-5xl mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <ul class="space-y-10">
            <li
              v-for="(tech, index) in technologies"
              :key="tech.id"
              class="fade-up bg-white rounded-lg overflow-hidden"
            >
              <RouterLink
                :to="`/technologies/${tech.id}`"
                class="group block md:flex items-stretch"
                :class="index % 2 !== 0 ? 'md:flex-row-reverse' : ''"
              >
                <!-- Image -->
                <div class="md:w-5/12 overflow-hidden">
                  <div class="aspect-[4/3] bg-gray/10 overflow-hidden">
                    <img
                      v-if="tech.image"
                      :src="tech.image"
                      :alt="tech.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray text-sm">
                      {{ tech.title.split(' ').slice(0, 2).join(' ') }}
                    </div>
                  </div>
                </div>

                <!-- Text -->
                <div class="md:w-7/12 p-6 md:p-10 flex flex-col justify-center">
                  <h3 class="text-xl md:text-[26px] lg:text-[30px] font-extrabold mb-3 leading-tight">
                    {{ tech.title }}
                  </h3>
                  <p class="text-base text-gray mb-4">
                    {{ tech.description }}
                  </p>
                  <span class="hover-line text-sm">Read More</span>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="py-16 md:py-20 px-3" style="background: rgb(34, 20, 41);">
      <div class="max-w-5xl mx-auto px-4">
        <hr class="border-white" />
      </div>
    </div>
  </div>
</template>
