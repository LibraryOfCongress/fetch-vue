<template>
  <q-avatar
    rounded
    size="md"
    icon="person"
    color="secondary"
    class="user-avatar text-white"
    font-size="25px"
  >
    <q-menu
      class="user-menu"
      :offset="[11, 10]"
    >
      <q-list style="min-width: 200px">
        <q-item
          tag="label"
          v-ripple
        >
          <q-item-section>
            <q-item-label class="text-body1 text-nowrap">
              Toggle Barcode Scan
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              name="barcode_scan_active"
              v-model="barcodeScanAllowed"
            />
          </q-item-section>
        </q-item>
        <q-item
          dense
          class="items-center q-pb-sm"
        >
          <div class="col-8">
            <p class="text-body2 text-color-gray-dark">
              barcode input delay (seconds)
            </p>
          </div>
          <div class="col-4">
            <TextInput
              dense
              type="number"
              v-model="barcodeInputDelay"
              :disabled="barcodeScanAllowed"
            />
          </div>
        </q-item>
        <q-space class="divider" />
        <q-item>
          <q-item-section>
            <h1 class="text-h6">
              {{ userData.first_name }} {{ userData.last_name }}
            </h1>
            <p class="text-body2 text-color-gray-dark">
              {{ userData.username }}
            </p>
          </q-item-section>
        </q-item>
        <q-space class="divider" />
        <q-item
          v-for="(opt, i) in userOptions"
          :key="i"
          clickable
          v-close-popup
          @click="handleOptions(opt.text)"
        >
          <q-item-section>
            <q-item-label class="flex items-center text-body1">
              <q-icon
                v-if="opt.icon"
                color="secondary"
                :name="opt.icon"
                class="q-mr-sm"
                size="20px"
              />
              {{ opt.text }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-avatar>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUserStore } from '@/stores/user-store'
import { useBarcodeStore } from '@/stores/barcode-store'
import { storeToRefs } from 'pinia'
import TextInput from '@/components/TextInput.vue'

// Store Data
const { userData } = storeToRefs(useUserStore())
const { patchLogout } = useUserStore()
const { barcodeScanAllowed, barcodeInputDelay } = storeToRefs(useBarcodeStore())

// Local Data
const userOptions = ref([
  {
    text: 'Settings',
    icon: 'settings'
  },
  {
    text: 'Logout',
    icon: 'logout'
  }
])

// Logic
const handleAlert = inject('handle-alert')

const handleOptions = (option) => {
  if (option == 'Logout') {
    logoutUser()
  }
}
const logoutUser = async () => {
  try {
    const payload = {
      id: userData.id
    }
    await patchLogout(payload)

    handleAlert({
      type: 'success',
      text: 'You have successfully been logged out of FETCH.',
      autoClose: true
    })
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  }
}
</script>

<style lang="scss" scoped>
.user {
  &-avatar {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>