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
        class="d-flex flex-row justify-content-between align-items-center mb-3 mt-10"
      >
        <div class="d-flex flex-column">
          <v-avatar size="100" class="mb-2">
            <v-img :src="user.profilePic" alt="user profile picture" />
          </v-avatar>
          <h4>{{ user.name }}</h4>
        </div>
        <div class="d-flex flex-column align-items-center p-2">
          <div class="p-2">{{ user.plans.length }}</div>
          <h6>created</h6>
        </div>
        <div class="d-flex flex-column align-items-center p-2">
          <div class="p-2">{{ user.saved.length }}</div>
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
        <p v-if="user.bio != null">{{ user.bio }}</p>
        <v-btn class="w-50 mb-5" @click="goEdit">Edit Profile</v-btn>
        <v-row>
          <v-col v-for="output in filterer" cols="4">
            <v-card
              class="mx-auto card"
              max-width="330"
              max-height="250"
              v-on:click="goToUpdatePage(output.planId)"
            >
              <v-img
                class="align-end text-white"
                height="150"
                :src="output.displayPic"
                cover
              >
                <v-card-title>{{ output.Plan_Name }}</v-card-title>
              </v-img>

              <v-row align="center">
                <v-col cols="6">
                  <v-card-text>
                    <div>{{ output.likeCount }} likes</div>
                    <div class="truncate">{{ output.plan_description }}</div>
                  </v-card-text>
                </v-col>

                <v-col cols="6">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      icon
                      size="small"
                      variant="plain"
                      @click.stop="toggleHeart(output.planId)"
                    >
                      <v-icon>{{
                        user.saved.includes(output.planId)
                          ? "mdi-heart"
                          : "mdi-heart-outline"
                      }}</v-icon>
                    </v-btn>

                    <v-btn
                      color="#0077B6"
                      icon
                      small
                      variant="plain"
                      size="small"
                      @click.stop="toggleLike(output.planId)"
                    >
                      <v-icon>{{
                        output.AllowLike
                          ? "mdi-thumb-up-outline"
                          : "mdi-thumb-up"
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
        name: "loading name...",
        email: "",
        profilePic: "https://cdn.vuetifyjs.com/images/john.jpg",
        bio: null,
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

  computed: {
    // filter the plans based on what has been typed in the search bar
    filterer: function () {
      if (this.search === "") {
        return this.user.plans;
      } else {
        return this.user.plans.filter((plan) =>
          plan.Plan_Name.includes(this.search)
        );
      }
    },
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
      this.fetchAndUpdateData(String(this.user.email));
    },

    async toggleLike(plan_Name) {
      // get document of that liked users from collection Likes
      const docRef = doc(db, "Likes", plan_Name);
      const docSnap = await getDoc(docRef);

      if (docSnap.data().Liked_Users.includes(String(this.user.email))) {
        // remove users from liked
        await this.deleteListItem(
          docRef,
          docSnap,
          "Liked_Users",
          String(this.user.email)
        );

        this.fetchAndUpdateData(this.user.email);
      } else {
        // add users to liked
        await this.addListItem(
          docRef,
          docSnap,
          "Liked_Users",
          String(this.user.email)
        );

        this.fetchAndUpdateData(this.user.email);
      }
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

    async addListItem(docRef, docSnap, listFieldName, itemToAdd) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const existingList = docSnap.data()[listFieldName];

          // Add the new item to the existing list
          existingList.push(itemToAdd);

          // Update the document with the modified list
          await updateDoc(docRef, {
            Liked_Users: existingList,
          });
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error adding item to list:", error);
      }
    },

    async fetchAndUpdateData(userEmail) {
      // get created plan list of the user
      const docSnap = await getDoc(doc(db, "Users", String(userEmail)));
      this.user.id = docSnap.data().username;
      this.user.name = docSnap.data().Name;
      this.user.email = docSnap.data().email;
      if (
        docSnap.data().profilePicture != null &&
        docSnap.data().profilePicture != ""
      ) {
        this.user.profilePic = docSnap.data().profilePicture;
      }
      if (docSnap.data().bio != null && docSnap.data().bio != "") {
        this.user.bio = docSnap.data().bio;
      }

      console.log("created: " + docSnap.data().plans_list);
      console.log("saved: " + docSnap.data().saved_list);

      // refresh
      this.user.plans = [];
      // get all the plans out & put it into user.plans
      const val = docSnap.data().plans_list.map(async (e) => {
        let tempLike = true;

        // get data if the user has liked this or not
        const docRef3 = doc(db, "Likes", e);
        const docSnap3 = await getDoc(docRef3);
        for (let i = 0; i < docSnap3.data().Liked_Users.length; i++) {
          // user has liked this so dont let him like again
          if (docSnap3.data().Liked_Users[i] == this.user.email) {
            tempLike = false;
          }
        }
        let likeCount = await this.getNumLikes(e);

        // along with plan details pass in if user has liked this or not
        let deets = (await getDoc(doc(db, "Plans", e))).data();
        deets.AllowLike = tempLike;
        deets.likeCount = likeCount;
        if (deets.Pictures.length > 0) {
          deets.displayPic = deets.Pictures[0];
        } else {
          deets.displayPic =
            "https://hips.hearstapps.com/hmg-prod/images/voyager-1536x864-65809736c81aa.png";
        }

        this.user.plans.push(deets);
      });
      this.user.saved = docSnap.data().saved_list;

      console.log("created temp: " + this.user.plans);
      console.log("saved temp: " + this.user.saved);
    },
    async getNumLikes(planId) {
      const docRef = doc(db, "Likes", planId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.likeCount = docSnap.data().Liked_Users.length;
        return this.likeCount;
      }
    },
    goEdit() {
      this.$router.push("/editprfle");
    },
    goToUpdatePage(planId) {
      this.$router.push({ name: "UpdatePlan", params: { planId } });
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
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.card:hover {
  transform: scale(1.05); /* Increase the size slightly */
  transition: transform 0.2s ease; /* Add a smooth transition */
}
</style>
