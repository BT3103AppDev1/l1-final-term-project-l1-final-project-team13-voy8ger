<script setup>
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
</script>
<script>
export default {
  data() {
    return {
      heart: false,
      user: null,
      userEmail: "",
      allPlans: [],
      tempArray: [],
      temp: [],
      favorites: [],
      length: 3,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        this.fetchPlans();
        this.fetchAndUpdateData(this.userEmail);
      }
    });
  },
  methods: {

    async fetchAndUpdateData(userEmail) {
      // get saved plan list of the user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());
      console.log(docSnap.data().saved_list);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().saved_list.map(async (element) => {
        // this.favorites.push((await getDoc(doc(db, "Plans", element))).data());
        this.favorites.push(element);
      });

      console.log(this.favorites);
    },

    async fetchPlans() {
      const querySnapshot = await getDocs(collection(db, "Plans"));
      this.allPlans = querySnapshot.docs.map((doc) => doc.data());
      this.tempArray = this.allPlans.slice();
      this.temp = this.tempArray.slice(0, this.length);
    },
    async toggleHeart(planName) {
      const docRef = doc(db, "Users", this.userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedList = data.saved_list || [];
        console.log(savedList);
        if (!savedList.includes(planName)) {
          await this.addListItem(docRef, docSnap, "saved_list", planName);
          console.log(`Plan ${planName} added to favourites.`);
        } else {
          await this.deleteListItem(docRef, docSnap, "saved_list", planName);
          console.log(`Plan ${planName} is removed from favourites.`);
        }
        this.favorites = [];
      // refresh the rest
        this.fetchAndUpdateData(String(this.userEmail));
        this.fetchPlans();
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
          console.log("Item removed from the list:", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing item from list:", error);
      }
    },
    async addListItem(docRef, docSnap, listFieldName, itemAdd) {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const list = data[listFieldName] || [];
        list.push(itemAdd);
        await updateDoc(docRef, {
          [listFieldName]: list,
        });
      }
    },

    loadMore() {
      this.length = this.length + 3;
      this.tempArray = this.allPlans.slice();
      this.temp = this.tempArray.slice(0, this.length);
    },
    heartColor(planId) {
      console.log('heart color is determined');
      return this.favorites.includes(planId) ? 'mdi-heart':'mdi-heart-outline';

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
        <h1
          class="text-black pt-3 mt-n5 me-2 text-center"
          :style="{ display: 'inline-block ' }"
        >
          Find plans you love!
        </h1>
      </v-row>

      <v-row>
        <v-col v-for="output in temp" cols="4">
          <!-- :key="card.id" -->
          <v-card class="mx-auto" max-width="300" max-height="250" v-on:click = "goToSinglePlan(output.planId)">
            <v-img
              height="150px"
              src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
              cover
            ></v-img>

            <v-card-title>{{ output.Plan_Name }}</v-card-title>

            <v-row align="center">
              <v-col cols="6">
                <v-card-text>{{ output.num_likes }} likes</v-card-text>
                <v-card-subtitle>{{ output.plan_description }}</v-card-subtitle>
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
                      // heart ? "mdi-heart" : "mdi-heart-outline"
                      heartColor(output.planId)
                    }}</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            :ripple="true"
            color="green"
            rounded="xl"
            density="default"
            @click="loadMore()"
          >
            load more!
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <DefaultFooter />
</template>