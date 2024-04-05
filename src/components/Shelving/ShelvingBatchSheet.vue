<template>
  <PrintTemplate ref="printTemplate">
    <template #print-html>
      <article>
        <section>
          <header>
            <h1 class="text-h4 text-bold q-mb-sm">
              Job: {{ shelvingJobDetails.id }}
            </h1>
          </header>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-bold q-mb-sm">
            Shelving Job Completed Data/Time: {{ new Date().toLocaleString() }}
          </p>
          <p class="text-bold">
            Shelving Job User: {{ shelvingJobDetails.assigned_user ? shelvingJobDetails.assigned_user?.name : 'No Assignee' }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h5 text-bold q-mb-sm">
            Total Trays: {{ shelvingJobDetails.trays ? shelvingJobDetails.trays.length : 0 }}
          </p>
          <p class="text-h5 text-bold q-mb-sm">
            Total Non-Trays: {{ shelvingJobDetails.non_tray_items ? shelvingJobDetails.non_tray_items.length : 0 }}
          </p>
          <p class="text-h5 text-bold">
            Building: {{ shelvingJobDetails.building?.name }}
          </p>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <p class="text-h4 text-bold q-mb-sm">
            Shelving List:
          </p>
          <table
            class="table-borderless"
          >
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Aisle</th>
                <th>Side</th>
                <th>Ladder</th>
                <th>Shelf #</th>
                <th>Shelf Position</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="containers in shelvingJobDetails.trays"
                :key="containers.id"
              >
                <td>{{ containers.barcode?.value }}</td>
                <td>{{ containers.aisle_id }}</td>
                <td>{{ containers.side_id }}</td>
                <td>{{ containers.ladder_id }}</td>
                <td>{{ containers.shelf_id }}</td>
                <td>{{ containers.shelf_position_id }}</td>
              </tr>
              <tr
                v-for="containers in shelvingJobDetails.non_tray_items"
                :key="containers.id"
              >
                <td>{{ containers.barcode?.value }}</td>
                <td>{{ containers.aisle_id }}</td>
                <td>{{ containers.side_id }}</td>
                <td>{{ containers.ladder_id }}</td>
                <td>{{ containers.shelf_id }}</td>
                <td>{{ containers.shelf_position_id }}</td>
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
  shelvingJobDetails: {
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