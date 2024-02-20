<template>
  <div class="building">
    <div class="row">
      <div class="col-auto">
        <h1 class="text-h4 text-bold">
          Admin Dashboard
        </h1>
      </div>
    </div>

    <q-space class="divider q-my-xs-sm q-my-sm-md q-my-md-lg " />

    <div class="row q-mb-lg">
      <div class="col-auto">
        <h1 class="text-h4 text-bold q-mb-xs-md q-mb-sm-none">
          Buildings
        </h1>
      </div>

      <div class="col-auto q-ml-sm-auto">
        <q-btn
          no-caps
          unelevated
          outline
          icon-right="arrow_drop_down"
          label="Add New"
          class="text-body1 q-mr-sm"
        >
          <q-menu fit>
            <q-list>
              <q-item
                v-for="(label, i) in addNewOptions"
                :key="i"
                clickable
                v-close-popup
                @click="showBuildingForm = !showBuildingForm; buildingFormTitle = label;"
              >
                <q-item-section>
                  <q-item-label>
                    <q-icon
                      :name="'add'"
                      size="25px"
                    />
                    <span class="q-ml-xs">
                      {{ label }}
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          no-caps
          unelevated
          icon-right="arrow_drop_down"
          color="accent"
          label="Location Hierarchy"
          class="text-body1"
        >
          <q-menu fit>
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="showBulkUploadForm = !showBulkUploadForm;"
              >
                <q-item-section>
                  <q-item-label>
                    <span>
                      Bulk Upload
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="showBuildingForm = !showBuildingForm;"
              >
                <q-item-section>
                  <q-item-label>
                    <span>
                      Manual
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div class="row">
      <div
        v-if="buildings.length == 0"
        class="col-auto"
      >
        <p class="text-h6">
          No Buildings Found...
        </p>
      </div>
      <template v-else>
        <div
          v-for="building in buildings"
          :key="building.id"
          class="col-xs-12 col-sm-auto q-pa-xs-xs q-pa-lg-sm"
        >
          <q-card
            flat
            bordered
            class="building-card"
            @click="loadBuildingDetails(building.id)"
          >
            <q-card-section class="q-pa-md">
              <div class="building-card-details q-mb-xs">
                <p class="text-h6">
                  {{ building.name }}
                </p>
              </div>

              <div class="building-card-details q-mb-xs">
                <label class="text-body1">Modules:</label>
                <p class="text-body1">
                  {{ building.modules.length == 0 ? 'N/A' : building.modules.length }}
                </p>
              </div>

              <div class="building-card-details">
                <p class="text-body1 text-secondary">
                  {{ building.available_shelves }} Available Shelves
                </p>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>

    <!-- New Building Form Modal -->
    <PopupModal
      v-if="showBuildingForm"
      :title="buildingFormTitle == '' ? 'Create Location Hierarchy' : `Add New ${buildingFormTitle}`"
      @reset="resetBuildingForm"
    >
      <template #main-content>
        <q-card-section class="row items-end">
          <div
            v-if="renderBuildingFormField(1)"
            class="form-group q-mb-md"
          >
            <label class="form-group-label">
              Building
            </label>
            <TextInput
              v-if="buildingFormTitle == 'Building'"
              v-model="buildingForm.building"
              placeholder="Please Type Building Name"
            />
            <SelectInput
              v-else
              v-model="buildingForm.building"
              :options="buildings"
              option-value="id"
              option-label="name"
              :placeholder="'Select Building'"
              @update:model-value="handleBuildingFormChange('Building')"
            />
          </div>

          <div
            v-if="renderBuildingFormField(2)"
            class="form-group q-mb-md"
          >
            <label class="form-group-label">
              Module
            </label>
            <TextInput
              v-if="buildingFormTitle == 'Module'"
              v-model="buildingForm.module"
              placeholder="Please Type Module Name"
              :disabled="buildingForm.building == ''"
            />
            <SelectInput
              v-else
              v-model="buildingForm.module"
              :options="selectedBuildingModules"
              option-value="id"
              option-label="name"
              :placeholder="'Select Module'"
              :disabled="selectedBuildingModules.length == 0"
              @update:model-value="handleBuildingFormChange('Module')"
            />
          </div>

          <div
            v-if="renderBuildingFormField(3)"
            class="col-xs-12 col-sm-6 q-pr-xs"
          >
            <div class="form-group">
              <label class="form-group-label">
                Aisle
              </label>
              <TextInput
                v-if="buildingFormTitle == 'Aisle'"
                v-model="buildingForm.aisle"
                placeholder="Please Type Aisle Name"
                :disabled="buildingForm.building == ''"
              />
              <SelectInput
                v-else
                v-model="buildingForm.aisle"
                :options="selectedBuildingOrModuleAisles"
                option-value="id"
                option-label="id"
                :placeholder="'Select Aisle'"
                :disabled="selectedBuildingOrModuleAisles.length == 0"
                @update:model-value="handleBuildingFormChange('Aisle')"
              />
            </div>
          </div>
          <div
            v-if="renderBuildingFormField(4)"
            class="col-xs-12 col-sm-6 q-pl-xs q-mt-xs-md q-mt-sm-none"
          >
            <div class="form-group">
              <label class="form-group-label">
                Side
              </label>
              <q-btn-toggle
                v-model="buildingForm.side"
                spread
                no-caps
                unelevated
                toggle-color="accent"
                color="white"
                text-color="black"
                class="form-toggle"
                :style="[ currentScreenSize == 'xs' ? 'height:40px;' : 'height:56px;' ]"
                :options="[
                  {label: 'Left', value: 'left'},
                  {label: 'Right', value: 'right'}
                ]"
              />
            </div>
          </div>

          <div
            v-if="renderBuildingFormField(5)"
            class="form-group q-mt-md"
          >
            <label class="form-group-label">
              Ladder
            </label>
            <TextInput
              v-if="buildingFormTitle == 'Ladder'"
              v-model="buildingForm.ladder"
              placeholder="Please Type Ladder Number"
              :disabled="buildingForm.aisle == ''"
            />
            <SelectInput
              v-else
              v-model="buildingForm.ladder"
              :options="selectedAisleLadders"
              option-value="id"
              option-label="id"
              :placeholder="'Select Ladder'"
              :disabled="selectedAisleLadders.length == 0"
            />
          </div>
        </q-card-section>
      </template>

      <template #footer-content>
        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Create"
            class="text-body1 full-width"
            :disabled="!isBuildingFormValid"
            :loading="isLoading"
            @click="submitBuildingForm"
          >
            <template #loading>
              <q-spinner-bars
                color="white"
                size="1.5rem"
              />
            </template>
          </q-btn>

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="text-body1 full-width"
            @click="resetBuildingForm"
          />
        </q-card-section>
      </template>
    </PopupModal>

    <!-- Bulk Upload Form Modal -->
    <PopupModal
      v-if="showBulkUploadForm"
      title="Bulk Upload File(s)"
      @reset="resetBulkUploadForm"
    >
      <template #main-content>
        <q-card-section class="row items-end">
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
              @file-change="setBulkUploadFile"
            />
          </div>

          <div class="col-12 q-mt-md q-mb-sm">
            <p class="text-body1">
              Select Areas to Upload:
            </p>
          </div>

          <div
            class="form-group q-mb-md"
          >
            <label class="form-group-label">
              Building
            </label>
            <SelectInput
              v-model="buildingForm.building"
              :options="buildings"
              option-value="id"
              option-label="name"
              :placeholder="'Select Building'"
              @update:model-value="handleBuildingFormChange('Building')"
            />
          </div>

          <div
            class="form-group q-mb-md"
          >
            <label class="form-group-label">
              Module
            </label>
            <SelectInput
              v-model="buildingForm.module"
              :options="selectedBuildingModules"
              option-value="id"
              option-label="name"
              :placeholder="'Select Module'"
              :disabled="selectedBuildingModules.length == 0"
              @update:model-value="handleBuildingFormChange('Module')"
            />
          </div>

          <div
            class="col-xs-12 col-sm-6 q-pr-xs"
          >
            <div class="form-group">
              <label class="form-group-label">
                Aisle
              </label>
              <SelectInput
                v-model="buildingForm.aisle"
                :options="selectedBuildingOrModuleAisles"
                option-value="id"
                option-label="id"
                :placeholder="'Select Aisle'"
                :disabled="selectedBuildingOrModuleAisles.length == 0"
                @update:model-value="handleBuildingFormChange('Aisle')"
              />
            </div>
          </div>
          <div
            class="col-xs-12 col-sm-6 q-pl-xs q-mt-xs-md q-mt-sm-none"
          >
            <div class="form-group">
              <label class="form-group-label">
                Side
              </label>
              <q-btn-toggle
                v-model="buildingForm.side"
                spread
                no-caps
                unelevated
                toggle-color="accent"
                color="white"
                text-color="black"
                class="form-toggle"
                :style="[ currentScreenSize == 'xs' ? 'height:40px;' : 'height:56px;' ]"
                :options="[
                  {label: 'Left', value: 'left'},
                  {label: 'Right', value: 'right'}
                ]"
              />
            </div>
          </div>

          <div
            class="form-group q-mt-md"
          >
            <label class="form-group-label">
              Ladder
            </label>
            <SelectInput
              v-model="buildingForm.ladder"
              :options="selectedAisleLadders"
              option-value="id"
              option-label="id"
              :placeholder="'Select Ladder'"
              :disabled="selectedAisleLadders.length == 0"
            />
          </div>
        </q-card-section>
      </template>

      <template #footer-content>
        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            :label="currentScreenSize == 'xs' ? 'Create' : 'Create Hierarchy'"
            class="text-body1 full-width"
            :disabled="!isBulkUploadValid"
            :loading="isLoading"
            @click="submitBulkUploadForm"
          >
            <template #loading>
              <q-spinner-bars
                color="white"
                size="1.5rem"
              />
            </template>
          </q-btn>

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="text-body1 full-width"
            @click="resetBulkUploadForm"
          />
        </q-card-section>
      </template>
    </PopupModal>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import { useBuildingStore } from '@/stores/building-store'
