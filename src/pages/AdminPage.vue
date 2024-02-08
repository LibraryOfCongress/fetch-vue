<template>
  <q-page padding>
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
              <q-item>
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
            @click="null"
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
                  {{ building.modules == 0 ? 'N/A' : building.modules }}
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
    <q-dialog
      :persistent="true"
      v-model="showBuildingForm"
    >
      <q-card class="building-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2 class="text-h6">
            {{ buildingFormTitle == '' ? 'Create Location Hierarchy' : `Add New ${buildingFormTitle}` }}
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="resetBuildingForm"
          />
        </q-card-section>

        <q-card-section class="row items-end">
          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Building
            </label>
            <SelectInput
              v-model="buildingForm.building"
              :options="[]"
              option-value="id"
              option-label="name"
              :placeholder="'Select Building'"
            />
          </div>

          <div class="form-group q-mb-md">
            <label class="form-group-label">
              Module
            </label>
            <SelectInput
              v-model="buildingForm.module"
              :options="[]"
              option-value="id"
              option-label="name"
              :placeholder="'Select Modulee'"
            />
          </div>

          <div class="col-xs-12 col-sm-6 q-pr-xs">
            <div class="form-group">
              <label class="form-group-label">
                Aisle
              </label>
              <SelectInput
                v-model="buildingForm.aisle"
                :options="[]"
                option-value="id"
                option-label="name"
                :placeholder="'Select Aisle'"
              />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 q-pl-xs q-mt-xs-md q-mt-sm-none">
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

          <div class="form-group q-mt-md">
            <label class="form-group-label">
              Ladder
            </label>
            <SelectInput
              v-model="buildingForm.ladder"
              :options="[]"
              option-value="id"
              option-label="name"
              :placeholder="'Select Ladder'"
            />
          </div>
        </q-card-section>

        <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Create"
            class="text-body1 full-width"
            :disable="true"
            @click="resetBuildingForm"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="building-modal-btn text-body1 full-width"
            @click="resetBuildingForm"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import SelectInput from '@/components/SelectInput.vue'

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// // Store Data
// const { templateAction } = useTemplateStore()
// const { templateState } = storeToRefs(useTemplateStore())

// Local Data
const buildings = ref([
  {
    id: 1,
    name: 'Cabin Branch',
    modules: 12,
    available_shelves: 120
  },
  {
    id: 2,
    name: 'Fort Meade',
    modules: 0,
    available_shelves: 60
  }
])
const buildingFormTitle = ref('')
const buildingForm = ref({
  building: '',
  module: '',
  aisle: '',
  side: 'left',
  ladder: ''
})
const showBuildingForm = ref(false)
const addNewOptions = ref([
  'Building',
  'Module',
  'Aisle',
  'Ladder'
])

// Logic
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

  &-modal {
    width: 500px;

    @media (max-width: $breakpoint-sm-min) {
      width: 90vw;
    }

    &-btn {
      transition: .3s ease;

      &:hover {
        color: $accent;
        border-color: $accent;
      }
    }
  }
}
</style>