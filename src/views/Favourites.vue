<script setup>
// firebase stuff to get user data
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// misc imports
import { onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";

//example components
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import Header from "../components/Header.vue";
</script>

<script>
export default {
  data() {
    return {
      heart: true, // Initially, the heart icon is filled as it is in the fav page
      user: '',
      userEmail: '',
      temp: [],
      search: ''
    };
  },

  async mounted() {
    // get user if logged IN & then get the required favourite plan data
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        this.fetchAndUpdateData(this.userEmail);
      }
    });
  },

  computed: {
    // filter the plans based on what has been typed in the search bar
    filterer: function() {
      if(this.search === '') {
        return this.temp;
      } else {
        return this.temp.filter(plan => plan.Plan_Name.includes(this.search))
      }
    }
  },

  methods: {
    async toggleHeart(plan_Name) {
      // get document of that user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);

      // remove that plan from my favourites
      await this.deleteListItem(docRef, docSnap, "saved_list", plan_Name);
      // empty the current list of fav plans of this user
      this.temp = [];
      // refresh the rest
      this.fetchAndUpdateData(String(this.userEmail));
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
          console.log("Item removed from the list:", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing item from list:", error);
      }
    },

    async fetchAndUpdateData(userEmail) {
      // get saved plan list of the user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      console.log(docSnap.data().saved_list);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().saved_list.map(async (element) => {
        this.temp.push((await getDoc(doc(db, "Plans", element))).data());
      });

      console.log(this.temp);
    },

    goToSinglePlan(planId) {
      console.log(planId);
      // go to the singlePlan view and send the planId
      // so that details related to this plan can be retrived there
      this.$router.push({ name: "SinglePlan", query: {
        id: planId
      } });
    }
  },
};
</script>

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
      <v-row align="center" class="mt-15" justify="center">
        <v-card title="My Favourites" class="text-center"> </v-card>
      </v-row>

      <v-row justify="center" class="mt-5">
        <!-- Centering horizontally with space above -->
        <v-col cols="12" sm="6" md="4">
          <!-- Adjust the column size as needed -->
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Search Favourites"
            outlined
            variant="outlined"
          ></v-text-field>
        </v-col>
      </v-row>

        <v-row>
        <v-col v-for="output in filterer" cols="4"> 
            <v-card class="mx-auto card" max-width="330" max-height="250" v-on:click = "goToSinglePlan(output.planId)">

            <v-img
            class="align-end text-white"
            height="150"
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
            >

            <v-card-title >{{ output.Plan_Name }}</v-card-title>
            </v-img>

            <v-row align="center">
                <v-col cols="6">
                    <v-card-text>
                    <div>{{ output.num_likes }} likes</div>
                    <div class="truncate">{{ output.plan_description }}</div>
                    </v-card-text>
                </v-col>

                <v-col cols="6">
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" icon size="small" variant="plain" @click="toggleHeart(output.planId)">
                        <v-icon>{{ heart ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <body></body>

  <DefaultFooter />
</template>

<style scoped>
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
