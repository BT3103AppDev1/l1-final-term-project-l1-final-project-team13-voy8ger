import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import LogIn from "../views/Auth/LogIn.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Explore from "../views/Explore.vue";
//import Create from "../views/Create.vue";


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
    {
      path: "/explore",
      name: "Explore",
      component: Explore,
    },
    /*
    {
      path: "/create",
      name: "Create",
      component: Create,
    },
    */
    {
      path: "/",
      redirect: "/home" // Redirect the root path to Home
    },
  ],
});

export default router;
