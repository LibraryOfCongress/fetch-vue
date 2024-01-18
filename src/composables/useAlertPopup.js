import { ref } from 'vue'

export function useAlertPopup () {

  const alerts = ref([])

  function handleAlert (options) {
    const defaultOptions = {
      type: 'error',
      text: 'No Message Provided!',
      autoClose: false,
      persistent: false
    }
    alerts.value.push({ ...defaultOptions, ...options })
  }

  function clearAlerts () {
    alerts.value = []
  }

  return {
    alerts,
    handleAlert,
    clearAlerts
  }
}
