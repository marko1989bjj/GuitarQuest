<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

import MainLayout from "@/components/MainLayout.vue";

const songs = ref([]);

const search = ref("");
const selectedDifficulty = ref("All");

const loadSongs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "songs"));

    songs.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const filteredSongs = computed(() => {
  return songs.value.filter((song) => {
    const matchesSearch = song.title
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty.value === "All" ||
      song.difficulty === selectedDifficulty.value;

    return matchesSearch && matchesDifficulty;
  });
});

onMounted(() => {
  loadSongs();
});
</script>

<template>
  <MainLayout>
    <h1 class="mb-2 text-3xl font-bold sm:text-4xl">Guitar Songs</h1>

    <p class="mb-8 text-slate-400">Learn your favourite songs.</p>

    <!-- Filters -->
    <div class="mb-8 flex flex-col gap-4 md:flex-row">
      <input
        v-model="search"
        type="text"
        placeholder="Search song..."
        class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none md:flex-1"
      />

      <select
        v-model="selectedDifficulty"
        class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none md:w-60"
      >
        <option>All</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
    </div>

    <!-- Songs -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div
        v-for="song in filteredSongs"
        :key="song.id"
        class="rounded-2xl bg-slate-900 p-6 shadow-lg transition hover:bg-slate-800"
      >
        <h2 class="mb-2 text-2xl font-bold">
          {{ song.title }}
        </h2>

        <p class="mb-2 text-slate-400">
          {{ song.artist }}
        </p>

        <p class="mb-6 text-amber-400">
          {{ song.difficulty }}
        </p>

        <RouterLink
          :to="`/songs/${song.id}`"
          class="block rounded-xl bg-amber-400 py-3 text-center font-semibold text-black transition hover:bg-amber-300"
        >
          Open
        </RouterLink>
      </div>
    </div>
  </MainLayout>
</template>
