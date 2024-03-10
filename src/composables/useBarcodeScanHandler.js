import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useBarcodeScanHandler () {

  const barcodeEnabled = ref(false)
  const scannedBarCode = ref([])
  const compiledBarCode = ref('')

  async function barcodeScanHandler (event) {
    if (event.key == '!' && barcodeEnabled.value == false) {
      // if the appended key ! is passed we know the barcode key events are about to be received
      // so enable barcode reading
      barcodeEnabled.value = true
    } else if (event.key == '!' && barcodeEnabled.value) {
      // if the appended key ! is passed and barcode is current enabled we know the barcode key events are completed
      // so will emit the compiled barcode and reset the barcode scanning state

      // initially reset compileBarCode each scan incase the same bar code is scanned again
      compiledBarCode.value = ''
      await nextTick()

      compiledBarCode.value = scannedBarCode.value.join('')
      scannedBarCode.value = []
    } else if (barcodeEnabled.value) {
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
