<template>
  <button type="button" :class="props.class">

    <LoadSpinner v-if="loading" :active="loading" :text="text" />

    <span v-else>{{ message }}</span>
  </button>
</template>

<script setup>
import LoadSpinner from '../components/LoadSpinner.vue';

const props = defineProps({
  loading: Boolean,
  class: String,
  text: String,
  message: String,
})
</script>
