<script setup lang="ts">
import HeroBanner from '@/components/home/HeroBanner.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'
import LatestWork from '@/components/home/LatestWork.vue'
import MarketsSection from '@/components/home/MarketsSection.vue'
import MarketsChartSection from '@/components/home/MarketsChartSection.vue'
import TestimonialSection from '@/components/home/TestimonialSection.vue'
import FootballSection from '@/components/home/FootballSection.vue'
import StoriesSection from '@/components/home/StoriesSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'
</script>

<template>
  <div>
    <HeroBanner id="hero" />
    <ServicesSection id="services" />
    <LatestWork id="work" />
    <MarketsSection id="markets" />
    <MarketsChartSection id="charts" />
    <!-- <TestimonialSection /> -->
    <FootballSection id="football" />
    <!-- <StoriesSection /> -->
    <CtaSection id="cta" />
  </div>
</template>
