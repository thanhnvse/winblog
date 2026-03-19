<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { technologies } from '@/data/technologies'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

const route = useRoute()
const router = useRouter()

const technology = computed(() => {
  return technologies.find((t) => t.id === route.params.id)
})

const trendingTechnologies = computed(() => {
  return technologies.filter((t) => t.id !== route.params.id).slice(0, 3)
})

if (!technology.value) {
  router.replace('/technologies')
}
</script>

<template>
  <div v-if="technology" class="pt-20">
    <!-- Blog Banner -->
    <section class="section-padding pb-0">
      <div class="max-w-5xl mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="md:w-10/12 md:mx-auto mb-8">
            <span class="block text-sm text-gray mb-2">Technologies</span>
            <h1 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-4">
              {{ technology.title }}
            </h1>
            <div class="fade-up flex flex-wrap gap-x-4 text-base text-gray mb-6">
              <span>Posted on {{ technology.postedDate }}</span>
              <span class="text-gray/60">Last Updated {{ technology.lastUpdated }}</span>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="fade-up rounded-lg overflow-hidden bg-gray/10">
            <img
              :src="technology.image"
              :alt="technology.title"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Detail -->
    <section class="section-padding">
      <div class="max-w-5xl mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="md:flex md:gap-10">
            <!-- Sidebar - Author & Trending -->
            <aside class="hidden md:block md:w-3/12 shrink-0">
              <div class="sticky top-24">
                <!-- Author -->
                <div class="text-center mb-8">
                  <span class="block text-xs text-gray mb-3">Written by</span>
                  <img
                    :src="technology.image"
                    alt="Author"
                    class="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <h6 class="text-base font-extrabold mb-0">{{ technology.author }}</h6>
                  <span class="text-xs text-gray">{{ technology.authorRole }}</span>
                </div>

                <!-- Trending -->
                <ul class="space-y-6">
                  <li v-for="item in trendingTechnologies" :key="item.id">
                    <RouterLink :to="`/technologies/${item.id}`" class="block group">
                      <h3 class="text-base font-extrabold mb-1 group-hover:text-secondary transition-colors leading-snug">
                        {{ item.title }}
                      </h3>
                      <span class="text-xs text-gray">
                        By {{ item.author }}, on {{ item.postedDate }}
                      </span>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </aside>

            <!-- Main Content -->
            <div class="md:w-9/12">
              <div class="space-y-6">
                <template v-for="(section, idx) in technology.content" :key="idx">
                  <!-- Blockquote -->
                  <blockquote
                    v-if="section.type === 'blockquote'"
                    class="fade-up border-l-4 border-secondary pl-5 py-2 text-base md:text-lg italic text-primary/80"
                  >
                    <p>{{ section.content }}</p>
                  </blockquote>

                  <!-- Paragraph -->
                  <p
                    v-else-if="section.type === 'paragraph'"
                    class="fade-up text-base leading-relaxed text-gray"
                  >
                    {{ section.content }}
                  </p>

                  <!-- Heading -->
                  <h2
                    v-else-if="section.type === 'heading'"
                    class="fade-up text-[22px] md:text-[28px] font-extrabold mt-4"
                  >
                    {{ section.content }}
                  </h2>

                  <!-- List -->
                  <ol
                    v-else-if="section.type === 'list' && section.items"
                    class="fade-up space-y-3 pl-5"
                  >
                    <li
                      v-for="(item, i) in section.items"
                      :key="i"
                      class="text-base text-gray leading-relaxed list-decimal"
                    >
                      {{ item }}
                    </li>
                  </ol>

                  <!-- Table -->
                  <div
                    v-else-if="section.type === 'table' && section.rows"
                    class="fade-up overflow-x-auto"
                  >
                    <table class="w-full border-collapse text-sm md:text-base">
                      <thead>
                        <tr>
                          <td
                            v-for="(cell, ci) in section.rows[0]"
                            :key="ci"
                            class="bg-primary text-white font-bold px-4 py-3 text-left"
                          >
                            {{ cell }}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(row, ri) in section.rows.slice(1)"
                          :key="ri"
                          class="border-b border-gray/20"
                        >
                          <td
                            v-for="(cell, ci) in row"
                            :key="ci"
                            class="px-4 py-3"
                          >
                            {{ cell }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </div>

              <!-- Back link -->
              <div class="mt-12 fade-up">
                <RouterLink to="/technologies" class="hover-line text-sm">
                  ← Back to Technologies
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Mobile Author Section -->
          <div class="md:hidden mt-12 pt-8 border-t border-gray/20">
            <div class="text-center mb-6">
              <span class="block text-xs text-gray mb-3">Written by</span>
              <img
                :src="technology.image"
                alt="Author"
                class="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              />
              <h6 class="text-lg font-extrabold mb-0">{{ technology.author }}</h6>
              <span class="text-sm text-gray">{{ technology.authorRole }}</span>
            </div>

            <!-- Trending on Mobile -->
            <ul class="space-y-6">
              <li v-for="item in trendingTechnologies" :key="item.id">
                <RouterLink :to="`/technologies/${item.id}`" class="block group">
                  <h3 class="text-lg font-extrabold mb-1 group-hover:text-secondary transition-colors leading-snug">
                    {{ item.title }}
                  </h3>
                  <span class="text-xs text-gray">
                    By {{ item.author }}, on {{ item.postedDate }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Divider -->
    <div class="max-w-4xl mx-auto py-12 md:py-20 px-3" style="background: rgb(34, 20, 41);">
      <div class="max-w-3xl mx-auto px-4">
        <hr class="border-white" />
      </div>
    </div>
  </div>
</template>
