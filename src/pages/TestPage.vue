<template>
  <q-page
    padding
    class="flex flex-center column"
  >
    <h1>List of Owner Tiers</h1>
    <ul class="owner-list">
      <div
        v-if="loadingData"
        class="overlay"
      >
        <q-spinner-bars
          color="primary"
          size="2rem"
          class="overlay-loading"
        />
      </div>

      <li v-if="ownerTierOptions && ownerTierOptions.length == 0 && !loadingData">
        No Owner Tiers found...
      </li>
      <li
        v-for="(data, i) in ownerTierOptions"
        :key="i"
        :class="data.storedOffline ? 'text-negative' : ''"
      >
        {{ data.storedOffline ? `${data.name} (stored offline)` : data.name }}
      </li>
    </ul>

    <q-btn
      no-caps
      unelevated
      class="text-body1 q-mt-lg"
      color="primary"
      label="Create New Owner Tier"
      :disabled="loadingData"
      @click="showOwnerTierCreation = !showOwnerTierCreation"
    />

    <div class="row no-wrap justify-between items-center q-mt-xl">
      <q-btn
        no-caps
        outline
        color="negative"
        label="Show Generic Alert"
        class="text-body1 full-width btn-no-wrap"
        @click="generateTestAlert(1)"
      />

      <q-space class="q-mx-xs" />

      <q-btn
        unelevated
        no-caps
        color="negative"
        label="Show Persistent Alert"
        class="text-body1 full-width btn-no-wrap"
        @click="generateTestAlert(2)"
      />
    </div>

    <q-dialog
      :persistent="true"
      v-model="showOwnerTierCreation"
    >
      <q-card class="test-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2
            class="text-h6"
          >
            Create A New Owner Tier
          </h2>

          <q-btn
            icon="close"
            flat
            round
            dense
            @click="reset"
          />
        </q-card-section>

        <q-card-section
          class="column no-wrap items-center"
        >
          <q-input
            outlined
            color="primary"
            dense
            v-model="newOwnerTier"
            :placeholder="'Enter Owner Tier Name'"
            class="full-width"
          />
        </q-card-section>

        <q-card-actions class="row no-wrap justify-between items-center">
          <q-btn
            no-caps
            unelevated
            color="accent"
            label="Confirm"
            class="text-body1 full-width"
            @click="createNewOwnerTier"
          />

          <q-space class="q-mx-xs" />

          <q-btn
            outline
            no-caps
            label="Cancel"
            class="text-body1 full-width"
            @click="reset"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useOptionStore } from '@/stores/option-store'
import { ref, onMounted, inject } from 'vue'

// Store Data
const { getOwnerTierList, postOwnerTier } = useOptionStore()
const { ownerTierOptions } = storeToRefs(useOptionStore())

// Local Data
const loadingData = ref(true)
const showOwnerTierCreation = ref(false)
const newOwnerTier = ref('')

// Logic
onMounted(async () => {
  await getOwnerTierList()
  loadingData.value = false

  // when user comes back online we listen for the stored owner api calls to sync and update the ownerTiers
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.url && event.data.url.includes('/owners/tiers')) {
      updateOwnerTierList(event.data.response)
    }
  })
})

const reset = () => {
  showOwnerTierCreation.value = false
  newOwnerTier.value = ''
}

const createNewOwnerTier = async () => {
  try {
    const payload = {
      name: newOwnerTier.value,
      level: ownerTierOptions.value[ownerTierOptions.value.length - 1].level + 1
    }
    await postOwnerTier(payload)

    if (!window.navigator.onLine) {
      ownerTierOptions.value = [
        ...ownerTierOptions.value,
        {
          ...payload,
          storedOffline: true
        }
      ]
    }
  } catch (error) {
    console.log(error)
  } finally {
    reset()
  }
}
const updateOwnerTierList = (requestdata) => {
  ownerTierOptions.value = [
    ...ownerTierOptions.value,
    requestdata
  ].filter(tier => !tier.storedOffline)
}

const handleAlert = inject('handle-alert')
const generateTestAlert = (val) => {
  if (val == 1) {
    handleAlert({
      type: 'error',
      text: 'This is a user generated error message',
      autoClose: true
    })
  } else {
    handleAlert({
      type: 'error',
      text: 'This is a user generated error message with audio',
      persistent: true
    })
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 30px;
  color: $primary;
}

.owner-list {
  position: relative;
  display: inline-block;
  width: max-content;
  min-width: 300px;
  min-height: 60px;
  list-style: none;
  background-color: $color-gray;
  border-radius: 4px;
  padding: 0.5rem;
}

.test-modal {
  width: 500px;
}
</style>
