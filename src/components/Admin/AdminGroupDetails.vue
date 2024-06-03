<template>
  <div class="admin-group-details">
    <div class="row q-mt-md">
      <div class="col-12">
        <!-- group tabs -->
        <q-tabs
          v-model="activeTab"
          class="admin-group-details-tablist"
          active-color="accent"
          indicator-color="accent"
          align="justify"
        >
          <q-tab
            name="accession"
            label="Accession"
            class="admin-group-details-tablist-tab"
          />
          <q-tab
            name="verification"
            label="Verification"
            class="admin-group-details-tablist-tab"
          />
          <q-tab
            name="shelving"
            label="Shelving"
            class="admin-group-details-tablist-tab"
          />
          <q-tab
            name="request"
            label="Request"
            class="admin-group-details-tablist-tab"
          />
          <q-tab
            name="picklist"
            label="Picklist"
            class="admin-group-details-tablist-tab"
          />
          <q-tab
            name="refile"
            label="Refile"
            class="admin-group-details-tablist-tab"
          />
        </q-tabs>

        <!-- group tabs - content -->
        <q-tab-panels
          v-model="activeTab"
          animated
          transition-prev="slide-right"
          transition-next="slide-right"
          class="admin-group-details-tabpanels q-pa-xs-sm q-pa-sm-lg"
        >
          <q-tab-panel name="accession">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="verification">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="shelving">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="request">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="picklist">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="refile">
            <div
              v-for="permission in groupDetails.permissions"
              :key="permission.id"
              class="row q-mb-xs-md q-mb-lg-lg"
            >
              <div class="col-xs-12 col-sm-8 col-md-10 flex items-center">
                <p :class="currentScreenSize !== 'xs' ? 'text-h6' : 'text-body1 q-mb-xs'">
                  {{ permission.name }}
                </p>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-2">
                <div class="form-group">
                  <ToggleButtonInput
                    v-model="permission.value"
                    @update:model-value="$event == true ? addAdminGroupPermission(permission.id) : removeAdminGroupPermission(permission.id)"
                    :options="[
                      {label: 'Yes', value: true},
                      {label: 'No', value: false}
                    ]"
                  />
                </div>
              </div>
            </div>
            <q-btn @click="addAdminGroupPermission" />
            <q-btn @click="removeAdminGroupPermission" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useGroupStore } from '@/stores/group-store'
import { useCurrentScreenSize } from '@/composables/useCurrentScreenSize.js'
import ToggleButtonInput from '@/components/ToggleButtonInput.vue'

const route = useRoute()

// Compasables
const { currentScreenSize } = useCurrentScreenSize()

// Store Data
const { appActionIsLoadingData, appIsLoadingData } = storeToRefs(useGlobalStore())
const { groupDetails } = storeToRefs(useGroupStore())
const {
  getPermissionsList,
  getAdminGroupPermissions,
  postAdminGroupPermission,
  deleteAdminGroupPermission
} = useGroupStore()

// Local Data
const activeTab = ref('accession')

// Logic
const handleAlert = inject('handle-alert')

onBeforeMount(() => {
  loadAdminGroupPermissions()
})

const loadAdminGroupPermissions = async () => {
  try {
    appIsLoadingData.value = true
    // get all permissions first
    await getPermissionsList()

    // get the group based permissions to compare against
    await getAdminGroupPermissions(route.params.groupId)
  } catch (error) {
    handleAlert({
      type: 'error',
      text: error,
      autoClose: true
    })
  } finally {
    appIsLoadingData.value = false
  }
}
const addAdminGroupPermission = async (permissionId) => {
  try {
    console.log('add')
    appActionIsLoadingData.value = true
    const payload = {
      groupId: groupDetails.value.id,
      permissionId
    }
    await postAdminGroupPermission(payload)
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
const removeAdminGroupPermission = async (permissionId) => {
  try {
    appActionIsLoadingData.value = true
    const payload = {
      groupId: groupDetails.value.id,
      permissionId
    }
    await deleteAdminGroupPermission(payload)
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
.admin-group-details {
  &-tablist {
    &-tab {
      :deep(.q-tab__label) {
        // copy of .text-h5 styling + font weight bold
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 2rem;
        letter-spacing: normal;
      }
    }
  }

  &-tabpanels {
    :deep(.q-tab-panel) {
      padding: 0;
    }
  }
}
</style>