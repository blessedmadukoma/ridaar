<template>
  <div class="pt-16">
    <ToastNotification v-if="isResponse" :toast-message="toast.message" :type="toast.type" />
    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>

    <div>
      <div v-if="!tripStore.is_complete" class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">

          <div>
            <GMapMap ref="gMap" :zoom="14" :center="locationStore.current.geometry" style="width: 100%; height: 256px;">
              <GMapMarker :position="locationStore.current.geometry" :icon="currentIcon" />
              <GMapMarker :position="locationStore.destination.geometry" :icon="destinationIcon" />
            </GMapMap>
          </div>

          <div class="mt-2">
            <div class="text-xl">{{ message }}</div>
          </div>

        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <ButtonComponent @click="handleCompleteTrip" :loading="loadingComplete" v-if="tripStore.is_started"
            class="btn-primary" message="Complete Trip" text="Completing Trip!" />

          <ButtonComponent @click="handleStartTrip" v-else :loading="loadingStart" class="btn-primary"
            message="Start Trip" text="Starting Trip!" />
        </div>
      </div>

      <div v-else class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <RideComplete />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ButtonComponent from '../components/ButtonComponent.vue';
import RideComplete from '../components/RideComplete.vue';
import { useLocationStore } from '../stores/location';
import { useTripStore } from '../stores/trip';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { api } from '../helpers/api';
import toggleLoading from '../helpers/spinner';
import ToastNotification from '../components/ToastNotification.vue';
import { handleError } from '../helpers/error';

const locationStore = useLocationStore();
const tripStore = useTripStore();

const router = useRouter();

const loadingStart = ref(false);
const loadingComplete = ref(false);
const isResponse = ref(false);
const gMap = ref(null);
const intervalRef = ref(null);
const title = ref('Driving to passenger...');
const message = ref('Going to pick up passenger...')

const toast = reactive({
  message: '',
  type: '',
})

const currentIcon = {
  url: 'https://openmoji.org/data/color/svg/1F698.svg',
  scaledSize: {
    width: 24,
    height: 24,
  }
}

const destinationIcon = {
  url: 'https://openmoji.org/data/color/svg/1F920.svg',
  scaledSize: {
    width: 24,
    height: 24,
  }
}

const handleStartTrip = () => {
  toggleLoading(loadingStart);

  api().post(`/trip/${tripStore.id}/start`).then((response) => {
    toggleLoading(loadingStart);

    tripStore.is_started = true;
    tripStore.is_complete = false;

    title.value = 'Driving to destination...';
    message.value = `Going to drop passenger at ${response.data.destination_name}`;

    locationStore.$patch({
      destination: {
        name: response.data.destination_name,
        geometry: response.data.destination,
      }
    })

    tripStore.$patch(response.data)
    isResponse.value = true;

    toast.message = 'Trip started!';
    toast.type = 'success';

    setTimeout(() => {
      isResponse.value = false;
    }, 1500);
  }).catch((error) => {
    toggleLoading(loadingStart);
    isResponse.value = true;

    let errMsg = handleError(error);

    toast.message = errMsg;
    toast.type = 'failure';

    setTimeout(() => {
      isResponse.value = false;
    }, 1500);
  })
}

const handleCompleteTrip = () => {
  toggleLoading(loadingComplete);

  api().post(`/trip/${tripStore.id}/end`).then((response) => {
    title.value = 'Trip completed!';

    tripStore.is_complete = true;
    tripStore.is_started = false;

    tripStore.$patch(response.data);

    isResponse.value = true;

    toast.message = 'Trip completed!';
    toast.type = 'success';

    setTimeout(() => {
      tripStore.reset();
      locationStore.reset();

      toggleLoading(loadingComplete);

      isResponse.value = false;
      router.push({ name: 'standby' });
    }, 3000);
  }).catch((error) => {
    toggleLoading(loadingComplete);
    isResponse.value = true;

    console.log("error completing trip", error);

    let errMsg = handleError(error);

    toast.message = errMsg;
    toast.type = 'failure';

    setTimeout(() => {
      isResponse.value = false;
    }, 1500);
  })
}

onMounted(() => {
  console.log("Trip:", tripStore);

  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject);

    intervalRef.value = setInterval(async () => {
      // update driver's current location and update map bounds
      await locationStore.updateCurrentLocation();

      // update the driver's position in the database
      broadcastDriverLocation();

      updateMapBounds(mapObject);
    }, 3000);
    gMap.value.$mapObject.setCenter(locationStore.current.geometry);
  })
})

const updateMapBounds = (mapObject) => {
  // eslint-disable-next-line no-undef
  let originPoint = new google.maps.LatLng(locationStore.current.geometry),
    // eslint-disable-next-line no-undef
    destinationPoint = new google.maps.LatLng(locationStore.destination.geometry),
    // eslint-disable-next-line no-undef
    bounds = new google.maps.LatLngBounds();

  bounds.extend(originPoint);
  bounds.extend(destinationPoint);

  mapObject.fitBounds(bounds);
}

const broadcastDriverLocation = () => {
  api().post(`/trip/${tripStore.id}/location`, {
    driver_location: locationStore.current.geometry,
  }).then((response) => {
    console.log("broadcasted driver location", response.data);
  }).catch((error) => {
    console.log("error broadcasting driver location", error);
  })
}

onUnmounted(() => {
  clearInterval(intervalRef.value);

  intervalRef.value = null;
})
</script>