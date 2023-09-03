<template>
  <section class="pt-16">
    <ToastNotificationVue v-if="isResponse" :type="toast.type" :toastMessage="toast.message" />

    <h1 class="text-3xl font-semibold mb-4">Ridaar</h1>
    <p class="text-lg font-light mb-4">Simplified Ride Booking and Tracking.</p>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div class="flex justify-between">

          <ButtonComponent @click="handleStartDriving" class="btn-primary" :loading="loadingStartDrive" text="Loading..."
            message="Start Driving" />

          <ButtonComponent @click="hanldelFindARide" class="btn-primary" :loading="loadingFindRide" text="Loading..."
            message="Find a Ride" />

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import toggleLoading from '../helpers/spinner';
import ToastNotificationVue from "../components/ToastNotification.vue";
import ButtonComponent from '../components/ButtonComponent.vue';

const isResponse = ref(false);

const toast = reactive({
  type: "",
  message: "",
});

import { useRouter } from 'vue-router';
import { api } from '../helpers/api';

const loadingFindRide = ref(false);
const loadingStartDrive = ref(false);

const router = useRouter();

const hanldelFindARide = () => {
  toggleLoading(loadingFindRide);

  router.push({ name: 'find-ride' });
}

const handleStartDriving = () => {
  toggleLoading(loadingStartDrive);

  api().get('/driver').then((response) => {
    toggleLoading(loadingStartDrive);
    if (response.data.driver) {
      router.push({ name: 'standby' });
    } else {
      router.push({ name: 'driver-info' });
    }
  })
    .catch((error) => {
      isResponse.value = true;

      let errMsg = error.response ? error.response.data.message : error.message;

      if (errMsg.includes("SQLSTATE[08006]") || errMsg.includes("not known (Connection")) {
        errMsg = "Network error!"
      }

      toast.message = errMsg;
      toast.type = "failure";

      toggleLoading(loadingStartDrive);

      setTimeout(() => {
        isResponse.value = false;
        console.log("isResponse false:", isResponse.value);
      }, 1500);
    })
}
</script>
