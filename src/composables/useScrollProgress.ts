import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress() {
  const progress = ref(0)
  const isScrolled = ref(false)
  const isAtBottom = ref(false)

  function onScroll() {
    const scrollTop = document.documentElement.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    progress.value = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
    isScrolled.value = scrollTop > 0
    isAtBottom.value = progress.value >= 97
  }

  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', onScroll))

  return { progress, isScrolled, isAtBottom }
}
