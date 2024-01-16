<template>
  <!-- scan container display (TRAY ONLY) -->
  <div
    v-if="!route.params.containerId && verificationJob.type == 2"
    class="absolute-center verification-container"
  >
    <div class="column items-center">
      <h1 class="text-h4 text-bold text-center q-mb-lg">
        Scan Tray Barcode
      </h1>

      <q-btn
        class="text-h4 q-pa-xs-lg q-pa-md-xl"
        no-caps
        unelevated
        color="secondary"
        label="Waiting For Scan..."
        @click="triggerBarcodeScan('CH220987')"
      />
    </div>
  </div>

  <!-- container display -->
  <div
    v-else
    class="row verification-container flex-lg-grow"
  >
    <div
      class="col-12 col-lg-4 col-xl-3 verification-container-info"
    >
      <div class="row">
        <div class="col-12 flex no-wrap items-center q-mb-xs-md q-mb-sm-lg">
          <MoreOptionsMenu
            :options="currentScreenSize !== 'xs' ? [{ text: 'Edit' }] : [{ text: 'Edit' }, { text: 'Print Job' }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
          <h1 class="text-h4 text-bold">
            {{ verificationJob.type == 2 ? verificationContainer.title : `Job: ${verificationJob.id}` }}
          </h1>
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12 q-mb-xs-md q-mb-sm-none q-mb-lg-lg">
          <BarcodeBox
            :barcode="verificationContainer.id"
            class="q-mb-md-xl q-mb-lg-none"
          />
        </div>

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-12">
          <div class="row">
            <div class="col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg verification-container-info-details">
              <label class="text-h6 q-mb-xs">
                Owner
              </label>
              <p
                v-if="!editMode"
                class="outline"
              >
                {{ verificationContainer.id == null ? verificationJob.owner : verificationContainer.owner }}
              </p>
              <SelectInput
                v-else-if="verificationContainer.id == null"
                v-model="verificationJob.owner"
                :options="optionStore.ownerOptions"
                option-value="name"
                option-label="name"
              />
              <SelectInput
                v-else
                v-model="verificationContainer.owner"
                :options="optionStore.ownerOptions"
                option-value="name"
                option-label="name"
              />
            </div>

            <div class="col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg verification-container-info-details">
              <label class="text-h6 q-mb-xs">
                Media Type
              </label>
              <p
                v-if="!editMode"
                class="outline text-highlight"
              >
                {{ verificationContainer.id == null ? verificationJob.media_type : verificationContainer.media_type }}
              </p>
              <SelectInput
                v-else-if="verificationContainer.id == null"
                v-model="verificationJob.media_type"
                :options="optionStore.mediaOptions"
                option-value="name"
                option-label="name"
              />
              <SelectInput
                v-else
                v-model="verificationContainer.media_type"
                :options="optionStore.mediaOptions"
                option-value="name"
                option-label="name"
              />
            </div>

            <div class="col-xs-6 col-sm-12 q-mb-xs-sm q-mb-lg-lg verification-container-info-details">
              <label class="text-h6 q-mb-xs">
                Container Size
              </label>
              <p
                v-if="!editMode"
                class="outline"
              >
                {{ verificationContainer.id == null ? verificationJob.container_size : verificationContainer.container_size }}
              </p>
              <SelectInput
                v-else-if="verificationContainer.id == null"
                v-model="verificationJob.container_size"
                :options="optionStore.containerOptions"
                option-value="name"
                option-label="name"
              />
              <SelectInput
                v-else
                v-model="verificationContainer.container_size"
                :options="optionStore.containerOptions"
                option-value="name"
                option-label="name"
              />
            </div>

            <div class="col-xs-6 col-sm-12 verification-container-info-details">
              <label class="text-h6 q-mb-xs">
                Container Type
              </label>
              <p v-if="verificationJob.type == 1 || !editMode">
                {{ verificationContainer.id == null ? verificationJob.container_type : verificationContainer.container_type }}
              </p>
              <SelectInput
                v-else
                v-model="verificationContainer.container_type"
                :options="optionStore.containerTypes"
                option-value="name"
                option-label="name"
              />
            </div>
          </div>

          <div
            v-if="currentScreenSize !== 'xs' && editMode"
            class="row q-pl-sm-md q-pl-lg-none q-mt-md-sm"
          >
            <q-space class="divider q-my-sm" />

            <div class="col-6 q-pr-xs-xs">
              <q-btn
                no-caps
                unelevated
                color="accent"
                label="Save Edits"
                class="full-width text-body1"
                @click="verificationContainer.id == null ? updateVerificationJob() : updateVerificationContainer()"
                :disabled="verificationJob.status == 'Paused'"
              />
            </div>
            <div class="col-6 q-pl-xs-xs">
              <q-btn
                no-caps
                unelevated
                outline
                color="accent"
                label="Cancel"
                class="full-width text-body1"
                @click="verificationContainer.id == null ? cancelJobEdit() : cancelContainerEdit()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- mobile compressed container info -->
    <div
      v-if="currentScreenSize == 'xs' && scrollPosition > 165"
      class="verification-container-info-compressed row"
    >
      <div class="col-12 flex items-center q-mb-xs">
        <MoreOptionsMenu
          :options="currentScreenSize !== 'xs' ? [{ text: 'Edit' }] : [{ text: 'Edit' }, { text: 'Print Job' }]"
          class="q-mr-sm"
          @click="handleOptionMenu"
        />
        <h1 class="text-h4 text-bold">
          {{ verificationJob.type == 2 ? verificationContainer.title : `Job: ${verificationJob.id}` }}
        </h1>
      </div>
      <div class="col-12 verification-container-info-compressed-list">
        <div class="verification-container-info-details-compressed">
          <label class="text-body1">
            Barcode
          </label>
          <p class="text-body1">
            {{ verificationContainer.id }}
            &nbsp;
          </p>
        </div>
        <div class="verification-container-info-details-compressed">
          <label class="text-body1">
            Owner
          </label>
          <p class="text-body1">
            {{ verificationContainer.id == null ? verificationJob.owner : verificationContainer.owner }}
          </p>
        </div>
        <div class="verification-container-info-details-compressed">
          <label class="text-body1">
            Media Type
          </label>
          <p class="text-body1">
            {{ verificationContainer.id == null ? verificationJob.media_type : verificationContainer.media_type }}
          </p>
        </div>
        <div class="verification-container-info-details-compressed">
          <label class="text-body1">
            Container Size
          </label>
          <p class="text-body1">
            {{ verificationContainer.id == null ? verificationJob.container_size : verificationContainer.container_size }}
          </p>
        </div>
        <div class="verification-container-info-details-compressed">
          <label class="text-body1">
            Container Type
          </label>
          <p class="text-body1">
            {{ verificationContainer.id == null ? verificationJob.container_type : verificationContainer.container_type }}
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-8 col-xl-9 verification-container-scan">
      <div class="row items-center q-mb-xs-md q-mb-sm-lg">
        <div class="col-auto">
          <MoreOptionsMenu
            :options="currentScreenSize !== 'xs' ? [{ text: 'Print Job' }] : [{ text: 'Add Items', disabled: verificationJob.status == 'Paused' }, { text: 'Delete Items', disabled: selectedContainerItems.length == 0 || verificationJob.status == 'Paused' }]"
            class="q-mr-sm"
            @click="handleOptionMenu"
          />
        </div>

        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-xs-auto q-ml-sm-sm">
          <span class="outline text-h6">
            {{ verificationJob.type == 1 ? verificationJob.items.length : verificationContainer.items.length }} Items
          </span>
        </div>

        <div
          v-if="verificationJob.type == 1 && currentScreenSize !== 'xs'"
          class="col-auto q-ml-auto"
        >
          <!-- if user is on last non tray item we display a verify button instead of a scan button -->
          <q-btn
            no-caps
            unelevated
            color="accent"
            :label="isLastItemToBeScanned ? 'Verifiy Item' : verificationContainer.id == null ? 'Scan Item' : 'Next Item'"
            class="text-body1"
            :disabled="verificationJob.status == 'Paused' || allItemsVerified"
            @click="isLastItemToBeScanned ? validateItemBarcode(verificationContainer.id) : showScanOverlay = !showScanOverlay"
          />
        </div>
      </div>

      <div
        v-if="currentScreenSize !== 'xs'"
        class="row q-mb-xs-lg"
      >
        <div class="col-xs-12 col-md-auto flex no-wrap justify-between q-mb-xs-md q-mb-md-none q-mr-md-auto">
          <q-btn
            no-caps
            unelevated
            icon="add"
            color="accent"
            label="Add Item"
            class="btn-no-wrap text-body1 q-mr-sm-md"
            :disabled="verificationJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to add an item?'"
          />
          <q-btn
            no-caps
            unelevated
            icon="mdi-delete"
            color="negative"
            label="Delete"
            class="btn-no-wrap text-body1"
            :disabled="selectedContainerItems.length == 0 || verificationJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to delete selected items?'"
          />
        </div>

        <div
          v-if="currentScreenSize !== 'xs'"
          class="col-xs-12 col-md-auto flex justify-between"
        >
          <q-btn
            no-caps
            unelevated
            outline
            :icon="verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
            color="accent"
            :label="verificationJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'"
            class="btn-no-wrap text-body1"
            @click="verificationJob.status !== 'Paused' ? updateVerificationJobStatus('Paused') : updateVerificationJobStatus('Running')"
          />
          <q-btn
            no-caps
            unelevated
            icon="check"
            color="positive"
            label="Complete Job"
            class="btn-no-wrap text-body1 q-ml-sm"
            :class="currentScreenSize == 'xs' ? 'full-width' : ''"
            :outline="!allItemsVerified || verificationJob.status == 'Paused'"
            :disabled="!allItemsVerified || verificationJob.status == 'Paused'"
            @click="showConfirmation = 'Are you sure you want to complete the job?'"
          />
        </div>
      </div>

      <div class="row q-mb-xs-xl q-mb-sm-none">
        <div class="col-12 q-mb-xs-md q-mb-sm-none">
          <EssentialTable
            :table-columns="verificationTableColumns"
            :table-data="verificationJob.type == 2 ? verificationContainer.items : verificationJob.items"
            :disable-table-reorder="true"
            :hide-table-rearrange="true"
            :enable-selection="true"
            @selected-data="selectedContainerItems = $event"
          >
            <template #table-td="{ props, colName, value }">
              <span
                v-if="colName == 'id' && verificationJob.type == 2"
                :class="props.row.verified == false ? 'disabled' : ''"
              >
                {{ value }}
              </span>
              <span
                v-else-if="colName == 'id' && verificationJob.type == 1"
                :class="props.row.verified == true || verificationContainer.id == props.row.id ? '' : 'disabled'"
              >
                {{ value }}
              </span>

              <span
                v-if="colName == 'verified'"
                class="text-bold"
                :class="value == true ? 'text-positive' : value == 'not found' ? 'text-negative' : ''"
              >
                {{ value == true ? 'Item Verified' : value == 'not found' ? 'Item Not Found' : '' }}
                <q-icon
                  v-if="value == true"
                  name="mdi-check-circle"
                  color="positive"
                  size="25px"
                  class="text-bold q-ml-xs"
                />
                <q-icon
                  v-else-if="value == 'not found'"
                  name="close"
                  color="negative"
                  size="25px"
                  class="text-bold q-ml-xs"
                />
              </span>
            </template>
          </EssentialTable>
        </div>
      </div>
    </div>

    <!-- mobile actions menu -->
    <div
      v-if="currentScreenSize == 'xs'"
      class="verification-container-mobile-menu"
    >
      <template v-if="editMode">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Save Edits"
          class="full-width text-body1"
          @click="verificationContainer.id == null ? updateVerificationJob() : updateVerificationContainer()"
          :disabled="verificationJob.status == 'Paused'"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          outline
          color="accent"
          label="Cancel"
          class="full-width text-body1"
          @click="verificationContainer.id == null ? cancelJobEdit() : cancelContainerEdit()"
        />
      </template>

      <template v-else>
        <q-btn
          no-caps
          unelevated
          outline
          :icon="verificationJob.status !== 'Paused' ? 'mdi-pause' : 'mdi-play'"
          color="accent"
          :label="verificationJob.status !== 'Paused' ? 'Pause Job' : 'Resume Job'"
          class="btn-no-wrap text-body1 full-width"
          @click="verificationJob.status !== 'Paused' ? updateVerificationJobStatus('Paused') : updateVerificationJobStatus('Running')"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          no-caps
          unelevated
          icon="check"
          color="positive"
          label="Complete Job"
          class="btn-no-wrap text-body1 full-width"
          :outline="!allItemsVerified || verificationJob.status == 'Paused'"
          :disabled="!allItemsVerified || verificationJob.status == 'Paused'"
          @click="showConfirmation = 'Are you sure you want to complete the job?'"
        />
      </template>
    </div>
  </div>

  <!-- confirmation modal -->
  <PopupModal
    v-if="showConfirmation !== null"
    :title="'Confirm'"
    :text="showConfirmation"
    @reset="showConfirmation = null"
  />

  <!-- scan overlay (NON TRAY ONLY) -->
  <PopupModal
    v-if="showScanOverlay"
    ref="scanOverlayModal"
    :title="'Scan Barcode'"
    :show-actions="false"
    @reset="showScanOverlay = false"
  >
    <template #modal-content>
      <div class="flex justify-center q-pb-lg">
        <q-btn
          class="text-h4 q-pa-xs-lg q-pa-md-xl"
          no-caps
          unelevated
          color="secondary"
          label="Waiting For Scan..."
          @click="triggerBarcodeScan('00924891234')"
        />
      </div>
    </template>
  </PopupModal>
