<script setup lang="ts">
import TheWelcome from '@/components/TheWelcome.vue'
import HelloWorld from '@/components/HelloWorld.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>

    <TheWelcome />
  </main>
</template>
