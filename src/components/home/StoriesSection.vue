<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { stories } from '@/data/stories'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}
</script>

<template>
  <section class="section-padding">
    <div class="max-w-5xl mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="mb-10">
          <h2 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-3">
            Our Stories
          </h2>
          <p class="fade-up text-lg md:text-xl text-gray">
            Discover the heart of what we do—our culture, research methods, design thinking,
            and product development.
          </p>
        </div>

        <!-- Stories -->
        <div class="space-y-8">
          <div
            v-for="story in stories"
            :key="story.title"
            class="fade-up"
          >
            <RouterLink :to="story.link" class="group block">
              <div class="md:flex gap-6 border-t border-gray-200 pt-8">
                <div class="md:w-2/5 mb-4 md:mb-0">
                  <img
                    :src="getImageUrl(story.image)"
                    :alt="story.title"
                    class="w-full h-48 md:h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div class="md:w-3/5 flex flex-col justify-center">
                  <span class="text-xs font-extrabold uppercase tracking-wider mb-2">
                    {{ story.type }}
                  </span>
                  <h3 class="text-xl md:text-2xl font-extrabold mb-2 group-hover:text-secondary transition-colors">
                    {{ story.title }}
                  </h3>
                  <p v-if="story.description" class="text-sm text-gray mb-2">
                    {{ story.description }}
                  </p>
                  <span class="text-xs text-gray">
                    <template v-if="story.author">By {{ story.author }} on </template>
                    Posted on {{ story.date }}
                  </span>
                </div>
              </div>
            </RouterLink>

            <!-- View all link -->
            <RouterLink
              :to="story.type === 'white paper' ? '/whitepapers' : '/blogs'"
              class="hover-line text-sm mt-4 inline-block"
            >
              View all {{ story.type === 'white paper' ? 'Whitepapers' : 'Blogs' }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
