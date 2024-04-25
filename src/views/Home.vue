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
      user: "",
      userEmail: "",
      temp: [],
      tempArray: [],
      allPlans: [],
      favorites: [],
      liked: [],
      result: [],
      count: [],
    };
  },

  async mounted() {
    // get user if logged IN & then get the required favourite plan data
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        this.fetchAndUpdateData(this.userEmail);
        this.fetchAndUpdateLikes();
      }
    });
  },

  methods: {
    async fetchAndUpdateData(userEmail) {
      // get saved plan list of the user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().saved_list.map(async (element) => {
        this.favorites.push(element);
      });
    },

    async fetchAndUpdateLikes() {
      // get all plans
      const querySnapshot2 = await getDocs(collection(db, "Plans"));
      this.liked = querySnapshot2.docs.map((doc) => doc.data().planId);

      this.result = [];
      for (let i = 0; i < this.liked.length; i++) {
        // assume user has not liked yet
        let tempLike = false;
        let likeCount = 0;

        // get data if the user has liked this or not
        const docRef3 = doc(db, "Likes", String(this.liked[i]));
        const docSnap3 = await getDoc(docRef3);
        if (docSnap3.exists()) {
          const data3 = docSnap3.data();
          const Liked_Users = data3.Liked_Users || [];
          for (let i = 0; i < Liked_Users.length; i++) {
            // user has liked this
            if (Liked_Users[i] == this.userEmail) {
              tempLike = true;
            }
          }
          // get the number of likes for the plan
          likeCount = Liked_Users.length;

          // along with plan details pass in if user has liked this or not
        }
        let deets = (await getDoc(doc(db, "Plans", this.liked[i]))).data();
        deets.liked = tempLike;
        deets.likeCount = likeCount;
        // set the display picture to be the first picture
        deets.displayPic =
          deets.Pictures.length > 0
            ? deets.Pictures[0]
            : "https://hips.hearstapps.com/hmg-prod/images/voyager-1536x864-65809736c81aa.png";

        this.result.push(deets);
      }
      // sorting function
      function compare(a, b) {
        if (a.likeCount < b.likeCount) return 1;
        if (a.likeCount > b.likeCount) return -1;
        return 0;
      }
      this.copy = this.result.slice();
      this.temp = this.copy.sort(compare).slice(0, 3);
    },
    async toggleHeart(planName) {
      // get the user details
      const docRef = doc(db, "Users", this.userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedList = data.saved_list || [];
        // check if the user has saved the plan
        if (!savedList.includes(planName)) {
          // add to saved if not saved
          await this.addListItem(docRef, docSnap, "saved_list", planName);
        } else {
          // remove from saved if saved
          await this.deleteListItem(docRef, docSnap, "saved_list", planName);
        }
        this.favorites = [];
        // refresh the rest
        this.fetchAndUpdateData(String(this.userEmail));
      }
    },

    async toggleLike(plan_Name) {
      // get document of liked users from collection Likes
      const docRef = doc(db, "Likes", plan_Name);
      const docSnap = await getDoc(docRef);

      if (docSnap.data().Liked_Users.includes(String(this.userEmail))) {
        // remove the users from liked if it is already there
        await this.deleteListItem(
          docRef,
          docSnap,
          "Liked_Users",
          String(this.userEmail)
        );
        // rather than finding the exact plan in temp then updating the like -> simply re get everything
        this.fetchAndUpdateLikes();
      } else {
        // add the item to their saved list
        await this.addListItem(
          docRef,
          docSnap,
          "Liked_Users",
          String(this.userEmail)
        );
        // rather than finding the exact plan in temp then updating the like -> simply re get everything
        this.fetchAndUpdateLikes();
      }
    },
    async deleteListItem(docRef, docSnap, listFieldName, itemToRemove) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const data = docSnap.data();
          // Get the list from the document data
          const list = data[listFieldName];

          // Remove the item from the list
          const updatedList = list.filter((item) => item !== itemToRemove);
          // Update the document with the modified list
          await updateDoc(docRef, {
            [listFieldName]: updatedList,
          });
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing item from list:", error);
      }
    },
    async addListItem(docRef, docSnap, listFieldName, itemAdd) {
      if (docSnap.exists()) {
        // get the data
        const data = docSnap.data();
        // get the relevant list
        const list = data[listFieldName] || [];
        list.push(itemAdd);
        // update firebase
        await updateDoc(docRef, {
          [listFieldName]: list,
        });
      }
    },
    // get the color of the heart
    heartColor(planId) {
      // check if the plan is saved
      return this.favorites.includes(planId)
        ? "mdi-heart"
        : "mdi-heart-outline";
    },

    goToSinglePlan(planId) {
      // go to the singlePlan view and send the planId
      // so that details related to this plan can be retrieved there
      this.$router.push({
        name: "SinglePlan",
        query: {
          id: planId,
        },
      });
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
      <v-col v-for="output in temp" cols="4">
        <!-- :key="card.id" -->
        <v-card
          class="mx-auto card"
          max-width="300"
          max-height="250"
          v-on:click="goToSinglePlan(output.planId)"
        >
          <v-img
            class="align-end text-white"
            height="150px"
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
                  <v-icon>
                    {{ heartColor(output.planId) }}
                  </v-icon>
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
                    output.liked ? "mdi-thumb-up" : "mdi-thumb-up-outline"
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
