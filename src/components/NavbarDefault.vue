<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { useWindowsWidth } from "../assets/js/useWindowsWidth";

import { auth } from "@/firebase"; // Import Firebase auth module

// images
import ArrDark from "@/assets/img/down-arrow-dark.svg";
import DownArrWhite from "@/assets/img/down-arrow-white.svg";

// Access authentication state from Firebase auth module
const isAuthenticated = ref(false); // Initialize as false initially
const router = useRouter();

// Function to handle sign in
async function handleSignIn() {
  router.push("/login"); // Redirect to login page
}

// Function to handle sign out
async function handleSignOut() {
  try {
    await auth.signOut(); // Call Firebase's signOut method
    router.push("/"); // Redirect to home page after signing out
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
}

auth.onAuthStateChanged((user) => {
  isAuthenticated.value = !!user; // Update isAuthenticated based on user authentication status
});

//dont change
const props = defineProps({
  action: {
    type: Object,
    route: String,
    color: String,
    label: String,
    default: () => ({
      route: "https://www.creative-tim.com/product/vue-material-kit",
      color: "bg-gradient-success",
      label: "Free Download",
    }),
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  light: {
    type: Boolean,
    default: false,
  },
  dark: {
    type: Boolean,
    default: false,
  },
  sticky: {
    type: Boolean,
    default: false,
  },
  darkText: {
    type: Boolean,
    default: false,
  },
});

// set arrow  color
function getArrowColor() {
  if (props.transparent && textDark.value) {
    return ArrDark;
  } else if (props.transparent) {
    return DownArrWhite;
  } else {
    return ArrDark;
  }
}

// set text color
const getTextColor = () => {
  let color;
  if (props.transparent && textDark.value) {
    color = "text-dark";
  } else if (props.transparent) {
    color = "text-white";
  } else {
    color = "text-dark";
  }

  return color;
};

// set nav color on mobile && desktop
let textDark = ref(props.darkText);
const { type } = useWindowsWidth();

if (type.value === "mobile") {
  textDark.value = true;
} else if (type.value === "desktop" && textDark.value == false) {
  textDark.value = false;
}

watch(
  () => type.value,
  (newValue) => {
    if (newValue === "mobile") {
      textDark.value = true;
    } else {
      textDark.value = false;
    }
  }
);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg top-0"
    :class="{
      'z-index-3 w-100 shadow-none navbar-transparent position-absolute my-3':
        props.transparent,
      'my-3 blur border-radius-lg z-index-3 py-2 shadow py-2 start-0 end-0 mx-4 position-absolute mt-4':
        props.sticky,
      'navbar-light bg-white py-3': props.light,
      ' navbar-dark bg-gradient-dark z-index-3 py-3': props.dark,
    }"
  >
    <div
      :class="
        props.transparent || props.light || props.dark
          ? 'container'
          : 'container-fluid px-0'
      "
    >
      <!--Brand logo-->
      <RouterLink
        class="navbar-brand d-none d-md-block"
        :class="[
          (props.transparent && textDark.value) || !props.transparent
            ? 'text-dark font-weight-bolder ms-sm-3'
            : 'text-white font-weight-bolder ms-sm-3',
        ]"
        :to="{ name: 'Home' }"
        rel="tooltip"
        title="Designed and Coded by VOY8GER"
        data-placement="bottom"
      >
        V O Y 8 G E R
      </RouterLink>

      <div
        class="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
        id="navigation"
      >
        <ul class="navbar-nav navbar-nav-hover ms-auto">
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'AboutUs' }"
              >About Us</RouterLink
            >
          </li>

          <!--
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'ContactUs' }"
              >Contact Us</RouterLink
            >
          </li>
        -->

          <li class="nav-item dropdown dropdown-hover mx-2">
            <RouterLink
              :to="{ name: 'Explore' }"
              rel="tooltip"
              title="Designed and Coded by VOY8GER"
              data-placement="bottom"
              class="nav-link d-flex cursor-pointer align-items-center"
              >Explore</RouterLink
            >
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'CreatePlan' }"
              >Create</RouterLink
            >
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'Favourites' }"
              >Favourites</RouterLink
            >
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'Analytics' }"
              >Analytics</RouterLink
            >
          </li>

          <li v-if="isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'Profile' }"
              >Profile</RouterLink
            >
          </li>
        </ul>

        <ul class="navbar-nav d-lg-block d-none">
          <li class="nav-item">
            <!-- Conditional rendering based on authentication status -->
            <button
              v-if="!isAuthenticated"
              @click="handleSignIn"
              class="btn btn-sm mb-0"
              :class="action.color"
            >
              Sign In
            </button>
            <button
              v-else
              @click="handleSignOut"
              class="btn btn-sm mb-0"
              :class="action.color"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>
