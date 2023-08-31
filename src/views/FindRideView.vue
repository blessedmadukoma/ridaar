<template>
  <div class="pt-16">

    <h1 class="text-3xl font-semibold mb-4">Where are you headed to?</h1>
    <form action="#">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input type="text" name="destination" id="destination" placeholder="My destination"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none" />

          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6 flex justify-between">

          <ButtonComponent @click="$router.go(-1)" :class="'btn-secondary'" message="Go Back" />

          <ButtonComponent :class="'btn-primary'" message="Find A Ride" />

        </div>
      </div>
    </form>

  </div>
</template>

<script setup>
import ButtonComponent from '../components/ButtonComponent.vue';


</script>