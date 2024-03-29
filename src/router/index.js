import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import LogIn from "../views/Auth/LogIn.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Explore from "../views/Explore.vue";
import Favourites from "../views/Favourites.vue";

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
      path: "/explore",
      name: "Explore",
      component: Explore,
    },
    {
      path: "/",
      name: "Home",
      component: Home,
    }, {
      path:"/favourites",
      name: "Favourites",
      component: Favourites
    }
  ],
});

export default router;