</template>

<script setup>
import { ref, toRaw, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVerificationStore } from '@/stores/verification-store'
import { useOptionStore } from '@/stores/option-store'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useScrollPosition } from '@/composables/useScrollPosition.js'
import BarcodeBox from '@/components/BarcodeBox.vue'
import EssentialTable from '@/components/EssentialTable.vue'
import SelectInput from '@/components/SelectInput.vue'
import PopupModal from '@/components/PopupModal.vue'
import MoreOptionsMenu from '@/components/MoreOptionsMenu.vue'

const router = useRouter()
const route = useRoute()

// Composables
const { compiledBarCode } = useBarcodeScanHandler()
const { currentScreenSize } = useCurrentScreenSize()
const { scrollPosition, scrollToTop } = useScrollPosition()

// Store Data
const optionStore = useOptionStore()
const {
  getVerificationTray,
  getVerificationNonTray,
  verifyTrayItemBarcode,
  verifyNonTrayItemBarcode,
  patchVerificationJob,
  patchVerificationTray,
  patchVerificationNonTray
} = useVerificationStore()
const { allItemsVerified, verificationJob, originalVerificationJob, verificationContainer, originalVerificationContainer } = storeToRefs(useVerificationStore())

// Local Data
const verificationTableColumns = ref([
  {
    name: 'id',
    field: 'id',
    label: 'Barcode',
    align: 'left',
    sortable: true
  },
  {
    name: 'verified',
    field: 'verified',
    label: '',
    align: 'right',
    sortable: false
  }
])
const selectedContainerItems = ref([])
const showConfirmation = ref(null)
const showScanOverlay = ref(false)
const scanOverlayModal = ref(null)
const editMode = ref(false)
const isLastItemToBeScanned = computed(() => {
  if (verificationJob.value.type == 2) {
    return false
  } else {
    const itemsToBeScanned = verificationJob.value.items.filter(item => item.verified == false)
    return itemsToBeScanned.length == 1 ? true : false
  }
})
const scanAllowed = computed(() => {
  if (verificationJob.value.type == 2) {
    // always allow scanning for tray jobs
    return true
  } else if (verificationJob.value.type == 1 && showScanOverlay.value) {
    // only allow scanning on non tray jobs when user triggers scanOverlay
    return true
  } else {
    return false
  }
})

