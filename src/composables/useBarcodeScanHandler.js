import { ref, nextTick, watch } from 'vue'
import { useBarcodeStore } from '@/stores/barcode-store'
import { storeToRefs } from 'pinia'

export function useBarcodeScanHandler () {
  const scannedBarCode = ref([])
  const compiledBarCode = ref('')

  function debounce (callback, wait) {
    let timeoutId = null
    return (...args) => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        callback(...args)
      }, wait)
    }
  }

  function barcodeScanEntry (event) {
    scannedBarCode.value.push(event.key)
    handleBarcodeCompile()
  }
  const handleBarcodeCompile = debounce(async () => {
    // if half a second (200ms) passes inbetween barcode key inputs it means the scanner has completed typing a barcode value
    // once scan is complete we render the compiled barcode and reset the barcode scanning state
    compiledBarCode.value = ''
    await nextTick()

    compiledBarCode.value = scannedBarCode.value.join('')
    scannedBarCode.value = []
  }, 200)

  const { barcodeScanAllowed } = storeToRefs(useBarcodeStore())
  watch(barcodeScanAllowed, (val) => {
    if (val == true) {
      document.addEventListener('keypress', barcodeScanEntry)
    } else {
      document.removeEventListener('keypress', barcodeScanEntry)
    }
  })

  return {
    scannedBarCode,
    compiledBarCode
  }
}
