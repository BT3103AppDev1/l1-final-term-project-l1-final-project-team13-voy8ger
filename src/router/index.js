import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import LogIn from "../views/Auth/LogIn.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/login",
      name: "LogIn",
      component: LogIn,
    },
    {
      path: "/prfle",
      name: "Profile",
      component: Profile,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: "/",
      name: "Home",
      component: Home,
    },
  ],
});

export default router;
