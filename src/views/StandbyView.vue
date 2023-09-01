<template>
  <div class="pt-16">
    <ToastNotification v-if="isResponse" :toast-message="toast.message" :type="toast.type" />

    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>

    <div v-if="!tripStore.id" class="mt-8 flex justify-center">
      <LoaderScreen />
    </div>

    <div v-else>
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap ref="gMap" :zoom="14" :center="''" style="width: 100%; height: 256px;"></GMapMap>
          </div>

          <div class="mt-2">
            <p class="text-xl">Going to <strong>{{ tripStore.destination_name }}</strong></p>
          </div>
        </div>

        <div class="flex justify-between bg-gray-50 px-4 py-3 text-right sm:p-6">
          <ButtonComponent @click="handleDeclineTrip" :class="'btn-danger'" message="Decline Trip"
            text="Declining Trip!" />

          <ButtonComponent @click="handleAcceptTrip" :loading="loadingAccept" :class="'btn-primary'" message="Accept Trip"
            text="Accepting Trip!" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import ButtonComponent from '../components/ButtonComponent.vue';
import LoaderScreen from '../components/LoaderScreen.vue';
import { useTripStore } from '../stores/trip';
import { useLocationStore } from '../stores/location';
import Echo from 'laravel-echo';
// eslint-disable-next-line no-unused-vars
import Pusher from 'pusher-js';
import toggleLoading from '../helpers/spinner';
import { api } from '../helpers/api';
import { useRouter } from 'vue-router';
import { handleError } from '../helpers/error';
import ToastNotification from '../components/ToastNotification.vue';

const title = ref('Waiting for ride request...');
const gMap = ref(null);
const loadingAccept = ref(false);
const isResponse = ref(false);

const toast = reactive({
  message: '',
  type: '',
})

const locationStore = useLocationStore();
const tripStore = useTripStore();

const router = useRouter();

const handleDeclineTrip = () => {
  tripStore.reset();
  title.value = 'Waiting for ride request...';
}

const handleAcceptTrip = () => {
  toggleLoading(loadingAccept);

  api().post(`/trip/${tripStore.id}/accept`, {
    driver_location: locationStore.current.geometry,
  }).then((response) => {
    toggleLoading(loadingAccept)

    locationStore.$patch({
      destination: {
        name: 'Passenger',
        geometry: response.data.origin,
      }
    });

    isResponse.value = true;

    toast.message = "Trip Accepted! Loading directions..."
    toast.type = "success";

    setTimeout(() => {
      isResponse.value = false;
      console.log("isResponse false:", isResponse.value);

      router.push({ name: 'driving' });
    }, 1500);
  }).catch((error) => {
    toggleLoading(loadingAccept)
    console.log("error accepting trip", error);

    isResponse.value = true;

    let errMsg = handleError(error);

    toast.message = errMsg
    toast.type = "failure";

    setTimeout(() => {
      isResponse.value = false;
      console.log("isResponse false:", isResponse.value);
    }, 1500);
  })
}

const initMapDirections = () => {
  // draw path on the map
  gMap.value.$mapPromise.then((mapObject) => {
    // eslint-disable-next-line no-undef
    let originPoint = new google.maps.LatLng(tripStore.origin),
      // eslint-disable-next-line no-undef
      destinationPoint = new google.maps.LatLng(tripStore.destination),
      // eslint-disable-next-line no-undef
      directionsService = new google.maps.DirectionsService(),
      // eslint-disable-next-line no-undef
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: mapObject,
      });

    directionsService.route({
      origin: originPoint,
      destination: destinationPoint,
      avoidTolls: false,
      avoidHighways: false,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING
    }, (res, status) => {
      // eslint-disable-next-line no-undef
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res)
      } else {
        console.error(status);
      }
    })
  })
}

onMounted(async () => {
  await locationStore.updateCurrentLocation();

  try {
    let echo = new Echo({
      broadcaster: 'pusher',
      key: `${import.meta.env.VITE_PUSHER_APP_KEY}`,
      cluster: "mt1",
      wsHost: window.location.hostname,
      wsPort: 6001,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    })

    echo.channel('drivers')
      .listen('TripCreated', (e) => {
        title.value = 'New trip request!';
        tripStore.$patch(e.trip);
        setTimeout(initMapDirections, 2000);
      })

  } catch (error) {
    console.log(error);
  }
})
</script>
