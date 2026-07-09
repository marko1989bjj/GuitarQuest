<script setup>
import { ref, computed, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

import MainLayout from "@/components/MainLayout.vue";

const chords = ref([]);

const search = ref("");
const selectedLevel = ref("All");

const loadChords = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "chords"));

    chords.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const filteredChords = computed(() => {
  return chords.value.filter((chord) => {
    const matchesSearch = chord.name
      .toLowerCase()
      .includes(search.value.toLowerCase());

    const matchesLevel =
      selectedLevel.value === "All" || chord.level === selectedLevel.value;

    return matchesSearch && matchesLevel;
  });
});

onMounted(() => {
  loadChords();
});
</script>

<template>
  <MainLayout>
    <h1 class="mb-2 text-3xl font-bold sm:text-4xl">Guitar Chords</h1>

    <p class="mb-8 text-slate-400">Learn the most important guitar chords.</p>

    <!-- Filters -->
    <div class="mb-8 flex flex-col gap-4 md:flex-row">
      <input
        v-model="search"
        type="text"
        placeholder="Search chord..."
        class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none md:flex-1"
      />

      <select
        v-model="selectedLevel"
        class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none md:w-60"
      >
        <option>All</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="chord in filteredChords"
        :key="chord.id"
        class="rounded-2xl bg-slate-900 p-6 shadow-lg transition hover:bg-slate-800"
      >
        <h2 class="mb-3 text-2xl font-bold">
          {{ chord.name }}
        </h2>

        <p class="mb-2 text-slate-400">
          {{ chord.type }}
        </p>

        <p class="mb-6 text-amber-400">
          {{ chord.level }}
        </p>

        <RouterLink
          :to="`/chords/${chord.id}`"
          class="block rounded-xl bg-amber-400 py-3 text-center font-semibold text-black transition hover:bg-amber-300"
        >
          Learn
        </RouterLink>
      </div>
    </div>
  </MainLayout>
</template>
