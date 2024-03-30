<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <div class="page-header min-vh-90" loading="lazy">
    <v-container>
      <div class="d-flex flex-row align-items-center mb-3">
        <div class="d-flex flex-column">
          <v-avatar size="100" class="mb-2">
            <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="John Doe"
            />
          </v-avatar>
          <h4>{{ user.name }}</h4>
        </div>
        <div class="d-flex flex-column align-items-center p-2">
          <div class="p-2">3</div>
          <h6>created</h6>
        </div>
        <div class="d-flex flex-column align-items-center p-2">
          <div class="p-2">5</div>
          <h6>favourited</h6>
        </div>
        <v-row justify="center" class="mt-5">
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search Created"
              variant="outlined"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="profile">
        <p>{{ user.bio }}</p>
        <div class="posts">
          <h2>Posts</h2>
          <ul>
            <li v-for="post in user.posts" :key="post.id">
              {{ post.content }}
            </li>
          </ul>
        </div>
      </div>
    </v-container>
  </div>
  <DefaultFooter />
</template>

<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";

import { onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
</script>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: {
        name: "John Doe",
        bio: "I'm a software developer",
        posts: [
          { id: 1, content: "Plans 1" },
          { id: 2, content: "Plans 2" },
          { id: 3, content: "Plans 3" },
        ],
      },
    };
  },
  components: {
    // Add your components here
  },
};
</script>

<style scoped>
.profile {
  /* Add your styles here */
}

.posts {
  /* Add your styles here */
}
</style>
