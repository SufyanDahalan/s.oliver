<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { RouterLink } from 'vue-router'

const authStore = useAuthStore();
const username = ref<string>('')
const password = ref<string>('')
const validationError = ref<boolean>(false)

async function login() {
  let res = await authStore.login(username.value, password.value)
  if (res) {
    router.push({ name: 'Cart' })
  }
  else {
    validationError.value = true
    setTimeout(() => {
      validationError.value = false
    }, 3000);
  }

}
</script>

<template>
  <div class="w-full h-screen flex flex-col  justify-center place-items-center gap-4">
    <h1>Very simple login form</h1>
    <div class="flex flex-col w-min gap-2">
      <span v-if="validationError">Username or Password is wrong!</span>
      <input id="username-input" :class="{ 'border-2 border-red-600': validationError }" class="rounded-md px-3 py-2"
        aria-label="Username" placeholder="Username" type="text" v-model="username">
      <input id="password-input" :class="{ 'border-2 border-red-600': validationError }" class="rounded-md px-3 py-2"
        aria-label="Password" placeholder="Password" type="password" v-model="password">
      <button class="bg-gray-800 text-white rounded-md px-3 py-2 w-full" @click="login">Login</button>
      <RouterLink :to="'/register'" class="text-blue-700">
        Create new Account
      </RouterLink>
    </div>
  </div>
</template>

<style lang="pcss">

</style>
