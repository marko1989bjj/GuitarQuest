<template>
  <nav
    class="fixed bottom-0 left-0 w-full border-t border-zinc-800 bg-zinc-950"
  >
    <div class="mx-auto flex max-w-md items-center justify-around py-3">
      <RouterLink to="/dashboard"> Home </RouterLink>

      <RouterLink to="/chords"> Chords </RouterLink>

      <RouterLink to="/songs"> Songs </RouterLink>

      <RouterLink to="/practice"> Practice </RouterLink>

      <RouterLink to="/profile"> Profile </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
