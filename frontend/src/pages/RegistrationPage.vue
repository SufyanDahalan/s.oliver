<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const username = ref<string>('')
const password = ref<string>('')

async function register() {
  let res = await authStore.register(username.value, password.value)
  if (res) {
    router.push({name: 'Login'})
  }

}
</script>

<template>
  <div class="w-full h-screen flex flex-col  justify-center place-items-center gap-4">
    <h1>Very simple registration form</h1>
    <div class="flex flex-col w-min gap-2">
      <input id="username-input" class="rounded-md px-3 py-2" aria-label="Username" placeholder="Username" type="text"
        v-model="username">
      <input id="password-input" class="rounded-md px-3 py-2" aria-label="Password" placeholder="Password" type="password"
        v-model="password">
      <button class="bg-gray-800 text-white rounded-md px-3 py-2 w-full" @click="register">Register</button>
    </div>
  </div>
</template>

<style lang="pcss">

</style>
