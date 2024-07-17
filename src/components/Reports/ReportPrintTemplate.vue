<template>
  <PrintTemplate ref="printTemplate">
    <template #print-html>
      <article>
        <section>
          <header>
            <h1 class="text-h4 text-bold q-mb-sm">
              Report: {{ reportDetails.type }}
            </h1>
          </header>
        </section>

        <q-space class="divider q-my-md" />

        <section>
          <table
            class="table-borderless"
          >
            <thead>
              <tr>
                <th>Owner</th>
                <th>Media Type</th>
                <th>Size Class</th>
                <th>Total Accessioned Count</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(data, i) in reportDetails.data"
                :key="i"
              >
                <td>{{ data.owner.name }}</td>
                <td>{{ data.media_type.name }}</td>
                <td>{{ data.size_class.name }}</td>
                <td>{{ data.total_count }}</td>
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
  reportDetails: {
    type: Object,
    required: true
  }
})

// Local Data
const printTemplate = ref(null)

// Logic
const printReport = () => {
  printTemplate.value.print()
}

defineExpose({ printReport })
</script>