import PopupModal from '@/components/PopupModal.vue'
import SelectInput from '@/components/SelectInput.vue'
import TextInput from '@/components/TextInput.vue'
import FileUploadInput from '@/components/FileUploadInput.vue'

const router = useRouter()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { getBuildingsList } = useBuildingStore()
const { buildings, buildingDetails } = storeToRefs(useBuildingStore())

// Local Data
const isLoading = ref(false)
const buildingFormTitle = ref('')
const buildingForm = ref({
  building: '',
  module: '',
  aisle: '',
  side: 'left',
  ladder: ''
})
const showBuildingForm = ref(false)
const bulkUploadFile = ref(null)
const showBulkUploadForm = ref(false)
const addNewOptions = ref([
  'Building',
  'Module',
  'Aisle',
  'Ladder'
])
const isBuildingFormValid = computed(() => {
  // validate that all needed fields are filled out in the building form
  switch (buildingFormTitle.value) {
  case 'Building':
    if (buildingForm.value.building !== '') {
      return true
    } else {
      return false
    }
  case 'Module':
    if (buildingForm.value.building !== '' && buildingForm.value.module !== '') {
      return true
    } else {
      return false
    }
  case 'Aisle':
    // an isle doesnt need a module to be created it can be made directly on a building
    if (buildingForm.value.building !== '' && buildingForm.value.aisle !== '') {
      return true
    } else {
      return false
    }
  case 'Ladder':
  case '':
    if (buildingForm.value.building !== '' && buildingForm.value.aisle !== '' && buildingForm.value.ladder !== '') {
      return true
    } else {
      return false
    }
  default:
    return false
  }
})
const isBulkUploadValid = computed(() => {
  // validate that all needed fields are filled out in the bulk upload form
  if (bulkUploadFile.value !== null && buildingForm.value.building !== '' && buildingForm.value.aisle !== '' && buildingForm.value.ladder !== '') {
    return true
  } else {
    return false
  }
})
const selectedBuildingModules = computed(() => {
  let modules = []
  if (buildingForm.value.building !== '') {
    modules = buildings.value.find(b => b.id == buildingForm.value.building).modules
  }
  return modules
})
const selectedBuildingOrModuleAisles = computed(() => {
  let aisles = []
  if (buildingForm.value.module !== '') {
    aisles = selectedBuildingModules.value.find(m => m.id == buildingForm.value.module).aisles
  } else if (buildingForm.value.building !== '' && buildings.value.find(b => b.id == buildingForm.value.building).aisles) {
    aisles = buildings.value.find(b => b.id == buildingForm.value.building).aisles
  }
  return aisles
})
const selectedAisleLadders = computed(() => {
  let ladders = []
  if (buildingForm.value.aisle !== '') {
    const ladderTotal = selectedBuildingOrModuleAisles.value.find(a => a.id == buildingForm.value.aisle).ladders
    ladders = [...Array(ladderTotal)].map((n, i) => {
      return { id: i + 1 }
    })
  }
  return ladders
})

