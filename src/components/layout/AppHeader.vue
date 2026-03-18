<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { mainNav, locations } from '@/data/navigation'
import DesktopMenu from './DesktopMenu.vue'

const { progress, isScrolled } = useScrollProgress()
const isFullProgress = computed(() => progress.value >= 100)
const isMenuOpen = ref(false)
const isLocationOpen = ref(false)

const logoRef = ref<HTMLElement>()
const headerNavRef = ref<HTMLElement>()
const locationDropRef = ref<HTMLElement>()
const toggleBtnRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>() // used by template ref

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) isLocationOpen.value = false
}

function toggleLocation() {
  isLocationOpen.value = !isLocationOpen.value
}

function closeAll() {
  isMenuOpen.value = false
  isLocationOpen.value = false
}

function getImageUrl(filename: string) {
  return new URL(`../../assets/images/${filename}`, import.meta.url).href
}

onMounted(() => {
  nextTick(() => {
    watch(
      isScrolled,
      (scrolled) => {
        if (isMenuOpen.value) return

        const navEl = headerNavRef.value
        const locEl = locationDropRef.value
        const btnEl = toggleBtnRef.value
        const logoEl = logoRef.value

        if (scrolled) {
          if (logoEl) {
            gsap.to(logoEl, {
              opacity: 0,
              y: -10,
              duration: 0.3,
              ease: 'power2.inOut',
              onComplete: () => { logoEl.style.pointerEvents = 'none' },
            })
          }
          if (navEl) {
            gsap.to(navEl, {
              opacity: 0,
              y: -10,
              duration: 0.3,
              ease: 'power2.inOut',
              onComplete: () => { navEl.style.pointerEvents = 'none' },
            })
          }
          if (locEl) {
            gsap.to(locEl, {
              opacity: 0,
              y: -10,
              duration: 0.3,
              ease: 'power2.inOut',
              onComplete: () => { locEl.style.pointerEvents = 'none' },
            })
          }
          if (btnEl) {
            gsap.to(btnEl, {
              x: 40,
              duration: 0.4,
              ease: 'power2.out',
            })
          }
        } else {
          if (logoEl) {
            logoEl.style.pointerEvents = ''
            gsap.to(logoEl, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
          if (navEl) {
            navEl.style.pointerEvents = ''
            gsap.to(navEl, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
          if (locEl) {
            locEl.style.pointerEvents = ''
            gsap.to(locEl, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
            })
          }
          if (btnEl) {
            gsap.to(btnEl, {
              x: 0,
              duration: 0.4,
              ease: 'power2.out',
            })
          }
        }
      },
      { immediate: true }
    )
  })
})
</script>

<template>
  <header
    ref="headerRef"
    class="sticky top-0 w-full z-50 transition-colors duration-300"
    :class="isMenuOpen ? 'bg-white' : (isScrolled ? 'bg-transparent' : 'bg-white')"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <div ref="logoRef">
          <RouterLink to="/" class="flex items-center gap-2" @click="closeAll" aria-label="Home">
            <img
              :src="getImageUrl('logo-win.gif')"
              alt="Logo"
              class="h-8 md:h-10 w-8 md:w-10 rounded-full object-cover"
            />
            <img
              :src="getImageUrl('logo-name.png')"
              alt="Logo name"
              class="h-5 md:h-6 w-auto"
            />
          </RouterLink>
        </div>

        <!-- Desktop: Location dropdown -->
        <div ref="locationDropRef" class="hidden md:flex items-center gap-2 relative">
          <button
            class="flex items-center gap-1 text-sm font-semibold"
            @click="toggleLocation"
          >
            <span>Knowledge</span>
            <img
              :src="getImageUrl('dropdown.svg')"
              alt=""
              class="w-2.5 transition-transform duration-200"
              :class="{ 'rotate-180': isLocationOpen }"
            />
          </button>
          <span class="text-sm text-gray hidden lg:inline">Win's corner</span>
        </div>

        <!-- Desktop Nav -->
        <nav ref="headerNavRef" class="hidden md:flex items-center gap-6">
          <template v-for="item in mainNav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="text-sm font-medium transition-colors duration-200 hover:text-secondary"
              :class="item.highlight ? 'text-secondary font-bold' : 'text-primary'"
              @click="closeAll"
            >
              {{ item.label }}
            </RouterLink>
          </template>
        </nav>

        <!-- Toggle Button -->
        <button
          ref="toggleBtnRef"
          class="relative w-10 h-10 flex items-center justify-center cursor-pointer rounded-full transition-shadow duration-300"
          :class="isFullProgress && !isMenuOpen ? 'shadow-[0_0_12px_rgba(253,46,53,0.4)]' : ''"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <!-- Progress ring (visible while scrolling, < 100%) -->
          <div
            class="absolute inset-0 w-full h-full rounded-full transition-opacity duration-300"
            :class="isScrolled && !isFullProgress ? 'opacity-100' : 'opacity-0'"
            :style="{
              background: `conic-gradient(#fd2e35 ${progress}%, #e5e7eb ${progress}%)`
            }"
          >
            <div class="absolute inset-[2px] rounded-full bg-[#f7f3f0]" />
          </div>
          <!-- Filled red background (visible at 100%) -->
          <div
            class="absolute inset-0 w-full h-full rounded-full bg-secondary transition-opacity duration-300"
            :class="isFullProgress && !isMenuOpen ? 'opacity-100' : 'opacity-0'"
          />
          <!-- Lines -->
          <div class="relative z-10 flex flex-col gap-1.5">
            <span
              class="block w-5 h-0.5 transition-all duration-300 origin-center"
              :class="[
                isMenuOpen ? 'rotate-45 translate-y-1' : '',
                isFullProgress && !isMenuOpen ? 'bg-white' : (isScrolled && !isMenuOpen ? 'bg-secondary' : 'bg-primary')
              ]"
            />
            <span
              class="block w-5 h-0.5 transition-all duration-300 origin-center"
              :class="[
                isMenuOpen ? '-rotate-45 -translate-y-1' : '',
                isFullProgress && !isMenuOpen ? 'bg-white' : (isScrolled && !isMenuOpen ? 'bg-secondary' : 'bg-primary')
              ]"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Location Dropdown Panel -->
    <Transition name="dropdown">
      <div
        v-if="isLocationOpen"
        class="absolute top-full left-0 w-full bg-white shadow-lg border-t rounded-b-2xl"
      >
        <div class="px-8 md:px-20 py-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <RouterLink
              v-for="loc in locations"
              :key="loc.country"
              :to="loc.to"
              class="group"
              @click="closeAll"
            >
              <img
                :src="getImageUrl(loc.image)"
                :alt="loc.country"
                class="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform duration-300"
              />
              <h6 class="text-lg font-extrabold mb-1">{{ loc.country }}</h6>
              <p class="text-sm text-gray">{{ loc.cities.join(', ') }}</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Full screen menu -->
    <DesktopMenu :is-open="isMenuOpen" @close="closeAll" />
  </header>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
