<template>
  <section class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Ridaar</h1>
    <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
      <div class="bg-white px-4 py-5 sm:p-6">
        <div class="flex justify-between">
          <button type="button"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">

            <LoadSpinner v-if="loadingStartDrive" :active="loadingStartDrive" text="Verifying Code" />

            <span v-else>Start Driving</span>
          </button>

          <button @click="hanldelFindARide" type="submit"
            class="rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            <LoadSpinner v-if="loadingFindRide" :active="loadingFindRide" text="Verifying Code" />

            <span v-else>Find a Ride</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import LoadSpinner from '../components/LoadSpinner.vue';
import toggleLoading from '../helpers/spinner';
import { useRouter } from 'vue-router';

const loadingFindRide = ref(false);
const loadingStartDrive = ref(false);

const router = useRouter();

const hanldelFindARide = () => {
  toggleLoading(loadingFindRide);

  router.push({ name: 'find-ride' });
}
</script>
