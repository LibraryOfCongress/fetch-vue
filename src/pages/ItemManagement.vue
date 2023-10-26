<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mt-none">
          {{ trayData.title }} - {{ trayData.box_number }}
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-3 q-pr-xl">
        <div class="item-barcode">
          {{ trayData.id }}
        </div>
      </div>
      <div class="col-3">
        <div class="fit column no-wrap">
          <div class="item-details">
            <label class="item-details-label">
              Facility
            </label>
            <p class="item-details-text">
              {{ trayData.facility }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Shelf Location
            </label>
            <p class="item-details-text">
              {{ trayData.shelf_location }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Media Type
            </label>
            <p class="item-details-text">
              {{ trayData.media_type }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Container Type
            </label>
            <p class="item-details-text">
              {{ trayData.container_type }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="fit column no-wrap">
          <div class="item-details">
            <label class="item-details-label">
              Accession Date
            </label>
            <p class="item-details-text">
              {{ trayData.accession_date }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Shelved Date
            </label>
            <p class="item-details-text">
              {{ trayData.shelf_date }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Withdrawal Date
            </label>
            <p class="item-details-text">
              {{ trayData.widthdraw_date }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="fit column no-wrap">
          <div class="item-details">
            <label class="item-details-label">
              Item Count
            </label>
            <p class="item-details-text">
              {{ trayData.items.length }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              # of Items Out
            </label>
            <p class="item-details-text">
              {{ trayData.items_out_count }}
            </p>
          </div>

          <div class="item-details">
            <label class="item-details-label">
              Delete Count
            </label>
            <p class="item-details-text">
              {{ trayData.items_delete_count }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="fit row justify-between items-center">
      <div class="col-grow">
        <h2 class="text-h4 text-bold">
          Items in Tray
        </h2>
      </div>

      <div class="col-auto">
        filter
      </div>
    </div>

    <div class="row">
      <div class="col-grow">
        table
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ItemManagement',
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
        widthdraw_date: '03/03/2023',
        items: [
          {
            id: '00924891289',
            media_type: 'Archival Material',
            size: 'C High',
            temp_location: 'A22L L9 SH12 T2',
            permanent_location: 'Conveyance',
            subcollection: 123,
            volume: 10,
            arrival_date: '12/31/1999',
            accession_date: '01/01/2001',
            widthdraw_date: '10/22/2023',
            container_type: 'Book Tray'
          }
        ],
        items_out_count: 9,
        items_delete_count: 2
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.item {
  &-barcode {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: $secondary;
    color: $color-white;
    border-radius: 3px;
  }

  &-details {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1rem;

    &-label {
      font-weight: bold;
    }

    &-text {
      margin: 0;
    }
  }
}
</style>
