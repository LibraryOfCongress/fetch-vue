<template>
  <PopupModal
    :show-actions="false"
    @reset="emit('hide')"
    aria-label="manualRequestModal"
  >
    <template #header-content="{ hideModal }">
      <q-card-section class="row items-center q-pb-none">
        <h2 class="text-h6 text-bold">
          {{ type == 'manual' ? 'Create Manual Request' : 'Import Request File' }}
        </h2>

        <q-btn
          icon="close"
          flat
          round
          dense
          class="q-ml-auto"
          @click="hideModal"
          aria-label="close"
        />
      </q-card-section>
    </template>
    <template #main-content>
      <q-card-section
        v-if="type == 'manual'"
        class="row"
      >
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Item Barcode <span class="text-caption text-negative">(Required)</span>
            </label>
            <TextInput
              v-model="manualRequestForm.barcode"
              placeholder="Enter or Scan Item Barcode"
              @focus="allowItemBarcodeScan = true"
              @blur="allowItemBarcodeScan = false"
            />
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              External Request Id
            </label>
            <TextInput
              v-model="manualRequestForm.external_request_id"
              placeholder="Enter External Request Id"
            />
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Requestor Name <span class="text-caption text-negative">(Required)</span>
            </label>
            <TextInput
              v-model="manualRequestForm.requestor_name"
              placeholder="Enter Requestor Nanme"
            />
          </div>
        </div>
        <!-- TODO set this to user admin privelages -->
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Priority
            </label>
            <SelectInput
              v-model="manualRequestForm.priority"
              :options="buildings"
              option-type="buildings"
              option-value="id"
              option-label="name"
              :placeholder="'Select Priority'"
            />
          </div>
        </div>
        <div class="col-12 q-mb-md">
          <div class="form-group">
            <label class="form-group-label">
              Select Request Type <span class="text-caption text-negative">(Required)</span>
            </label>
            <SelectInput
              v-model="manualRequestForm.request_type_id"
              :options="buildings"
              option-type="buildings"
              option-value="id"
              option-label="name"
              :placeholder="'Select Request Type'"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="form-group">
            <label class="form-group-label">
              Delivery Location <span class="text-caption text-negative">(Required)</span>
            </label>
            <SelectInput
              v-model="manualRequestForm.building_id"
              :options="buildings"
              option-type="buildings"
              option-value="id"
              option-label="name"
              :placeholder="'Select Delivery Location'"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        v-else
        class="row"
      >
        <div class="col-grow">
          <p class="text-body2">
            Support files: .xls, .xlsx, .uslm, .pdf, .docx
          </p>
        </div>
        <div class="col-auto flex justify-end">
          <a
            tabindex="0"
            class="link text-body2 text-accent"
            @click="null"
          >
            Click to Download Template
          </a>
        </div>

        <div class="col-12 q-mt-md">
          <FileUploadInput
            :allow-multiple-files="false"
            :allowed-file-types="['.xls', '.xlsx', '.uslm', '.pdf', '.docx']"
            input-class="q-py-xs-md q-px-xs-lg q-py-sm-xl q-px-sm-lg"
            @file-change="requestFile = $event"
          />
        </div>
      </q-card-section>
    </template>

    <template #footer-content="{ hideModal }">
      <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Submit"
          class="text-body1 full-width"
          :loading="appActionIsLoadingData"
          :disabled="!isCreateRequestjobFormValid"
          @click="createRequestJob(); hideModal()"
        />

        <q-space class="q-mx-xs" />

        <q-btn
          outline
          no-caps
          label="Cancel"
          class="text-body1 full-width"
          @click="hideModal"
        />
      </q-card-section>
    </template>
  </PopupModal>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { useGlobalStore } from '@/stores/global-store'
import { useOptionStore } from '@/stores/option-store'
// import { useRequestStore } from '@/stores/request-store'
import { storeToRefs } from 'pinia'
import { useBarcodeScanHandler } from '@/composables/useBarcodeScanHandler.js'
import PopupModal from '@/components/PopupModal.vue'
import TextInput from '@/components/TextInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import FileUploadInput from '@/components/FileUploadInput.vue'

// Props
const mainProps = defineProps({
  type: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['hide'])

// Composables
const { compiledBarCode } = useBarcodeScanHandler()

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { buildings } = storeToRefs(useOptionStore())
// const { postRequestJob } = useRequestStore()

// Local Data
const requestFile = ref([])
const manualRequestForm = ref({
  barcode: null,
  external_request_id: null,
  requestor_name: null,
  request_type_id: null,
  building_id: null,
  priority: null
})
const isCreateRequestjobFormValid = computed(() => {
  let formIsValid = false
  if (mainProps.type == 'manual') {
    // if any value in our form is null or empty form is not valid except for priority since thats optional
    const optionalFields = [
      'external_request_id',
      'priority'
    ]
    formIsValid = Object.keys(manualRequestForm.value).every(key => optionalFields.includes(key) || (manualRequestForm.value[key] !== null && manualRequestForm.value[key] !== ''))
  } else {
    formIsValid = requestFile.value.length == 0 ? false : true
  }
  return formIsValid
})
const allowItemBarcodeScan = ref(false)

// Logic
const handleAlert = inject('handle-alert')

watch(compiledBarCode, (barcode) => {
  if (barcode !== '' && allowItemBarcodeScan.value) {
    // assigns scanned barcode to item barcode form input
    manualRequestForm.value.barcode = barcode
  }
})

const createRequestJob = async () => {
  try {
    appActionIsLoadingData.value = true
    // TODO setup api call to sumbit request job by type
    if (mainProps.type == 'manual') {
      console.log(manualRequestForm.value)
    } else {
      console.log(requestFile.value)
    }
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appActionIsLoadingData.value = false
  }
}
</script>

<style lang="scss" scoped>
</style>