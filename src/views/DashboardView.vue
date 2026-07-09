<script setup>
import { ref, onMounted } from "vue";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useRouter } from "vue-router";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import MainLayout from "@/components/MainLayout.vue";

const router = useRouter();

const totalChords = ref(0);
const learnedChords = ref(0);

const totalSongs = ref(0);
const learnedSongs = ref(0);

const totalChallenges = ref(0);
const completedChallenges = ref(0);

const practiceTime = ref(0);
const totalXP = ref(0);
const xpProgress = ref(0);

const level = ref(1);
const streak = ref(0);

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};

const loadDashboardData = async () => {
  try {
    // Total chords
    totalChords.value = (await getDocs(collection(db, "chords"))).size;

    // Total songs
    totalSongs.value = (await getDocs(collection(db, "songs"))).size;

    // Total challenges
    totalChallenges.value = (await getDocs(collection(db, "challenges"))).size;

    // Completed challenges
    const completedChallengesQuery = query(
      collection(db, "userChallenges"),
      where("userId", "==", auth.currentUser.uid),
      where("completed", "==", true),
    );

    completedChallenges.value = (await getDocs(completedChallengesQuery)).size;

    // Learned chords
    const learnedChordsQuery = query(
      collection(db, "userChords"),
      where("userId", "==", auth.currentUser.uid),
      where("status", "==", "learned"),
    );

    learnedChords.value = (await getDocs(learnedChordsQuery)).size;

    // Learned songs
    const learnedSongsQuery = query(
      collection(db, "userSongs"),
      where("userId", "==", auth.currentUser.uid),
      where("status", "==", "learned"),
    );

    learnedSongs.value = (await getDocs(learnedSongsQuery)).size;

    // User data
    const userRef = doc(db, "users", auth.currentUser.uid);

    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      practiceTime.value = Number(user.practiceTime) || 0;
      totalXP.value = Number(user.ukupniXP) || 0;
      level.value = Number(user.level) || 1;

      let currentStreak = Number(user.streak) || 0;

      // XP progress inside current level
      xpProgress.value = totalXP.value % 100;

      // Reset streak if user missed one or more days
      if (user.zadnjiDanVjezbanja) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPractice = new Date(user.zadnjiDanVjezbanja);
        lastPractice.setHours(0, 0, 0, 0);

        const difference =
          (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24);

        if (difference > 1) {
          currentStreak = 0;

          await updateDoc(userRef, {
            streak: 0,
          });
        }
      }

      streak.value = currentStreak;
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
  <MainLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-bold sm:text-4xl">Welcome back 👋</h1>

      <p class="mt-2 text-slate-400">Continue your guitar learning journey.</p>
    </div>

    <!-- First Row -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Practice -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">Practice</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ practiceTime }}
        </p>

        <p class="mt-3 text-slate-400">Minutes practiced</p>
      </div>

      <!-- Chords -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">Chords</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ learnedChords }} / {{ totalChords }}
        </p>

        <p class="mt-3 text-slate-400">Learned chords</p>
      </div>

      <!-- Songs -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">Songs</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ learnedSongs }} / {{ totalSongs }}
        </p>

        <p class="mt-3 text-slate-400">Learned songs</p>
      </div>

      <!-- XP -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">XP</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ totalXP }}
        </p>

        <p class="mt-3 text-slate-400">Total XP</p>

        <!-- XP Progress -->
        <div class="mt-6">
          <div class="mb-2 flex justify-between text-sm text-slate-400">
            <span>Next Level</span>

            <span>{{ xpProgress }} / 100 XP</span>
          </div>

          <div class="h-3 w-full rounded-full bg-slate-700">
            <div
              class="h-3 rounded-full bg-amber-400 transition-all duration-500"
              :style="{ width: xpProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Second Row -->
    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <!-- Streak -->
      <div
        class="rounded-2xl border border-orange-500 bg-orange-500/10 p-6 shadow-lg"
      >
        <h2 class="mb-4 text-xl font-semibold text-orange-400">🔥 Streak</h2>

        <p class="text-4xl font-bold sm:text-5xl">
          {{ streak }}
        </p>

        <p class="mt-3 text-slate-400">
          {{ streak === 1 ? "day" : "days" }}
        </p>
      </div>

      <!-- Level -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">Level</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ level }}
        </p>

        <p class="mt-3 text-slate-400">Current level</p>
      </div>

      <!-- Achievements -->
      <div class="rounded-2xl bg-slate-900 p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-semibold">Achievements</h2>

        <p class="text-4xl font-bold text-amber-400 sm:text-5xl">
          {{ completedChallenges }} / {{ totalChallenges }}
        </p>

        <p class="mt-3 text-slate-400">Completed achievements</p>
      </div>
    </div>

    <!-- Account -->
    <div class="mt-6 rounded-2xl bg-slate-900 p-6 shadow-lg">
      <h2 class="mb-4 text-xl font-semibold">Account</h2>

      <p class="mb-6 break-all text-slate-400">
        {{ auth.currentUser?.email }}
      </p>

      <button
        @click="logout"
        class="w-full rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500 sm:w-auto"
      >
        Logout
      </button>
    </div>
  </MainLayout>
</template>
