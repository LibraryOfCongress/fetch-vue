<template>
  <q-page
    :style-fn="handlePageOffset"
    padding
  >
    <LoadingOverlay />

    <TrayDisplay
      v-if="$route.name == 'record-management-tray' && trayDetails.id"
    />
    <ShelfDisplay
      v-else-if="$route.name == 'record-management-shelf'"
      :shelf-data="shelfData"
      @selected-item="selectedItemData = $event"
    />
    <ItemDisplay
      v-else-if="$route.name == 'record-management-items' && itemDetails.id"
    />

    <ItemDataOverlay
      v-if="selectedItemData !== null"
      :item-data="selectedItemData"
      :facility="trayData.facility"
      @close="selectedItemData = null"
    />
  </q-page>
</template>

<script setup>
import { inject, ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecordManagementStore } from '@/stores/record-management-store'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import TrayDisplay from '@/components/RecordManagement/TrayDisplay.vue'
import ShelfDisplay from '@/components/RecordManagement/ShelfDisplay.vue'
import ItemDisplay from '@/components/RecordManagement/ItemDisplay.vue'
import ItemDataOverlay from '@/components/RecordManagement/ItemDataOverlay.vue'

const route = useRoute()

// Store Data
const {
  itemDetails,
  trayDetails
} = storeToRefs(useRecordManagementStore())
const {
  getItemDetails,
  getTrayDetails
} = useRecordManagementStore()

// Local Data
const shelfData = ref({
  id: '',
  title: 'Shelf McShelf',
  facility: 'Fort Meade',
  shelf_location: 'Aisle 22L Ladder 19 Position 1',
  media_type: 'Vinyls',
  container_type: 'Document Carton',
  accession_date: '12/31/1999',
  items: [
    {
      id: 1,
      item: null,
      non_tray_item: {
        'id': 9,
        'status': 'Requested',
        'media_type': {
          'id': 4,
          'name': 'Newspaper'
        },
        'size_class': {
          'id': 3,
          'name': 'Record Storage Box',
          'short_name': 'RS'
        },
        'owner': {
          'id': 5,
          'name': 'Congressional Research Services'
        },
        'accession_dt': '2024-10-11T22:24:14.060000',
        'withdrawal_dt': null,
        'barcode': {
          'id': 'cd4cda6f-deea-4810-8f62-4018652fab10',
          'value': '12345678888',
          'withdrawn': false,
          'type_id': 1,
          'type': {
            'id': 1,
            'name': 'Item'
          },
          'create_dt': '2024-10-11T20:27:17.113278',
          'update_dt': '2024-10-11T20:27:17.113254'
        },
        'shelf_position': {
          'id': 16661,
          'shelf_id': 2083,
          'shelf_position_number': {
            'number': 5
          },
          'shelf': {
            'id': 2083,
            'shelf_number': {
              'id': 3,
              'number': 3
            },
            'ladder': {
              'id': 261,
              'ladder_number': {
                'number': 33
              },
              'side': {
                'id': 7,
                'aisle': {
                  'id': 3,
                  'aisle_number': {
                    'number': 1
                  },
                  'module': {
                    'id': 2,
                    'module_number': '2',
                    'building': {
                      'id': 1,
                      'name': 'Fort Meade'
                    }
                  },
                  'building': null
                },
                'side_orientation': {
                  'id': 2,
                  'name': 'Right'
                }
              }
            }
          },
          'location': null,
          'internal_location': null
        }
      }
    },
    {
      id: 2,
      item: null,
      non_tray_item: {
        'id': 18,
        'status': 'Requested',
        'media_type': {
          'id': 3,
          'name': 'Casette Disk'
        },
        'size_class': {
          'id': 3,
          'name': 'Record Storage Box',
          'short_name': 'RS'
        },
        'owner': {
          'id': 5,
          'name': 'Congressional Research Services'
        },
        'accession_dt': '2024-10-15T20:07:03.649000',
        'withdrawal_dt': null,
        'barcode': {
          'id': '78aa8e33-ce56-449f-9bf3-27093188f12e',
          'value': '12345000001',
          'withdrawn': false,
          'type_id': 1,
          'type': {
            'id': 1,
            'name': 'Item'
          },
          'create_dt': '2024-10-15T20:07:03.912095',
          'update_dt': '2024-10-15T20:07:03.912091'
        },
        'shelf_position': {
          'id': 98,
          'shelf_id': 13,
          'shelf_position_number': {
            'number': 2
          },
          'shelf': {
            'id': 13,
            'shelf_number': {
              'id': 5,
              'number': 5
            },
            'ladder': {
              'id': 2,
              'ladder_number': {
                'number': 2
              },
              'side': {
                'id': 1,
                'aisle': {
                  'id': 1,
                  'aisle_number': {
                    'number': 1
                  },
                  'module': {
                    'id': 1,
                    'module_number': '1',
                    'building': {
                      'id': 1,
                      'name': 'Fort Meade'
                    }
                  },
                  'building': null
                },
                'side_orientation': {
                  'id': 1,
                  'name': 'Left'
                }
              }
            }
          },
          'location': null,
          'internal_location': null
        }
      }
    }
  ],
  items_out_count: 9,
  items_delete_count: 2
})
const selectedItemData = ref(null)

// Logic
const handlePageOffset = inject('handle-page-offset')

onBeforeMount( async () => {
  if (route.name == 'record-management-items' && route.params.barcode) {
    await getItemDetails(route.params.barcode)
  } else if (route.name == 'record-management-tray' && route.params.barcode) {
    await getTrayDetails(route.params.barcode)
  }
})

watch(() => route.params.barcode, async () => {
  if (route.name == 'record-management-items' && route.params.barcode) {
    await getItemDetails(route.params.barcode)
  } else if (route.name == 'record-management-tray' && route.params.barcode) {
    await getTrayDetails(route.params.barcode)
  }
})
</script>
