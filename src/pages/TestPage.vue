<template>
  <q-page
    padding
    class="flex flex-center column"
  >
    <h1>List of Owners</h1>
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

      <li v-if="ownerOptions.length == 0 && !loadingData">
        No Owners found...
      </li>
      <li
        v-for="(owner, i) in ownerOptions"
        :key="i"
        :class="owner.temporary ? 'text-negative' : ''"
      >
        {{ owner.temporary ? `${owner.name} (stored offline)` : owner.name }}
      </li>
    </ul>

    <q-btn
      no-caps
      unelevated
      class="text-body1 q-mt-lg"
      color="primary"
      label="Create New Owner"
      :disabled="loadingData"
      @click="showOwnerCreation = !showOwnerCreation"
    />

    <q-dialog
      :persistent="true"
      v-model="showOwnerCreation"
    >
      <q-card class="test-modal">
        <q-card-section class="row items-center justify-between q-pb-none">
          <h2
            class="text-h6"
          >
            Create A New Owner
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
            v-model="newOwner"
            :placeholder="'Enter Owner Name'"
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
            @click="createNewOwner"
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
import { useOptionStore } from 'src/stores/option-store'
import { ref, onMounted } from 'vue'

// Store Data
const { getOwnersList, postOwner } = useOptionStore()
const { ownerOptions } = storeToRefs(useOptionStore())

// Local Data
const loadingData = ref(true)
const showOwnerCreation = ref(false)
const newOwner = ref('')

// Logic
onMounted(async () => {
  await getOwnersList()
  loadingData.value = false
})

const reset = () => {
  showOwnerCreation.value = false
  newOwner.value = ''
}

const createNewOwner = async () => {
  try {
    const payload = {
      name: newOwner.value,
      owner_tier_id: 1
    }
    await postOwner(payload)

    if (!window.navigator.onLine) {
      ownerOptions.value = [
        ...ownerOptions.value,
        {
          ...payload,
          temporary: true
        }
      ]
    }
  } catch (error) {
    console.log(error)
  } finally {
    reset()
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
