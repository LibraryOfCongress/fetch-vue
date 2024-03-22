<template>
  <PrintTemplate ref="printTemplate">
    <template #print-html>
      <article>
        <section>
          <header>
            <h1 class="text-h4 text-bold q-mb-sm">
              Job: {{ accessionJobDetails.id }}
            </h1>
          </header>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-bold q-mb-sm">
            Accession Job Completed Data/Time: {{ new Date().toLocaleString() }}
          </p>
          <p class="text-bold">
            Accession Job User: {{ accessionJobDetails.assigned_user ? accessionJobDetails.assigned_user : 'No Assignee' }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h5 text-bold q-mb-sm">
            Total Trays: {{ accessionJobDetails.trays ? accessionJobDetails.trays.length : 0 }}
          </p>
          <p class="text-h5 text-bold q-mb-sm">
            Total Items: {{ renderTotalItems }}
          </p>
          <p class="text-h5 text-bold">
            Owner: {{ accessionJobDetails.owner?.name }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h4 text-bold q-mb-sm">
            Manifest:
          </p>
          <table
            v-if="accessionJobDetails.trayed == false"
            class="table-borderless"
          >
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Size Class</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in accessionJobDetails.non_tray_items"
                :key="item.id"
              >
                <td>{{ item.barcode?.value }}</td>
                <td>{{ item.size_class?.name }}</td>
              </tr>
            </tbody>
          </table>
          <table
            v-else
            class="table-borderless"
          >
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Size Class</th>
                <th># of Items</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tray in accessionJobDetails.trays"
                :key="tray.id"
              >
                <td>{{ tray.barcode?.value }}</td>
                <td>{{ tray.size_class?.name }}</td>
                <td>{{ tray.items ? tray.items.length : 0 }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </article>
    </template>
  </PrintTemplate>
</template>

<script setup>
import { ref, computed } from 'vue'
import PrintTemplate from '@/components/PrintTemplate.vue'
// Props
const mainProps = defineProps({
  accessionJobDetails: {
    type: Object,
    required: true
  }
})

// Local Data
const printTemplate = ref(null)

// Logic
const printBatchReport = () => {
  printTemplate.value.print()
}
const renderTotalItems = computed(() => {
  if (mainProps.accessionJobDetails.trayed) {
    //TODO: need to figure out how we want to calculate total items for trayed jobs
    return 0
  } else {
    return mainProps.accessionJobDetails.non_tray_items.length
  }
})

defineExpose({ printBatchReport })
</script>