<script setup>
import { ref } from "vue";

import MainLayout from "@/components/MainLayout.vue";

import { auth, db } from "@/firebase/firebase";

import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const minutes = ref("");
const notes = ref("");
const error = ref("");

const setMinutes = (value) => {
  minutes.value = value;
  error.value = "";
};

const clearMinutes = () => {
  minutes.value = "";
  error.value = "";
};

const savePractice = async () => {
  error.value = "";

  const practicedMinutes = Number(minutes.value);

  if (!auth.currentUser) {
    error.value = "You must be logged in.";
    return;
  }

  if (!practicedMinutes || practicedMinutes <= 0) {
    error.value = "Please enter a valid number of minutes.";
    return;
  }

  try {
    // Save practice session
    await addDoc(collection(db, "practice"), {
      userId: auth.currentUser.uid,
      minutes: practicedMinutes,
      notes: notes.value,
      date: new Date().toLocaleDateString(),
    });

    // User document
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      const newPracticeTime = Number(user.practiceTime || 0) + practicedMinutes;

      const newXP = Number(user.ukupniXP || 0) + practicedMinutes;

      const newLevel = Math.floor(newXP / 100) + 1;

      // ---------------- STREAK ----------------

      let streak = Number(user.streak || 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let lastPractice = null;

      if (user.zadnjiDanVjezbanja) {
        lastPractice = new Date(user.zadnjiDanVjezbanja);
        lastPractice.setHours(0, 0, 0, 0);
      }

      if (!lastPractice) {
        // First practice ever
        streak = 1;
      } else {
        const difference =
          (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24);

        if (difference === 0) {
          // Already practiced today
        } else if (difference === 1) {
          // Consecutive day
          streak++;
        } else {
          // Missed one or more days
          streak = 1;
        }
      }

      // Update user
      await updateDoc(userRef, {
        practiceTime: newPracticeTime,
        ukupniXP: newXP,
        level: newLevel,
        streak: streak,
        zadnjiDanVjezbanja: today.toISOString(),
      });
    }

    alert("Practice saved successfully!");

    minutes.value = "";
    notes.value = "";
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <MainLayout>
    <h1 class="mb-2 text-3xl font-bold sm:text-4xl">Practice</h1>

    <p class="mb-8 text-slate-400">Save today's practice session.</p>

    <div class="mx-auto max-w-xl space-y-6">
      <div>
        <label class="mb-2 block font-semibold"> Minutes Practiced </label>

        <!-- Quick Buttons -->
        <div class="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <button
            type="button"
            @click="setMinutes(15)"
            :class="[
              'rounded-xl px-4 py-3 font-semibold transition',
              Number(minutes) === 15
                ? 'bg-amber-400 text-black'
                : 'bg-slate-700 hover:bg-amber-400 hover:text-black',
            ]"
          >
            15 min
          </button>

          <button
            type="button"
            @click="setMinutes(30)"
            :class="[
              'rounded-xl px-4 py-3 font-semibold transition',
              Number(minutes) === 30
                ? 'bg-amber-400 text-black'
                : 'bg-slate-700 hover:bg-amber-400 hover:text-black',
            ]"
          >
            30 min
          </button>

          <button
            type="button"
            @click="setMinutes(45)"
            :class="[
              'rounded-xl px-4 py-3 font-semibold transition',
              Number(minutes) === 45
                ? 'bg-amber-400 text-black'
                : 'bg-slate-700 hover:bg-amber-400 hover:text-black',
            ]"
          >
            45 min
          </button>

          <button
            type="button"
            @click="setMinutes(60)"
            :class="[
              'rounded-xl px-4 py-3 font-semibold transition',
              Number(minutes) === 60
                ? 'bg-amber-400 text-black'
                : 'bg-slate-700 hover:bg-amber-400 hover:text-black',
            ]"
          >
            60 min
          </button>

          <button
            type="button"
            @click="clearMinutes"
            class="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 sm:col-span-1 col-span-2"
          >
            Clear
          </button>
        </div>

        <input
          v-model="minutes"
          type="number"
          min="1"
          placeholder="Example: 30"
          class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none"
        />

        <p class="mt-2 text-sm text-slate-400">
          💡 Tip: Use the quick buttons above or enter any custom duration.
        </p>

        <p v-if="error" class="mt-3 text-sm text-red-400">
          {{ error }}
        </p>
      </div>

      <div>
        <label class="mb-2 block font-semibold"> Notes </label>

        <textarea
          v-model="notes"
          rows="5"
          placeholder="What did you practice today?"
          class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-amber-400 focus:outline-none"
        ></textarea>
      </div>

      <button
        @click="savePractice"
        class="w-full rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300"
      >
        Save Practice
      </button>
    </div>
  </MainLayout>
</template>