// Logic
onMounted(async () => {
  await getBuildingsList()
})

const handleAlert = inject('handle-alert')

const renderBuildingFormField = (section) => {
  // determines if a building form section can be displayed depending on the building form title
  // (ex: if user selects add new building, we will only show section 1 aka Building input)
  switch (buildingFormTitle.value) {
  case 'Building':
    if (section == 1) {
      return true
    } else {
      return false
    }
  case 'Module':
    if (section <= 2) {
      return true
    } else {
      return false
    }
  case 'Aisle':
    if (section <= 3) {
      return true
    } else {
      return false
    }
  case 'Ladder':
    if (section <= 5) {
      return true
    } else {
      return false
    }
  default:
    return true
  }
}
const setBulkUploadFile = (file) => {
  bulkUploadFile.value = file
}
const resetBulkUploadForm = () => {
  bulkUploadFile.value = null
  buildingForm.value = {
    building: '',
    module: '',
    aisle: '',
    side: 'left',
    ladder: ''
  }
  showBulkUploadForm.value = false
}
const resetBuildingForm = () => {
  buildingFormTitle.value = ''
  buildingForm.value = {
    building: '',
    module: '',
    aisle: '',
    side: 'left',
    ladder: ''
  }
  showBuildingForm.value = false
}
const handleBuildingFormChange = (valueType) => {
  // reset the form depending on the edited form field type
  switch (valueType) {
  case 'Building':
    buildingForm.value.module = ''
    buildingForm.value.aisle = ''
    buildingForm.value.side = 'left'
    buildingForm.value.ladder = ''
    return
  case 'Module':
    buildingForm.value.aisle = ''
    buildingForm.value.side = 'left'
    buildingForm.value.ladder = ''
    return
  case 'Aisle':
    buildingForm.value.side = 'left'
    buildingForm.value.ladder = ''
    return
  }
}
const submitBuildingForm = async () => {
  // TODO: Setup endpoints needed to send the different building properties to the location hierarchy
  try {
    isLoading.value = true
    console.log('creating building/fields', buildingForm.value)

    // mock api request success (remove once api setup)
    await new Promise(resolve => setTimeout(() => {
      handleAlert({
        type: 'success',
        text: 'New Building Data Added.',
        autoClose: true
      })
      resetBuildingForm()
      isLoading.value = false
      resolve
    }, 2000))
  } catch (err) {
    handleAlert({
      type: 'error',
      text: err,
      autoClose: true
    })
  }
}
const submitBulkUploadForm = async () => {
  // TODO: Setup endpoints needed to send the different building properties to the location hierarchy
  try {
    isLoading.value = true
    console.log('uploading building/fields using file', bulkUploadFile.value, buildingForm.value)

    // mock api request success (remove once api setup)
    await new Promise(resolve => setTimeout(() => {
      handleAlert({
        type: 'success',
        text: 'Bulk Upload Successfully Processed.',
        autoClose: true
      })
      resetBulkUploadForm()
      isLoading.value = false
      resolve
    }, 2000))
  } catch (err) {
    handleAlert({
      type: 'error',
      text: err,
      autoClose: true
    })
  }
}

const loadBuildingDetails = (buildingId) => {
  // Since we already load all the building and its details on mount we can directly set the building in store
  buildingDetails.value = buildings.value.find(b => b.id == buildingId)

  router.push({
    name: 'admin-building-view',
    params: {
      buildingId: buildingDetails.value.name
    }
  })
}
</script>

<style lang="scss" scoped>
.building {
  &-card {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    min-width: 250px;
    padding: 0;
    border-color: $color-black;
    border-radius: 4px;
    transition: 0.3s ease;

    &:hover {
      color: $accent;
      border-color: $accent;
      cursor: pointer;
    }

    &-details {
      display: flex;
      flex-flow: row wrap;
      width: 100%;

      label {
        margin-right: .5rem;
      }
    }
  }
}
</style>