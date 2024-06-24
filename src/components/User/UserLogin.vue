<template>
  <q-btn
    no-caps
    flat
    dense
    class="text-body1 authentication"
    color="white"
    label="Login"
    aria-label="Login"
    :loading="isStageOrProd ? appActionIsLoadingData : null"
    @click="isStageOrProd ? idaptiveLogin() : null"
  >
    <q-menu
      :offset="[12, 9]"
      :class="$style['authentication-menu']"
    >
      <q-list>
        <q-item role="menuitem">
          <q-item-section>
            <div class="form-group">
              <label class="form-group-label">
                Username
              </label>
              <TextInput
                v-model="loginForm.user"
                placeholder="Enter Username"
                @keyup.enter="isLoginValid ? internalLogin() : null"
              />
            </div>
          </q-item-section>
        </q-item>
        <q-item
          class="q-pt-none"
          role="menuitem"
        >
          <q-item-section>
            <div class="form-group">
              <label class="form-group-label">
                Password
              </label>
              <TextInput
                v-model="loginForm.password"
                placeholder="Enter Password"
                :type="isPasswordType ? 'password' : 'text'"
                @keyup.enter="isLoginValid ? internalLogin() : null"
              >
                <template #append>
                  <q-icon
                    :name="isPasswordType ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPasswordType = !isPasswordType"
                  />
                </template>
              </TextInput>
            </div>
          </q-item-section>
        </q-item>
        <q-item role="menuitem">
          <q-btn
            no-caps
            unelevated
            class="text-body1"
            color="accent"
            label="Login"
            aria-label="Internal Login"
            :disabled="!isLoginValid"
            :loading="appActionIsLoadingData"
            @click="internalLogin"
          />
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import inventoryServiceApi from '@/http/InventoryService.js'
import { ref, inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useUserStore } from '@/stores/user-store'
import TextInput from '@/components/TextInput.vue'

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { patchLogin } = useUserStore()

// Local Data
const isStageOrProd = computed(() => {
  return process.env.VITE_ENV == 'production' || process.env.VITE_ENV == 'staging'
})
const isLoginValid = computed(() => {
  return loginForm.value.user == '' || loginForm.value.password == '' ? false : true
})
const loginForm = ref({
  user: '',
  password: ''
})
const isPasswordType = ref(true)

// Logic
const handleAlert = inject('handle-alert')

const idaptiveLogin = async () => {
  try {
    appActionIsLoadingData.value = true
    // Replace current url with SSO login url (this is where idaptive will handle login from and redirect the user back to the pwa)
    window.location.replace(`https://inventory.dev.loctest.gov${inventoryServiceApi.authSsoLogin}`)

    // TODO: need figure out how the user info is returned from idaptive and handle that logic
    return
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
const internalLogin = async () => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      username: loginForm.value.user,
      password: loginForm.value.password
    }
    await patchLogin(payload)
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

<style lang="scss" module>
.authentication-menu {
  @media (max-width: $breakpoint-sm-min) {
    width: 100%;
  }
}
</style>