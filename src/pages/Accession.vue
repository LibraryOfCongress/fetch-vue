<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-bold q-mb-lg">
          Accession Jobs
        </h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-6 col-sm-3 col-md-2 q-pa-xs-xs q-pa-lg-sm q-pa-xl-md">
        <q-btn
          class="accession-btn text-h4"
          flat
          icon="mdi-plus"
          @click="showAccessionModal = !showAccessionModal"
        >
          <span>Start Accession</span>
        </q-btn>
      </div>
    </div>

    <q-dialog
      :persistent="true"
      v-model="showAccessionModal"
    >
      <q-card class="accession-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2
            v-if="!accessionJob.type"
            class="text-h6"
          >
            Start New Accession
          </h2>
          <q-btn
            v-else
            icon="chevron_left"
            label="Back"
            no-caps
            flat
            dense
            class="text-body1"
            @click="accessionJob.type = null"
          />

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="reset"
          />
        </q-card-section>

        <!-- first step in accession job process -->
        <q-card-section
          v-if="!accessionJob.type"
          class="column no-wrap items-center"
        >
          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Non-Tray Accession"
            class="accession-modal-btn full-width text-body1 q-mb-md"
            @click="accessionJob.type = 1"
          />

          <q-btn
            outline
            no-caps
            padding="14px md"
            label="Trayed Accession"
            class="accession-modal-btn full-width text-body1"
            @click="accessionJob.type = 2"
          />
        </q-card-section>

        <!-- second step in accession job process -->
        <template v-else>
          <q-card-section class="column no-wrap items-center">
            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Owner (Required)
              </label>
              <q-select
                outlined
                v-model="accessionJob.owner"
                :options="ownerOptions"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                class="full-width"
              />
            </div>

            <div class="form-group q-mb-md">
              <label class="form-group-label">
                Container Size (Required)
              </label>
              <q-select
                outlined
                v-model="accessionJob.container_size"
                :options="containerOptions"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                class="full-width"
              />
            </div>

            <div class="form-group">
              <label class="form-group-label">
                Media Type (Optional)
              </label>
              <q-select
                outlined
                v-model="accessionJob.media_type"
                :options="mediaOptions"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                class="full-width"
              />
            </div>
          </q-card-section>

          <q-card-section class="row no-wrap justify-between items-center q-pt-sm">
            <q-btn
              no-caps
              unelevated
              color="accent"
              label="Submit"
              class="text-body1 full-width"
              :disable="!canSubmitAccessionJob"
              @click="reset"
            />

            <q-space class="q-mx-xs" />

            <q-btn
              outline
              no-caps
              label="Cancel"
              class="accession-modal-btn text-body1 full-width"
              @click="reset"
            />
          </q-card-section>
        </template>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccessionPage',
  data () {
    return {
      showAccessionModal: false,
      accessionJob: {
        type: null,
        owner: null,
        container_size: null,
        media_type: null
      },
      ownerOptions: [
        {
          id: null,
          name: 'Select Owner',
          disable: true
        },
        {
          id: 1,
          name: 'John Doe'
        },
        {
          id: 2,
          name: 'George Washington'
        }
      ],
      containerOptions: [
        {
          id: null,
          name: 'Select Size',
          disable: true
        },
        {
          id: 1,
          name: 'A High'
        },
        {
          id: 2,
          name: 'A Low'
        },
        {
          id: 4,
          name: 'B High'
        },
        {
          id: 4,
          name: 'B Low'
        }
      ],
      mediaOptions: [
        {
          id: null,
          name: 'Select Media Type',
          disable: true
        },
        {
          id: 1,
          name: 'Document'
        },
        {
          id: 2,
          name: 'Music'
        },
        {
          id: 2,
          name: 'Video'
        }
      ]
    }
  },
  computed: {
    canSubmitAccessionJob () {
      if (this.accessionJob.owner !== null && this.accessionJob.container_size !== null) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    reset () {
      this.accessionJob = {
        type: null,
        owner: null,
        container_size: null,
        media_type: null
      },
      this.showAccessionModal = false
    }
  }
})
</script>

<style lang="scss" scoped>
.accession {
  &-btn {
    position: relative;
    display: flex;
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 0;
    border: 1px dashed $color-black;
    border-width: 2px;
    border-radius: 4px;
    transition: 0.3s ease;

    &:hover:not(:disabled) {
      color: $accent;
      border-color: $accent;
    }

    & span {
      position: absolute;
      bottom: 15%;
      font-size: 1.25rem;
      text-transform: none;

      @media (max-width: $breakpoint-sm-min) {
        bottom: 12%;
        width: 9rem;
        line-height: normal;
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
