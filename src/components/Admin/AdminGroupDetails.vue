<template>
  <div class="admin-group-details">
    <div class="row q-pa-sm">
      <div class="col-auto flex items-center">
        <p class="text-body1 text-bold">
          Save Group {{ groupDetails.name }} Permissions?
        </p>
      </div>
      <div class="col-auto q-ml-auto flex no-wrap">
        <q-btn
          no-caps
          unelevated
          color="accent"
          label="Save Changes"
          class="text-body1 q-mr-sm"
          :loading="appActionIsLoadingData"
          @click="null"
          aria-label="saveButton"
        />
        <q-btn
          no-caps
          unelevated
          outline
          color="accent"
          label="Cancel"
          class="text-body1"
          @click="cancelGroupChanges"
          aria-label="cancelButton"
        />
      </div>
    </div>

    <q-space class="divider" />

    <div class="row">
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
          class="admin-group-details-tabpanels q-pa-xs-sm q-pa-sm-lg"
        >
          <q-tab-panel name="accession">
            <div class="text-h6">
              Accession
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="verification">
            <div class="text-h6">
              verification
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="shelving">
            <div class="text-h6">
              shelving
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="request">
            <div class="text-h6">
              request
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="picklist">
            <div class="text-h6">
              picklist
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="refile">
            <div class="text-h6">
              Accession
            </div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useGroupStore } from '@/stores/group-store'

const router = useRouter()

// Compasables

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { groupDetails } = storeToRefs(useGroupStore())
const { resetGroupDetails } = useGroupStore()

// Local Data
const activeTab = ref('accession')

// Logic
// const handleAlert = inject('handle-alert')

const cancelGroupChanges = () => {
  resetGroupDetails()
  router.push({
    name: 'admin-groups'
  })
}

// const updateAdminGroup = async () => {
//   try {
//     appActionIsLoadingData.value = true
//     //TODO: create store and wire up endpoint to update an admin group
//     // const payload = {
//     //   name: adminGroupDetails.value.name
//     // }
//     // await patchAdminGroup(payload)

//     handleAlert({
//       type: 'success',
//       text: 'The groups name has been updated.',
//       autoClose: true
//     })
//   } catch (error) {
//     handleAlert({
//       type: 'error',
//       text: error,
//       autoClose: true
//     })
//   } finally {
//     appActionIsLoadingData.value = false
//     editGroupModal.value.hideModal()
//   }
// }
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