import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useBarcodeScanHandler () {

  const scannedBarCode = ref([])
  const compiledBarCode = ref('')

  async function barcodeScanHandler (event) {
    if (event.key == '!') {
      // if the appended key ! is passed we know the barcode key events are completed
      // so will emit the compiled barcode and reset the scannedBarCode state

      // initially reset compileBarCode each scan incase the same bar code is scanned again
      compiledBarCode.value = ''
      await nextTick()

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
