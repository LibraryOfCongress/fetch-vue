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
          @click="null"
          aria-label="cancelButton"
        />
      </div>
    </div>

    <q-space class="divider" />

    <div class="row q-pa-xs-sm q-pa-sm-lg q-mb-xs-md q-mb-sm-lg">
      <div class="col-12">
        <h1 class="text-h4 text-bold">
          permissions list here
        </h1>
      </div>
    </div>

    <!-- <div class="row">
      <div
        v-for="group in adminGroupList"
        :key="group.id"
        class="col-xs-12 col-sm-4 col-md-3 q-pa-xs-xs q-pa-lg-sm q-pa-xl-md"
      >
        <q-card
          flat
          bordered
          class="admin-groups-card"
        >
          <q-card-section class="admin-groups-card-details q-pa-md">
            <MoreOptionsMenu
              :options="[
                { text: 'Edit Permission' },
                { text: 'Add/Edit User(s) in Group' },
                { text: 'Rename Group Name' },
                { text: 'Delete Group', optionClass: 'text-negative' }
              ]"
              class="q-mr-sm"
              @click="handleOptionMenu($event, group)"
            />
            <p class="text-h5 text-bold">
              {{ group.name }}
            </p>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 col-md-3 q-pa-xs-xs q-pa-lg-sm q-pa-xl-md">
        <q-card
          flat
          bordered
          class="admin-groups-card admin-groups-card-dashed"
          @click="showAddGroupModal = true"
        >
          <q-card-section class="admin-groups-card-details q-pa-md">
            <q-icon
              name="add"
              size="25px"
              class="q-mr-sm text-bold"
            />
            <p class="text-h5 text-bold">
              Add New Group
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div> -->
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/global-store'
import { useGroupStore } from '@/stores/group-store'

// Compasables

// Store Data
const { appActionIsLoadingData } = storeToRefs(useGlobalStore())
const { groupDetails } = storeToRefs(useGroupStore())

// Local Data

// Logic
// const handleAlert = inject('handle-alert')

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
.admin-groups {
  &-card {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 70px;
    border-color: $secondary;
    border-radius: 4px;
    transition: 0.3s ease;

    &-dashed {
      border-style: dashed;
      border-width: 2px;
      border-color: $color-black;

      &:hover:not(:disabled) {
        color: $accent;
        border-color: $accent;
        cursor: pointer;
      }
    }

    &-details {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      width: 100%;
    }
  }

  &-users {
    position: relative;
    left: -4px;
    width: calc(100% + 8px);

    &-chip {
      display: flex;
      width: 100%;
      height: 100%;

      :deep(.q-btn__content) {
        flex-wrap: nowrap;
      }
    }
  }
}
</style>