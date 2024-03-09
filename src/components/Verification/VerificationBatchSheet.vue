<template>
  <PrintTemplate ref="printTemplate">
    <template #print-html>
      <article>
        <section>
          <header>
            <h1 class="text-h4 text-bold q-mb-sm">
              Job: {{ verificationJobDetails.id }}
            </h1>
          </header>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-bold q-mb-sm">
            Verification Job Completed Data/Time: {{ new Date().toLocaleString() }}
          </p>
          <p class="text-bold">
            Verification Job User: {{ verificationJobDetails.assigned_user ? verificationJobDetails.assigned_user : 'No Assignee' }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h5 text-bold q-mb-sm">
            Total Trays: {{ verificationJobDetails.trays ? verificationJobDetails.trays.length : 0 }}
          </p>
          <p class="text-h5 text-bold q-mb-sm">
            Total Items: {{ verificationJobDetails.items ? verificationJobDetails.items.length : 0 }}
          </p>
          <p class="text-h5 text-bold">
            Owner: {{ verificationJobDetails.owner }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h4 text-bold q-mb-sm">
            Manifest:
          </p>
          <table
            v-if="verificationJobDetails.type == 1"
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
                v-for="item in verificationJobDetails.items"
                :key="item.id"
              >
                <td>{{ item.id }}</td>
                <td>{{ item.size_class }}</td>
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
                v-for="tray in verificationJobDetails.trays"
                :key="tray.id"
              >
                <td>{{ tray.id }}</td>
                <td>{{ tray.size_class }}</td>
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
import { ref } from 'vue'
import PrintTemplate from '@/components/PrintTemplate.vue'
// Props
defineProps({
  verificationJobDetails: {
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

defineExpose({ printBatchReport })
</script>