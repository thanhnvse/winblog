import { ref, onMounted, onUnmounted } from 'vue'

export function useTextRotation(texts: string[], interval = 2500) {
  const currentIndex = ref(0)
  const currentText = ref(texts[0])
  const isVisible = ref(true)
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => {
    timer = setInterval(() => {
      isVisible.value = false
      setTimeout(() => {
        currentIndex.value = (currentIndex.value + 1) % texts.length
        currentText.value = texts[currentIndex.value]
        isVisible.value = true
      }, 400)
    }, interval)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { currentText, isVisible }
}