// Logic
watch(compiledBarCode, (newBarcode) => {
  if (scanAllowed.value == true) {
    triggerBarcodeScan(newBarcode)
  }
})
const triggerBarcodeScan = async (barcode) => {
  // if a barcode scan is triggered and the user hasnt scanned a tray yet we get that scanned containers data
  if (verificationJob.value.type == 2  && verificationContainer.value.id == null) {
    getVerificationTray(barcode)

    router.push({
      name: 'verification-container',
      params: {
        jobId: verificationJob.value.id,
        containerId: verificationContainer.value.id
      }
    })
  } else if (verificationJob.value.type == 1 && verificationContainer.value.id == null) {
    // if a barcode scan is triggered on a non tray job we can assume the user is trying to scan a non tray container item
    getVerificationNonTray(barcode)

    // close the overlay modal using a component reference
    scanOverlayModal.value.hideModal()
  } else if (verificationJob.value.type == 1 && verificationContainer.value.id !== null) {
    // if a barcode scan is triggered on a non tray job when we have a scanned container item
    // we can assume the user is trying to scan a new non tray container and verify the current scanned container
    await validateItemBarcode(verificationContainer.value.id)

    getVerificationNonTray(barcode)

    // close the overlay modal using a component reference
    scanOverlayModal.value.hideModal()
  } else {
    // scan is related to tray item verification
    validateItemBarcode(barcode)
  }
}
const validateItemBarcode = async (barcode) => {
  try {
    // if were in a tray job then we check if the barcode exists in the tray container otherwise we add it as a new barcode
    if (verificationJob.value.type == 2) {
      if (verificationContainer.value.items.some(item => item.id == barcode)) {
        await verifyTrayItemBarcode(barcode)
      } else {
        verificationContainer.value.items.push({ id: barcode, verified: false })
      }
    } else {
    // if were in a nontray job then we check if the barcode exists in the nontray job items otherwise we add it as a new barcode
      if (verificationJob.value.items.some(item => item.id == barcode)) {
        await verifyNonTrayItemBarcode(barcode)
      } else {
        verificationJob.value.items.push({ id: barcode, verified: false })
      }
    }
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}

const handleOptionMenu = (option) => {
  if (option.text == 'Edit') {
    if (currentScreenSize.value == 'xs' && scrollPosition.value > 165) {
      scrollToTop()
    }

    editMode.value = true
  } else if (option.text == 'Print Job') {
    return
  } else if (option.text == 'Add Items') {
    showConfirmation.value = 'Are you sure you want to add an item?'
  } else if (option.text == 'Delete Items') {
    showConfirmation.value = 'Are you sure you want to delete selected items?'
  }
}
const cancelJobEdit = () => {
  verificationJob.value = { ...toRaw(originalVerificationJob.value) }
  editMode.value = false
}
const cancelContainerEdit = () => {
  verificationContainer.value = { ...toRaw(originalVerificationContainer.value) }
  editMode.value = false
}

const updateVerificationJobStatus = async (status) => {
  try {
    await patchVerificationJob({ status })

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}
const updateVerificationJob = async () => {
  try {
    await patchVerificationJob()

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  } finally {
    editMode.value = false
  }
}
const updateVerificationContainer = async () => {
  try {
    if (verificationJob.value.type == 2) {
      await patchVerificationTray()
    } else {
      await patchVerificationNonTray()
    }

    //TODO: display success alert
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  } finally {
    editMode.value = false
  }
}

defineExpose({
  showScanOverlay,
  validateItemBarcode
})
</script>

<style lang="scss" scoped>
.verification-container {
  width: 100%;
  height: auto;

  &-info {
    border-right: 1px solid;
    border-color: $secondary;
    padding: 3rem;
    transition: all .4s ease-in-out;

    @media (max-width: $breakpoint-md-max) {
      border-right: none;
      padding: 1.5rem;
      padding-bottom: 0;
    }

    @media (max-width: $breakpoint-sm-min) {
      padding: 1rem;
      padding-bottom: 0;
    }

    &-compressed {
      position: fixed;
      width: 100%;
      top: 95px;
      z-index: 1000;
      padding: 8px 1rem;
      background-color: $color-white;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0px 10px rgba(0, 0, 0, 0.12);
      }

      &-list {
        overflow: auto;
        white-space: nowrap;
      }
    }

    &-details {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      @media (max-width: $breakpoint-md-max) {
        align-items: flex-start;
        padding-left: 1rem;
      }

      @media (max-width: $breakpoint-sm-min) {
        align-items: flex-start;

        &:nth-child(odd) {
          padding-left: 0;
          padding-right: 4px;
        }

        &:nth-child(even) {
          padding-left: 4px;
          padding-right: 0;
        }
      }

      & label {
        position: relative;

        .q-btn {
          position: absolute;
          padding: .4rem;
        }
      }

      &-compressed {
        display: inline-flex;
        flex-flow: column nowrap;
        padding: 4px 8px;
        border: 1px solid $color-gray;
        border-radius: 3px;

        &:not(:last-child) {
          margin-right: 5px;
        }
      }
    }
  }

  &-scan {
    & > div:first-child {
      padding: 0 1.5rem;
      padding-top: 3rem;

      @media (max-width: $breakpoint-sm-min) {
        padding: 0 1rem;
        padding-top: 2rem;
      }
    }
    & > div:nth-child(2) {
      padding: 0 1.5rem;

      @media (max-width: $breakpoint-sm-min) {
        padding: 0 1rem;
      }
    }
  }

  &-mobile-menu {
    position: fixed;
    bottom: 51px;
    right: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background-color: $color-white;
    z-index: 2000;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1), 0 0px 10px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>