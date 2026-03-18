<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { projects } from '@/data/projects'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}
</script>

<template>
  <section class="section-padding">
    <div class="max-w-6xl mx-auto px-4 mb-10">
      <h2 class="fade-up text-3xl md:text-5xl lg:text-[50px] font-bold leading-tight mb-3">
        My Latest Post
      </h2>
      <p class="fade-up text-lg md:text-xl text-gray mt-6">
        Explore my latest posts, where I share personal perspectives on the challenges I've faced recently. Feel free to take a look and share your thoughts.
      </p>
    </div>

    <!-- Projects grid -->
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <RouterLink
        v-for="project in projects"
        :key="project.title"
        :to="project.link"
        class="fade-up group"
      >
        <div class="overflow-hidden rounded-lg mb-4">
          <img
            :src="getImageUrl(project.image)"
            :alt="project.title"
            class="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <h3 class="text-base font-extrabold mb-1 line-clamp-2">{{ project.title }}</h3>
        <p class="text-sm text-gray line-clamp-2 mb-2">{{ project.description }}</p>
        <span class="hover-line text-sm">View Post</span>
      </RouterLink>
    </div>
  </section>
</template>
