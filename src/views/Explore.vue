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
      }
    });
  },
  methods: {
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
          console.log(`Plan ${planName} is already in favourites.`);
        }

        this.fetchPlans();
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
                      heart ? "mdi-heart" : "mdi-heart-outline"
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
