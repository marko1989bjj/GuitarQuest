<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter, RouterLink } from "vue-router";

import { Eye, EyeOff } from "lucide-vue-next";

const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const error = ref("");

const login = async () => {
  error.value = "";

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);

    router.push("/dashboard");
  } catch (err) {
    error.value = "Invalid email or password.";
  }
};
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white sm:px-6"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl sm:p-10"
    >
      <div class="mb-8 flex flex-col items-center">
        <div
          class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-4xl shadow-lg sm:h-20 sm:w-20 sm:text-5xl"
        >
          🎸
        </div>

        <h1 class="text-3xl font-bold text-amber-400 sm:text-4xl">
          GuitarQuest
        </h1>
      </div>

      <p class="mb-8 text-center text-slate-400">
        Sign in to continue your journey.
      </p>

      <form @submit.prevent="login" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-amber-400"
        />

        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-12 outline-none transition focus:border-amber-400"
          />

          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-amber-400"
          >
            <Eye v-if="!showPassword" :size="20" />
            <EyeOff v-else :size="20" />
          </button>
        </div>

        <button
          type="submit"
          class="w-full rounded-xl bg-amber-400 py-3 font-bold text-black transition hover:bg-amber-300"
        >
          Login
        </button>

        <p v-if="error" class="text-center text-red-400">
          {{ error }}
        </p>

        <div class="text-center text-sm text-slate-400 sm:text-base">
          Don't have an account?

          <RouterLink
            to="/register"
            class="ml-1 text-amber-400 hover:underline"
          >
            Register
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
