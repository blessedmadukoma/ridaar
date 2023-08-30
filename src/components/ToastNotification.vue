<template>
  <div v-if="visible" class="flex justify-center top-0 absolute mt-1 mx-auto w-full z-10">
    <div :id="styles.id"
      class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-700 bg-white rounded-lg shadow dark:text-gray-300 dark:bg-gray-800"
      role="alert">
      <div :class="`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ` + styles.classStyle">

        <IconSuccess v-if="styles.svg = 'success'" />
        <IconFailure v-else-if="styles.svg = 'failure'" />
        <IconWarning v-else />

        <span class="sr-only">Check icon</span>
      </div>

      <div class="ml-3 text-sm font-normal">{{ toastMessage }}</div>

      <button type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        :data-dismiss-target="'#' + styles.id" aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import IconSuccess from './icons/IconSuccess.vue';
import IconFailure from './icons/IconFailure.vue';
import IconWarning from './icons/IconWarning.vue';

const visible = ref(false);

const props = defineProps({
  type: String, // "success" | "failure" | "warning"
  toastMessage: String, // "Item has been deleted." | "Improve password difficulty."
})

const styles = reactive({
  id: "",
  classStyle: "",
  svg: ""
})

const showToast = () => {
  switch (props.type) {
    case "success":
      styles.classStyle = "text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200"
      styles.svg = "success"
      styles.id = "toast-success"
      break;

    case "failure":
      styles.classStyle = "text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
      styles.svg = "failure"
      styles.id = "toast-danger"
      break;

    default:
      styles.classStyle = "text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200"
      styles.svg = "warning"
      styles.id = "toast-warning"
      break;
  }

  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
}

showToast();

</script>