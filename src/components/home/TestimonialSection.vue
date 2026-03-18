<script setup lang="ts">
import VideoPlayer from '@/components/ui/VideoPlayer.vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>

<template>
  <section class="section-padding bg-primary text-white">
    <div class="max-w-5xl mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <h2 class="fade-up text-[32px] md:text-[45px] lg:text-[50px] font-extrabold leading-tight mb-4">
            Hear what our esteemed client has to say about our work.
          </h2>
          <p class="fade-up text-lg md:text-xl opacity-80">
            Hear from Ahmed Nadeem and Gurkirat Waraich, Product Managers of Appro, as they
            reveal how we helped turn their B2B and B2B2C platform into a beautifully
            seamless experience.
          </p>
        </div>

        <div class="fade-up">
          <VideoPlayer
            video-id="G2z_nNGTN4A"
            poster="https://lollypop.design/wp-content/uploads/2025/10/appro_testimonial_lollypop.webp"
          />
        </div>
      </div>
    </div>
  </section>
</template>
