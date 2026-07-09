<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
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

      <div class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-amber-400"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-amber-400"
        />

        <button
          @click="login"
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
      </div>
    </div>
  </div>
</template>
