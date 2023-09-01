<template>
  <div class="pt-16">
    <ToastNotificationVue v-if="isResponse" :type="toast.type" :toastMessage="toast.message" />

    <h1 class="text-3xl font-semibold mb-4">Here's your trip information</h1>

    <div>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">

        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap ref="gMap" :zoom="11" :center="locationStore.destination.geometry"
              style="width: 100%; height: 256px;">
            </GMapMap>
          </div>

          <div class="mt-2">
            <p class="text-xl">Going to <strong>{{ locationStore.destination.name }}</strong></p>
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">

          <ButtonComponent @click="handleConfirmTrip" :loading="loading" :class="'btn-primary'" message="Let's Go!"
            text="Confirming Trip" />

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useLocationStore } from '../stores/location';
import { useTripStore } from '../stores/trip';
import { useRouter } from 'vue-router';
import ButtonComponent from '../components/ButtonComponent.vue';
import toggleLoading from '../helpers/spinner';
import { api } from '../helpers/api';
import { handleError } from '../helpers/error';
import ToastNotificationVue from "../components/ToastNotification.vue";

const router = useRouter();

const locationStore = useLocationStore();
const tripStore = useTripStore();

const gMap = ref(null);
const loading = ref(false);
const isResponse = ref(false);

const toast = reactive({
  type: "",
  message: "",
});

const handleConfirmTrip = () => {
  toggleLoading(loading);

  api().post("/trip", {
    origin: locationStore.current.geometry,
    destination: locationStore.destination.geometry,
    destination_name: locationStore.destination.name,
  }).then((response) => {
    toggleLoading(loading);

    tripStore.$patch(response.data);

    isResponse.value = true;

    toast.message = "Trip confirmed! Waiting for driver!"
    toast.type = "success";

    setTimeout(() => {
      isResponse.value = false;
      console.log("isResponse false:", isResponse.value);

      router.push({ name: 'trip' });
    }, 1500);

  }).catch((error) => {
    toggleLoading(loading);
    isResponse.value = true;

    let errMsg = handleError(error);

    toast.message = errMsg;
    toast.type = "failure";

    setTimeout(() => {
      isResponse.value = false;
      console.log("isResponse false:", isResponse.value);
    }, 1500);

    console.log(error);
  })
}

onMounted(async () => {
  if (locationStore.destination.name === "") {
    router.push({ name: 'find-ride' });
  }

  await locationStore.updateCurrentLocation();

  gMap.value.$mapPromise.then((mapObject) => {
    // eslint-disable-next-line no-undef
    let currentPoint = new google.maps.LatLng(locationStore.current.geometry);

    // eslint-disable-next-line no-undef
    let destinationPoint = new google.maps.LatLng(locationStore.destination.geometry);

    // eslint-disable-next-line no-undef
    let directionsService = new google.maps.DirectionsService();

    // eslint-disable-next-line no-undef
    let directionsDisplay = new google.maps.DirectionsRenderer({ map: mapObject });

    directionsService.route({
      origin: currentPoint,
      destination: destinationPoint,
      avoidTolls: false,
      avoidHighways: false,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      // eslint-disable-next-line no-undef
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    })
  })
})
</script>