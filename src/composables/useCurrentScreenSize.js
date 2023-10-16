import { useQuasar } from 'quasar'
import { computed } from 'vue'

export function useCurrentScreenSize() {
  const $q = useQuasar()

  const currentScreenSize = computed(() => {
    return $q.screen.width
  })

  return {
    currentScreenSize
  }
}
