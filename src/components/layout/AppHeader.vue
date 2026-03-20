<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import gsap from 'gsap'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { mainNav, locations } from '@/data/navigation'
import DesktopMenu from './DesktopMenu.vue'

const route = useRoute()
const { progress, isScrolled } = useScrollProgress()
const isFullProgress = computed(() => progress.value >= 100)
const isMenuOpen = ref(false)
const isLocationOpen = ref(false)
const isHomePage = computed(() => route.path === '/')

const sectionShortcuts = [
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'markets', label: 'Markets' },
  { id: 'charts', label: 'Charts' },
  { id: 'football', label: 'Football' },
  { id: 'cta', label: 'Subscribe' },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const logoRef = ref<HTMLElement>()
const headerNavRef = ref<HTMLElement>()
const locationDropRef = ref<HTMLElement>()
const toggleBtnRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>() // used by template ref

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isLocationOpen.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function toggleLocation() {
  isLocationOpen.value = !isLocationOpen.value
}

function closeAll() {
  isMenuOpen.value = false
  isLocationOpen.value = false
  document.body.style.overflow = ''
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
    :class="isMenuOpen ? 'bg-light' : (isScrolled ? 'bg-transparent' : 'bg-light')"
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
              :src="getImageUrl('logo-name-removebg.png')"
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

        <!-- Toggle Button + Section Shortcuts -->
        <div ref="toggleBtnRef" class="relative">
          <button
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
              <div class="absolute inset-[2px] rounded-full bg-light" />
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

          <!-- Section shortcuts (vertical, directly below toggle) -->
          <Transition name="shortcuts">
            <div
              v-if="isScrolled && isHomePage && !isMenuOpen"
              class="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 flex-col items-center gap-1 bg-secondary backdrop-blur-sm rounded-full px-1.5 py-2"
            >
              <button
                v-for="s in sectionShortcuts"
                :key="s.id"
                @click="scrollToSection(s.id)"
                class="group relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors duration-200"
                :aria-label="s.label"
              >
                <!-- Services: code/gear -->
                <svg v-if="s.id === 'services'" class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                <!-- Work: briefcase -->
                <svg v-else-if="s.id === 'work'" class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <!-- Markets: trending up -->
                <svg v-else-if="s.id === 'markets'" class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <!-- Charts: chart bar -->
                <svg v-else-if="s.id === 'charts'" class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <!-- Football -->
                <svg v-else-if="s.id === 'football'" class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0l2.5 4.5m-5 0L12 2m0 0l-2.5 4.5M9.5 6.5L7 10m5-3.5l2.5 4M14.5 6.5L17 10m-5 12l-2.5-4.5m5 0L12 22m0 0l2.5-4.5M14.5 17.5L17 14m-5 3.5L9.5 17.5M9.5 17.5L7 14m0-4h3.5m7 0H14m-7 0l2 3.5m10-3.5l-2 3.5M9 10l-2 3.5m10-3.5l-2-3.5" />
                </svg>
                <!-- Subscribe: envelope -->
                <svg v-else class="w-4 h-4 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span class="absolute right-10 text-[10px] font-semibold text-primary bg-white rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
                  {{ s.label }}
                </span>
              </button>
            </div>
          </Transition>
        </div>
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
.shortcuts-enter-active {
  transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
}
.shortcuts-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.shortcuts-enter-from,
.shortcuts-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
