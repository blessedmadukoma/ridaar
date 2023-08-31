<template>
  <section class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Fill in your driver details</h1>

    <form action="#" @submit.prevent="handleSaveDriver">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">

          <div>
            <input required v-model="driverInfo.name" type="text" name="name" id="name" placeholder="Full Name"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

          <div class="mt-2">
            <input required v-model="driverInfo.year" type="number" name="year" id="year" placeholder="Year"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

          <div class="mt-2">
            <input required v-model="driverInfo.make" type="text" name="make" id="make" placeholder="Make"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

          <div class="mt-2">
            <input required v-model="driverInfo.model" type="text" name="model" id="model" placeholder="Model"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

          <div class="mt-2">
            <input required v-model="driverInfo.color" type="text" name="color" id="color" placeholder="Color"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

          <div class="mt-2">
            <input required v-model="driverInfo.license_plate" type="text" name="license_plate" id="license_plate"
              placeholder="License Plate #"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-100 shadow-sm focus:border-black focus:outline-none">
          </div>

        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <ButtonComponent @click="handleSaveDriver" class="btn-primary" message="Continue" :loading="loading"
            text="Saving..." />
        </div>
      </div>
    </form>

    <ToastNotification v-if="isResponse" :toast-message="toast.message" :type="toast.type" />
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { handleError } from '../helpers/error';
import ButtonComponent from '../components/ButtonComponent.vue';
import toggleLoading from '../helpers/spinner';
import { api } from '../helpers/api';
import router from '../router';
import ToastNotification from "../components/ToastNotification.vue";

const loading = ref(false);
const isResponse = ref(false);

const toast = reactive({
  type: "",
  message: "",
});

const driverInfo = reactive({
  name: "",
  year: "",
  make: "",
  model: "",
  color: "",
  license_plate: "",
})


const handleSaveDriver = () => {
  toggleLoading(loading);

  api().post('/driver', driverInfo).then(() => {
    toggleLoading(loading);

    isResponse.value = true;

    toast.message = "Driver details saved successfully!";
    toast.type = "success";

    setTimeout(() => {
      isResponse.value = false;
      router.push({ name: 'standby' })
    }, 2000);
  }).catch((error) => {
    isResponse.value = true;

    let errMsg = handleError(error)

    toast.message = errMsg;
    toast.type = "failure";

    toggleLoading(loading);

    setTimeout(() => {
      isResponse.value = false;
    }, 1500);
  });

}
</script>