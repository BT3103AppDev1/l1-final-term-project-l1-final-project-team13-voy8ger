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
      <div
        class="d-flex flex-row justify-content-between align-items-center mb-3 mt-15"
      >
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
          <div class="p-2">{{ this.user.plans.length }}</div>
          <h6>created</h6>
        </div>
        <div class="d-flex flex-column align-items-center p-2">
          <div class="p-2">{{ this.user.saved.length }}</div>
          <h6>favourited</h6>
        </div>
        <div class="w-50 p-2">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search Created"
            variant="outlined"
            clearable
          ></v-text-field>
        </div>
      </div>
      <div class="profile">
        <p>{{ user.bio }}</p>
        <v-row>
          <v-col v-for="output in user.plans" :key="output.planId" cols="4">
            <v-card class="mx-auto" max-width="300" max-height="250">
              <v-img
                height="150px"
                src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                cover
              ></v-img>

              <v-card-title>{{ output.Plan_Name }}</v-card-title>

              <v-row align="center">
                <v-col cols="6">
                  <v-card-text>{{ output.num_likes }} likes</v-card-text>
                  <v-card-subtitle>{{
                    output.plan_description
                  }}</v-card-subtitle>
                </v-col>

                <v-col cols="6">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      icon
                      size="small"
                      variant="plain"
                      @click="toggleHeart(output.planId)"
                    >
                      <v-icon>{{
                        user.saved.includes(output.planId)
                          ? "mdi-heart"
                          : "mdi-heart-outline"
                      }}</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
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
        id: "",
        name: "John Doe",
        email: "",
        bio: "I'm a software developer",
        plans: [],
        saved: [],
      },
      search: "",
    };
  },

  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.user.email = user.email;
        this.fetchAndUpdateData(this.user.email);
      }
    });
  },

  methods: {
    async toggleHeart(planId) {
      // get document of that user
      const docRef = doc(db, "Users", String(this.user.email));
      const docSnap = await getDoc(docRef);
      if (this.user.saved.includes(planId)) {
        // remove that plan from my favourites
        await this.deleteListItem(docRef, docSnap, "saved_list", planId);
      } else {
        // add that plan to my favourites
        await updateDoc(docRef, {
          saved_list: [...this.user.saved, planId],
        });
      }
      // refresh
      this.user.plans = [];
      this.fetchAndUpdateData(String(this.user.email));
    },

    async deleteListItem(docRef, docSnap, listFieldName, itemToRemove) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const data = docSnap.data();
          // Get the list from the document data
          const list = data[listFieldName];
          console.log(list);
          // Remove the item from the list
          const updatedList = list.filter((item) => item !== itemToRemove);
          // Update the document with the modified list
          await updateDoc(docRef, {
            [listFieldName]: updatedList,
          });
          console.log("Item removed from the list: ", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing item from list: ", error);
      }
    },

    async fetchAndUpdateData(userEmail) {
      // get created plan list of the user
      const docSnap = await getDoc(doc(db, "Users", String(userEmail)));
      this.user.id = docSnap.data().username;
      this.user.name = docSnap.data().Name;
      this.user.email = docSnap.data().email;

      console.log("created: " + docSnap.data().plans_list);
      console.log("saved: " + docSnap.data().saved_list);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().plans_list.map(async (e) => {
        this.user.plans.push((await getDoc(doc(db, "Plans", e))).data());
      });
      this.user.saved = docSnap.data().saved_list;

      console.log("created temp: " + this.user.plans);
      console.log("saved temp: " + this.user.saved);
    },
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
