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

    // intercept any error based alerts and check if there is an error object and change it to return response data
    if (alerts.value.some(alrt => alrt.type == 'error')) {
      alerts.value.forEach(alrt => {
        if (alrt.type == 'error' && typeof alrt.text == 'object') {
          alrt.text = alrt.text.response?.data ? alrt.text.response.data.detail : alrt.text
        }
      })
    }
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
