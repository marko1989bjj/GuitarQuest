<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

import MainLayout from "@/components/MainLayout.vue";

import { db, auth } from "@/firebase/firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";

const route = useRoute();

const chord = ref(null);
const currentStatus = ref("");

const loadChord = async () => {
  try {
    const docRef = doc(db, "chords", route.params.id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      chord.value = docSnap.data();
    }
  } catch (error) {
    console.log(error);
  }
};

const loadChordStatus = async () => {
  try {
    const documentId = `${auth.currentUser.uid}_${route.params.id}`;

    const docRef = doc(db, "userChords", documentId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      currentStatus.value = docSnap.data().status;
    }
  } catch (error) {
    console.log(error);
  }
};

const saveChordStatus = async (status) => {
  try {
    // Ako je već Learned, više nije moguće mijenjati status
    if (currentStatus.value === "learned") {
      return;
    }

    const documentId = `${auth.currentUser.uid}_${route.params.id}`;

    await setDoc(doc(db, "userChords", documentId), {
      userId: auth.currentUser.uid,
      chordId: route.params.id,
      status: status,
      date: new Date().toLocaleDateString(),
    });

    currentStatus.value = status;

    alert(`Chord marked as ${status}!`);
  } catch (error) {
    console.log(error);
  }
};

const imageUrl = (image) => {
  return `${import.meta.env.BASE_URL}${image.replace(/^\/+/, "")}`;
};

onMounted(() => {
  loadChord();
  loadChordStatus();
});
</script>

<template>
  <MainLayout>
    <div v-if="chord" class="mx-auto max-w-5xl">
      <h1 class="mb-3 text-4xl font-bold sm:text-5xl">
        {{ chord.name }}
      </h1>

      <div class="mb-6 flex flex-wrap gap-3 sm:mb-8">
        <span class="rounded-full bg-slate-700 px-4 py-2 text-slate-200 shadow">
          {{ chord.type }}
        </span>

        <span
          class="rounded-full bg-amber-400 px-4 py-2 font-semibold text-black shadow"
        >
          {{ chord.level }}
        </span>
      </div>

      <!-- Chord Image -->
      <div
        class="mb-6 flex justify-center rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-xl sm:mb-8 sm:p-8"
      >
        <div
          class="flex w-full max-w-xl justify-center rounded-xl bg-white p-4 shadow-inner sm:p-8"
        >
          <img
            :src="imageUrl(chord.image)"
            :alt="chord.name"
            class="max-h-72 object-contain sm:max-h-80"
          />
        </div>
      </div>

      <!-- Description -->
      <div
        class="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-xl sm:p-8"
      >
        <h2 class="mb-4 text-2xl font-semibold sm:text-3xl">Description</h2>

        <p
          class="mb-8 text-base leading-7 text-slate-300 sm:mb-10 sm:text-lg sm:leading-8"
        >
          {{ chord.description }}
        </p>

        <div class="mb-8 h-px bg-slate-700"></div>

        <h2 class="mb-4 text-2xl font-semibold sm:text-3xl">Current Status</h2>

        <span
          v-if="currentStatus === 'learned'"
          class="inline-flex items-center rounded-full bg-amber-400 px-5 py-2 font-semibold text-black"
        >
          ✔ Learned
        </span>

        <span
          v-else-if="currentStatus === 'learning'"
          class="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 font-semibold text-white"
        >
          📖 Learning
        </span>

        <span
          v-else
          class="inline-flex items-center rounded-full bg-slate-600 px-5 py-2 text-slate-200"
        >
          Not selected
        </span>

        <div
          class="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:flex-wrap"
        >
          <RouterLink
            to="/chords"
            class="rounded-xl bg-slate-700 px-8 py-3 text-center font-semibold transition hover:bg-slate-600"
          >
            ← Back
          </RouterLink>

          <template v-if="currentStatus !== 'learned'">
            <button
              @click="saveChordStatus('learning')"
              class="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Learning
            </button>

            <button
              @click="saveChordStatus('learned')"
              class="rounded-xl bg-amber-400 px-8 py-3 font-semibold text-black transition hover:bg-amber-300"
            >
              Learned
            </button>
          </template>
        </div>
      </div>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold">Loading...</h1>
    </div>
  </MainLayout>
</template>
