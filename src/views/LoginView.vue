<template>
  <section class="pt-16">
    <h2 class="text-3xl font-semibold mb-4">{{ message }}</h2>

    <form v-if="!waitingOnVerification" action="#" @submit.prevent="handleLogin">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input required type="text" v-model="credentials.phone" v-maska data-maska="+234 ### ### ####" name="phone"
              id="phone" placeholder="+2349030609267"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none" />
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            <LoadSpinner v-if="loadingLogin" :active="loadingLogin" text="" />

            <span>Continue</span>
          </button>
        </div>
      </div>
    </form>

    <form v-else action="#" @submit.prevent="handleVerify">
      <div class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left">
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input type="text" v-model="credentials.login_code" v-maska data-maska="######" name="login_code"
              id="login_code" placeholder="123456"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none" />
          </div>
        </div>

        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none">
            <LoadSpinner v-if="loadingVerify" :active="loadingVerify" text="Verifying Code" />

            <span v-else>Verify</span>
          </button>
        </div>
      </div>
    </form>

    <ToastNotificationVue v-if="isResponse" :type="toast.type" :toastMessage="toast.message" />

  </section>
</template>

<script setup>
import { vMaska } from "maska";
import { computed, reactive, ref } from "vue";
import { api } from "../helpers/api";
import LoadSpinner from "../components/LoadSpinner.vue";
import toggleLoading from "../helpers/spinner";
import ToastNotificationVue from "../components/ToastNotification.vue";
import { useRouter } from "vue-router";
// import { useAuthStore } from "../stores/auth.store";
import { setUserCookie } from "../helpers/cookie";

const router = useRouter();
// const authStore = useAuthStore();

const message = ref("Enter your phone number");

// show the toast notification
const isResponse = ref(false);

const loadingLogin = ref(false);
const loadingVerify = ref(false);
const waitingOnVerification = ref(false);

const credentials = reactive({
  phone: "",
  login_code: "",
})

const toast = reactive({
  type: "",
  message: "",
});

const formattedCredentials = computed(() => {
  return {
    ...credentials,

    phone: credentials.phone.replaceAll(" ", ""),
    login_code: credentials.login_code
  };
});

const handleLogin = () => {
  toggleLoading(loadingLogin);
  api().post("/login", formattedCredentials.value)
    .then((response) => {
      isResponse.value = true;

      toggleLoading(loadingLogin);

      toast.message = response.data.message;
      toast.type = "success";

      message.value = "Enter the code sent to your phone number";

      waitingOnVerification.value = true;
      setTimeout(() => {
        isResponse.value = false;
      }, 1500);
    })
    .catch((error) => {
      isResponse.value = true;

      let errMsg = error.response ? error.response.data.message : error.message;

      if (typeof errMsg === 'undefined' || errMsg === null) {
        errMsg = "Network Error 😪 Give us a few minutes 🙏🏿!"
      }

      if (errMsg.includes("SQLSTATE[08006]") || errMsg.includes("not known (Connection")) {
        errMsg = "Network error!"
      }

      toast.message = errMsg;
      toast.type = "failure";

      toggleLoading(loadingLogin);

      setTimeout(() => {
        isResponse.value = false;
      }, 1500);
    });
};

// verify the login code
const handleVerify = () => {
  toggleLoading(loadingVerify);
  api().post("/login/verify", formattedCredentials.value)
    .then((response) => {
      toggleLoading(loadingVerify);
      isResponse.value = true;

      // localStorage.setItem('token', response.data);
      // authStore.setUserDataToken(response.data);
      setUserCookie(response.data);

      toast.message = "Verification successful! Proceeding to dashboard...";
      toast.type = "success";

      waitingOnVerification.value = false;

      setTimeout(() => {
        isResponse.value = false;
      }, 1500);

      router.push({ name: "dashboard" });
    })
    .catch((error) => {
      isResponse.value = true;
      toggleLoading(loadingVerify);

      let errMsg = error.response.data.message || error.message;

      if (errMsg.includes("SQLSTATE[08006]") || errMsg.includes("not known (Connection")) {
        errMsg = "Network error!"
      }

      toast.message = errMsg;
      toast.type = "failure";

      setTimeout(() => {
        isResponse.value = false;
      }, 1500);
    });
}
</script>