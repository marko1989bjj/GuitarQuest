import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";
import ChordsView from "@/views/ChordsView.vue";
import SongsView from "@/views/SongsView.vue";
import PracticeView from "@/views/PracticeView.vue";
import ChallengesView from "@/views/ChallengesView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ChordDetailView from "@/views/ChordDetailView.vue";

import { auth } from "@/firebase/firebase";
import SongDetailView from "@/views/SongDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/chords",
      name: "chords",
      component: ChordsView,
    },
    {
      path: "/chords/:id",
      name: "chord-detail",
      component: ChordDetailView,
    },
    {
      path: "/songs",
      name: "songs",
      component: SongsView,
    },
    {
      path: "/songs/:id",
      name: "song-detail",
      component: SongDetailView,
    },
    {
      path: "/practice",
      name: "practice",
      component: PracticeView,
    },
    {
      path: "/challenges",
      name: "challenges",
      component: ChallengesView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const protectedRoutes = [
    "/dashboard",
    "/chords",
    "/songs",
    "/practice",
    "/challenges",
    "/profile",
  ];

  const user = auth.currentUser;

  if (protectedRoutes.includes(to.path) && !user) {
    return next("/");
  }

  if (user && (to.path === "/" || to.path === "/register")) {
    return next("/dashboard");
  }

  next();
});

export default router;
