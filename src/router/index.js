import { createRouter, createWebHistory } from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import LogIn from "../views/Auth/LogIn.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import Explore from "../views/Explore.vue";
import CreatePlan from "../views/CreatePlan.vue";
import Favourites from "../views/Favourites.vue";
import SinglePlan from "@/views/SinglePlan.vue";
import AboutView from "../views/LandingPages/AboutUs/AboutView.vue";
import ContactView from "../views/LandingPages/ContactUs/ContactView.vue";
import EditProfile from "@/views/EditProfile.vue";
import EditPlan from "@/views/EditPlan.vue";

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
      path: "/editprfle",
      name: "EditProfile",
      component: EditProfile,
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
    },
    {
      path: "/favourites",
      name: "Favourites",
      component: Favourites,
    },
    {
      path: "/prfle/createplan",
      name: "CreatePlan",
      component: CreatePlan,
    },
    {
      path: "/SinglePlan",
      name: "SinglePlan",
      component: SinglePlan,
    },
    /*
    {
      path: "/about-us",
      name: "AboutUs",
      component: () => import('@/views/LandingPages/AboutUs/AboutView.vue')
    },
    */

    {
      path: "/about-us",
      name: "AboutUs",
      component: AboutView,
    },

    {
      path: "/contact-us",
      name: "ContactUs",
      component: ContactView,
    },
    {
      path: "/update-plan/:planId",
      name: "UpdatePlan",
      component: EditPlan,
      props: true,
    },
  ],
});

export default router;
