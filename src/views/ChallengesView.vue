<script setup>
import { ref, onMounted } from "vue";

import MainLayout from "@/components/MainLayout.vue";

import { auth, db } from "@/firebase/firebase";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const challenges = ref([]);

const practiceTime = ref(0);
const learnedChords = ref(0);
const learnedSongs = ref(0);

const completedChallenges = ref([]);

const loadChallenges = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "challenges"));

    challenges.value = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const loadUserProgress = async () => {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const user = userSnap.data();

      practiceTime.value = Number(user.practiceTime || 0);
    }

    const chordsQuery = query(
      collection(db, "userChords"),
      where("userId", "==", auth.currentUser.uid),
      where("status", "==", "learned"),
    );

    learnedChords.value = (await getDocs(chordsQuery)).size;

    const songsQuery = query(
      collection(db, "userSongs"),
      where("userId", "==", auth.currentUser.uid),
      where("status", "==", "learned"),
    );

    learnedSongs.value = (await getDocs(songsQuery)).size;
  } catch (error) {
    console.log(error);
  }
};

const loadCompletedChallenges = async () => {
  try {
    const completedQuery = query(
      collection(db, "userChallenges"),
      where("userId", "==", auth.currentUser.uid),
      where("completed", "==", true),
    );

    const querySnapshot = await getDocs(completedQuery);

    completedChallenges.value = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
  } catch (error) {
    console.log(error);
  }
};

const getProgress = (challenge) => {
  if (challenge.type === "practice") {
    return practiceTime.value;
  }

  if (challenge.type === "chords") {
    return learnedChords.value;
  }

  if (challenge.type === "songs") {
    return learnedSongs.value;
  }

  return 0;
};

const isCompleted = (challenge) => {
  return getProgress(challenge) >= Number(challenge.target);
};

const autoCompleteChallenges = async () => {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    let user = userSnap.data();

    for (const challenge of challenges.value) {
      const alreadyCompleted = completedChallenges.value.some(
        (completedChallenge) => completedChallenge.challengeId === challenge.id,
      );

      if (alreadyCompleted) continue;

      if (getProgress(challenge) < Number(challenge.target)) continue;

      const documentId = `${auth.currentUser.uid}_${challenge.id}`;

      await setDoc(doc(db, "userChallenges", documentId), {
        userId: auth.currentUser.uid,
        challengeId: challenge.id,
        completed: true,
        completedAt: new Date().toLocaleDateString(),
      });

      const newXP = Number(user.ukupniXP || 0) + Number(challenge.reward);
      const newLevel = Math.floor(newXP / 100) + 1;

      await updateDoc(userRef, {
        ukupniXP: newXP,
        level: newLevel,
      });

      user.ukupniXP = newXP;
    }

    await loadCompletedChallenges();
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await loadChallenges();
  await loadUserProgress();
  await loadCompletedChallenges();
  await autoCompleteChallenges();
});
</script>

<template>
  <MainLayout>
    <h1 class="mb-2 text-3xl font-bold sm:text-4xl">Challenges</h1>

    <p class="mb-8 text-slate-400">
      Complete achievements and earn XP automatically.
    </p>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div
        v-for="challenge in challenges"
        :key="challenge.id"
        class="rounded-2xl bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800"
      >
        <h2 class="mb-3 text-2xl font-bold">
          {{ challenge.title }}
        </h2>

        <p class="mb-5 text-slate-400">
          {{ challenge.description }}
        </p>

        <!-- Reward -->
        <div class="mb-5">
          <span
            class="inline-block rounded-full bg-amber-400 px-4 py-2 font-semibold text-black"
          >
            🏆 +{{ challenge.reward }} XP
          </span>
        </div>

        <!-- Progress -->
        <div class="mb-4">
          <div
            class="mb-2 flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:justify-between"
          >
            <span>Progress</span>

            <span v-if="challenge.type === 'practice'">
              {{ getProgress(challenge) }} / {{ challenge.target }} min
            </span>

            <span v-else-if="challenge.type === 'chords'">
              {{ getProgress(challenge) }} / {{ challenge.target }} chords
            </span>

            <span v-else-if="challenge.type === 'songs'">
              {{ getProgress(challenge) }} / {{ challenge.target }} songs
            </span>
          </div>

          <div class="h-4 w-full rounded-full bg-slate-700">
            <div
              class="h-4 rounded-full bg-amber-400 transition-all duration-500"
              :style="{
                width:
                  Math.min(
                    (getProgress(challenge) / Number(challenge.target)) * 100,
                    100,
                  ) + '%',
              }"
            ></div>
          </div>
        </div>

        <!-- Status -->
        <div class="mt-6 flex justify-center">
          <div
            :class="[
              'flex h-12 w-12 items-center justify-center rounded-full text-2xl font-bold transition-all',
              isCompleted(challenge)
                ? 'bg-amber-400 text-black'
                : 'bg-slate-700 text-slate-400',
            ]"
          >
            {{ isCompleted(challenge) ? "✓" : "⏳" }}
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
