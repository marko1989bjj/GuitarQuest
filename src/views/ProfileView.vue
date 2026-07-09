<script setup>
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "vue-router";

import MainLayout from "@/components/MainLayout.vue";

const router = useRouter();

const logout = async () => {
  try {
    await signOut(auth);
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <MainLayout>
    <h1 class="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">Profile</h1>

    <div
      class="mx-auto w-full max-w-xl rounded-2xl bg-slate-900 p-5 shadow-lg sm:p-8"
    >
      <h2 class="mb-6 text-xl font-semibold sm:text-2xl">
        Account Information
      </h2>

      <div class="space-y-4">
        <div>
          <p class="text-slate-400">Email</p>

          <p class="break-all text-base font-medium sm:text-lg">
            {{ auth.currentUser?.email }}
          </p>
        </div>
      </div>

      <button
        @click="logout"
        class="mt-8 w-full rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-500 sm:w-auto"
      >
        Logout
      </button>
    </div>
  </MainLayout>
</template>
