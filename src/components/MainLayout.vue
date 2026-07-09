<script setup>
import { computed, ref } from "vue";
import { auth } from "@/firebase/firebase";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const userInitial = computed(() => {
  if (!auth.currentUser?.email) {
    return "?";
  }

  return auth.currentUser.email.charAt(0).toUpperCase();
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white lg:flex">
    <!-- Mobile Header -->
    <header
      class="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden"
    >
      <button @click="toggleMenu" class="text-3xl text-amber-400">☰</button>

      <h1 class="text-xl font-bold text-amber-400">🎸 GuitarQuest</h1>

      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-black"
      >
        {{ userInitial }}
      </div>
    </header>

    <!-- Overlay -->
    <div
      v-if="isMenuOpen"
      @click="closeMenu"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    ></div>

    <!-- Mobile Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 p-6 transform transition-transform duration-300 lg:hidden',
        isMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="mb-10 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-amber-400">🎸 GuitarQuest</h1>

        <button @click="closeMenu" class="text-3xl">✕</button>
      </div>

      <nav class="space-y-3">
        <RouterLink
          @click="closeMenu"
          to="/dashboard"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          @click="closeMenu"
          to="/chords"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Chords
        </RouterLink>

        <RouterLink
          @click="closeMenu"
          to="/songs"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Songs
        </RouterLink>

        <RouterLink
          @click="closeMenu"
          to="/practice"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Practice
        </RouterLink>

        <RouterLink
          @click="closeMenu"
          to="/challenges"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Challenges
        </RouterLink>

        <RouterLink
          @click="closeMenu"
          to="/profile"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Profile
        </RouterLink>
      </nav>
    </aside>

    <!-- Desktop Sidebar -->
    <aside
      class="hidden w-64 border-r border-slate-800 bg-slate-900 p-6 lg:block"
    >
      <h1 class="mb-10 text-3xl font-bold text-amber-400">🎸 GuitarQuest</h1>

      <nav class="space-y-3">
        <RouterLink
          to="/dashboard"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/chords"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Chords
        </RouterLink>

        <RouterLink
          to="/songs"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Songs
        </RouterLink>

        <RouterLink
          to="/practice"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Practice
        </RouterLink>

        <RouterLink
          to="/challenges"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Challenges
        </RouterLink>

        <RouterLink
          to="/profile"
          class="block rounded-xl px-4 py-3 transition hover:bg-slate-800"
        >
          Profile
        </RouterLink>
      </nav>
    </aside>

    <!-- Main -->
    <main class="flex-1">
      <!-- Desktop Header -->
      <header
        class="hidden h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-8 lg:flex"
      >
        <h2 class="text-2xl font-semibold">GuitarQuest</h2>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 font-bold text-black"
        >
          {{ userInitial }}
        </div>
      </header>

      <section class="p-4 sm:p-6 lg:p-8">
        <slot />
      </section>
    </main>
  </div>
</template>
