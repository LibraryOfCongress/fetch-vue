<template>
  <q-page padding>
    <NonTrayDisplay
      v-if="$route.params.type == 'non-tray'"
      :non-tray-data="nonTrayData"
      @selected-item="selectedItemData = $event"
    />
    <TrayDisplay
      v-else
      :tray-data="trayData"
      @selected-item="selectedItemData = $event"
    />

    <ItemDataOverlay
      v-if="selectedItemData !== null"
      :item-data="selectedItemData"
      :facility="trayData.facility"
      @close="selectedItemData = null"
    />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import TrayDisplay from '@/components/ItemManagement/TrayDisplay.vue'
import NonTrayDisplay from '@/components/ItemManagement/NonTrayDisplay.vue'
import ItemDataOverlay from '@/components/ItemManagement/ItemDataOverlay.vue'

export default defineComponent({
  name: 'ItemManagement',
  components: {
    TrayDisplay,
    NonTrayDisplay,
    ItemDataOverlay
  },
  data () {
    return {
      trayData: {
        id: 'BL220987',
        title: 'Tray Mctray Photograph Archive',
        box_number: 332,
        facility: 'Fort Meade',
        shelf_location: 'Aisle 22L Ladder 19 Position 1',
        media_type: 'Archival Material',
        container_type: 'Document Carton',
        accession_date: '12/31/1999',
        shelf_date: '01/01/2001',
        withdraw_date: '03/03/2023',
        items: [
          {
            id: '00924891289',
            title: 'Some Book by Arthur McAuthor',
            media_type: 'Archival Material',
            size: 'C High',
            temp_location: 'A22L L9 SH12 T2',
            permanent_location: 'Conveyance',
            subcollection: 123,
            volume: 10,
            arrival_date: '12/31/1999',
            accession_date: '01/01/2001',
            withdraw_date: '10/22/2023',
            container_type: 'Book Tray',
            dimensions: '11.5" x 8.5".',
            condition: 'Do Not Send',
            owner: 'George Clinton'
          },
          {
            id: '00924891290',
            title: 'Another Book by Arthur McAuthor',
            media_type: 'Archival Material',
            size: 'C High',
            temp_location: 'A22L L9 SH12 T3',
            permanent_location: 'Conveyance',
            subcollection: 155,
            volume: 8,
            arrival_date: '12/31/1999',
            accession_date: '01/11/2001',
            withdraw_date: '10/27/2023',
            container_type: 'Book Tray',
            dimensions: '11.5" x 8.5".',
            condition: 'Do Not Send',
            owner: 'George Clinton'
          },
          {
            id: '00924891291',
            title: 'Third Book by Arthur McAuthor',
            media_type: 'Archival Material',
            size: 'C Low',
            temp_location: 'B22L L9 SH12 T4',
            permanent_location: 'Conveyance',
            subcollection: 512,
            volume: 9,
            arrival_date: '12/31/1999',
            accession_date: '01/21/2001',
            withdraw_date: '10/27/2023',
            container_type: 'Book Tray',
            dimensions: '11.5" x 8.5".',
            condition: 'Do Not Send',
            owner: 'George Clinton'
          }
        ],
        items_out_count: 9,
        items_delete_count: 2
      },
      nonTrayData: {
        id: '',
        title: 'Shelf McShelf',
        facility: 'Fort Meade',
        shelf_location: 'Aisle 22L Ladder 19 Position 1',
        media_type: 'Vinyls',
        container_type: 'Document Carton',
        accession_date: '12/31/1999',
        items: [
          {
            id: '00924891289',
            media_type: 'Vinyl Recording',
            shelf_location: 'Aisle 22L Ladder 19 Position 1',
            shelf_position: 'P1',
            accession_date: '01/01/2001',
            subcollection: 'Divinity Library',
            container_type: 'Document Carton',
            dimensions: '11.5" x 8.5".',
            owner: 'George Clinton'
          },
          {
            id: '00924891290',
            media_type: 'Vinyl Recording',
            shelf_location: 'Aisle 22L Ladder 19 Position 2',
            shelf_position: 'P2',
            accession_date: '01/11/2001',
            subcollection: 'Divinity Library',
            container_type: 'Document Carton',
            dimensions: '11.5" x 8.5".',
            owner: 'George Clinton'
          }
        ],
        items_out_count: 9,
        items_delete_count: 2
      },
      selectedItemData: null
    }
  }
})
</script>
