import { ref, onMounted, onUnmounted } from 'vue'

export function useBarcodeScanHandler () {

  const scannedBarCode = ref([])
  const compiledBarCode = ref('')

  function barcodeScanHandler (event) {
    if (event.key == '!') {
      // if the appended key ! is passed we know the barcode key events are completed
      // so will emit the compiled barcode and reset the scannedBarCode state
      compiledBarCode.value = scannedBarCode.value.join('')
      scannedBarCode.value = []
    } else {
      scannedBarCode.value.push(event.key)
    }
  }

  onMounted(() => document.addEventListener('keypress', barcodeScanHandler))
  onUnmounted(() => document.removeEventListener('keypress', barcodeScanHandler))

  return {
    scannedBarCode,
    compiledBarCode
  }
}
