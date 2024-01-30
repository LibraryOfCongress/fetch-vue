<template>
  <div class="column">
    <!-- Print Doc -->
    <div
      id="print-document"
      style="display: none"
    >
      <slot name="print-html" />
    </div>
  </div>
</template>
<script setup>
import { inject } from 'vue'

// Logic
const htmlToPaper = inject('htmlToPaper')
const print = () => {
  // get all stylesheets from HTML
  let stylesHtml = ''
  for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
    stylesHtml += node.outerHTML
  }

  htmlToPaper('print-document', {
    // inject styles from application
    css: stylesHtml
  })
}
defineExpose({ print })
</script>