<script setup>
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
import { onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
//example components
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import Header from "../components/Header.vue";

//images
import voyager_image from "@/assets/img/voy8ger_image.jpeg";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>
<script>
export default {
  data() {
    return {
      heart: false, // Initially, the heart icon is not filled as it is in the explore page
      user: "",
      userEmail: "",
      temp: [],
      allPlans: [],
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
        this.fetchPlans();
      }
    });
  },

  methods: {
    async fetchPlans() {
      const querySnapshot = await getDocs(collection(db, "Plans"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        this.allPlans.push(doc.data());
        this.allPlans = this.allPlans.slice(0, 3);
      });
    },
    async toggleHeart(plan_Name) {
      // get document of that user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);

      // add that plan to my favourites
      await this.addListItem(docRef, docSnap, "saved_list", plan_Name);
      // empty the current list of fav plans of this user
      this.temp = [];
      // refresh the rest
      this.fetchAndUpdateData(String(this.userEmail));
    },

    async addListItem(docRef, docSnap, listFieldName, itemAdd) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const data = docSnap.data();
          // Get the list from the document data
          const list = data[listFieldName];
          console.log(list);
          // Add the item to the list
          const updatedList = list.push(itemAdd);
          // Update the document with the modified list
          await updateDoc(docRef, {
            [listFieldName]: updatedList,
          });
          console.log("Item added to the list:", itemAdd);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error adding item to list:", error);
      }
    },

    async fetchAndUpdateData(userEmail) {
      // get saved plan list of the user

      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data().saved_list);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().saved_list.map(async (element) => {
        this.temp.push((await getDoc(doc(db, "Plans", element))).data());
      });

      console.log(this.temp);
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
  <Header>
    <div
      class="page-header min-vh-75"
      :style="`background-image: url(${voyager_image})`"
      loading="lazy"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1
              class="text-white pt-3 mt-n5 me-2"
              :style="{ display: 'inline-block ' }"
            >
              V O Y 8 G E R
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              Create the perfect plan with our platform <br />
              Browse meticulously crafted plans in different locations and
              budgets <br />
              Save on outings with personalized recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>

  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-card-text style="flex-grow: 1">
          <div
            style="
              font-size: 50px;
              width: auto;
              display: flex;
              justify-content: center;
              font-weight: bold;
            "
          >
            For You
          </div>

          <div
            style="
              font-size: 20px;
              width: auto;
              display: flex;
              justify-content: center;
              text-align: center;
            "
          >
            The current top 3 <br />
            most popular plans
          </div>
        </v-card-text>
        <v-card-actions
          style="display: flex; justify-content: center; width: 200px"
        >
          <v-btn color="green">
            <RouterLink to="/explore">VIEW ALL</RouterLink>
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col v-for="output in allPlans" cols="4">
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
  </div>
  <DefaultFooter />
</template>
