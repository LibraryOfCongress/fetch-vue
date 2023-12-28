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
        class="text-h3 q-pa-xl"
        no-caps
        unelevated
        color="secondary"
        label="Scan Barcode"
        @click="triggerBarcodeScan('CH220987')"
      />
    </div>
  </div>

  <!-- container display -->
  <div
    v-else
    class="row verification-container flex-lg-grow"
  >
    <div class="col-12 col-lg-4 col-xl-3 verification-container-info">
      <div class="row">
        <div class="col-12">
          <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-lg">
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
          <div class="verification-container-info-details q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Owner
              <q-btn
                no-caps
                flat
                icon="mdi-square-edit-outline"
                color="accent"
                label="Edit"
                class="btn-no-wrap text-caption"
                @click="editOwner = true"
              />
            </label>
            <p
              v-if="!editOwner"
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

          <div class="verification-container-info-details q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Media Type
              <q-btn
                no-caps
                flat
                icon="mdi-square-edit-outline"
                color="accent"
                label="Edit"
                class="btn-no-wrap text-caption"
                @click="editMediaType = true"
              />
            </label>
            <p
              v-if="!editMediaType"
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

          <div class="verification-container-info-details q-mb-xs-sm q-mb-lg-lg">
            <label class="text-h6 q-mb-xs">
              Container Size
              <q-btn
                no-caps
                flat
                icon="mdi-square-edit-outline"
                color="accent"
                label="Edit"
                class="btn-no-wrap text-caption"
                @click="editContainerSize = true"
              />
            </label>
            <p
              v-if="!editContainerSize"
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

          <div class="verification-container-info-details">
            <label class="text-h6 q-mb-xs">
              Container Type
              <q-btn
                v-if="verificationJob.type == 2"
                no-caps
                flat
                icon="mdi-square-edit-outline"
                color="accent"
                label="Edit"
                class="btn-no-wrap text-caption"
                @click="editContainerType = true"
              />
            </label>
            <p v-if="!editContainerType">
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

          <div
            v-if="editContainerMode"
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

    <div class="col-12 col-lg-8 col-xl-9 verification-container-scan">
      <div class="row items-center q-mb-xs-md q-mb-sm-lg">
        <div class="col-auto">
          <MoreOptionsMenu
            :options="[{ text: 'Print Job', value: 1 }]"
            class="q-mr-sm"
          />
        </div>

        <div class="col-auto">
          <h2 class="text-h4 text-bold">
            Scan Items
          </h2>
        </div>

        <div class="col-auto q-ml-sm">
          <span class="outline text-h6">
            {{ verificationContainer.items.length }} Items
          </span>
        </div>

        <div
          v-if="verificationJob.type == 1"
          class="col-auto q-ml-auto"
        >
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Scan Item"
            class="text-body1"
            :disabled="verificationJob.status == 'Paused' || allItemsVerified"
            @click="showScanOverlay = !showScanOverlay"
          />
        </div>
      </div>

      <div class="row q-mb-xs-lg">
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

        <div class="col-xs-12 col-md-auto flex justify-between">
          <q-btn
            v-if="verificationJob.status !== 'Paused'"
            no-caps
            unelevated
            outline
            icon="mdi-pause"
            color="accent"
            label="Pause Job"
            class="btn-no-wrap text-body1"
            :class="currentScreenSize == 'xs' ? 'full-width q-mb-md' : ''"
            @click="updateVerificationJobStatus('Paused')"
          />
          <q-btn
            v-else
            no-caps
            unelevated
            outline
            icon="mdi-play"
            color="accent"
            label="Resume Job"
            class="btn-no-wrap text-body1"
            :class="currentScreenSize == 'xs' ? 'full-width q-mb-md' : ''"
            @click="updateVerificationJobStatus('Running')"
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

      <div class="row">
        <div class="col-12">
          <EssentialTable
            :table-columns="verificationTableColumns"
            :table-data="verificationJob.type == 2 ? verificationContainer.items : verificationJob.items"
            :disable-table-reorder="true"
            :hide-table-filter="true"
            :enable-selection="true"
            @selected-data="selectedContainerItems = $event"
          >
            <template #table-td="{ props, colName, value }">
              <span
                v-if="colName == 'id'"
                :class="props.row.verified == false ? 'disabled' : ''"
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
    :title="'Scan Item'"
    :show-actions="false"
    @reset="showScanOverlay = false"
  >
    <template #modal-content>
      <div class="flex justify-center q-pb-lg">
        <q-btn
          class="text-h3 q-pa-xl"
          no-caps
          unelevated
          color="secondary"
          label="Scan Barcode"
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

// Store Data
const optionStore = useOptionStore()
const {
  getVerificationTray,
  getVerificationNonTrayAndVerify,
  verifyTrayItemBarcode,
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
const editOwner = ref(false)
const editContainerType = ref(false)
const editContainerSize = ref(false)
const editMediaType = ref(false)
const showConfirmation = ref(null)
const showScanOverlay = ref(false)
const scanOverlayModal = ref(null)
const editContainerMode = computed(() => {
  if (editOwner.value || editContainerType.value || editContainerSize.value || editMediaType.value) {
    return true
  } else {
    return false
  }
})

// Logic
watch(compiledBarCode, (newBarcode) => {
  triggerBarcodeScan(newBarcode)
})
const triggerBarcodeScan = (barcode) => {
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
  } else {
    // scan is related to tray/non tray item verification
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
        await getVerificationNonTrayAndVerify(barcode)
      } else {
        verificationJob.value.items.push({ id: barcode, verified: false })
      }

      // close the overlay modal using a component reference
      scanOverlayModal.value.hideModal()
    }
  } catch (error) {
    // TODO: replace error with popup alert
    console.log(error)
  }
}

const cancelJobEdit = () => {
  verificationJob.value = { ...toRaw(originalVerificationJob.value) }
  editOwner.value = false
  editContainerType.value = false
  editContainerSize.value = false
  editMediaType.value = false
}
const cancelContainerEdit = () => {
  verificationContainer.value = { ...toRaw(originalVerificationContainer.value) }
  editOwner.value = false
  editContainerType.value = false
  editContainerSize.value = false
  editMediaType.value = false
}

const updateVerificationJobStatus = async (status) => {
  try {
    verificationJob.value.status = status
    await patchVerificationJob()

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
    editOwner.value = false
    editContainerType.value = false
    editContainerSize.value = false
    editMediaType.value = false
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
    editOwner.value = false
    editContainerType.value = false
    editContainerSize.value = false
    editMediaType.value = false
  }
}
</script>

<style lang="scss" scoped>
.verification-container {
  &-info {
    border-right: 1px solid;
    border-color: $secondary;
    padding: 3rem;

    @media (max-width: $breakpoint-md-max) {
      border-right: none;
      padding: 3rem 1.5rem;
      padding-bottom: 0;
    }

    @media (max-width: $breakpoint-sm-min) {
      padding: 1rem;
      padding-bottom: 0;
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
        padding-left: 0rem;
      }

      & label {
        position: relative;

        .q-btn {
          position: absolute;
          padding: .4rem;
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
}
</style>