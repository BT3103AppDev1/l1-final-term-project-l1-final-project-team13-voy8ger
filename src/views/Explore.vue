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
  setDoc,
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
      liked: [],
      result: [],
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

    async fetchPlans() {
      const querySnapshot = await getDocs(collection(db, "Plans"));
      this.allPlans = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        displayPic:
          doc.data().Pictures.length > 0
            ? doc.data().Pictures[0]
            : "https://hips.hearstapps.com/hmg-prod/images/voyager-1536x864-65809736c81aa.png",
      }));
      this.tempArray = this.allPlans.slice();
      this.temp = this.tempArray.slice(0, this.length);
    },
    async fetchAndUpdateLikes() {
      const querySnapshot2 = await getDocs(collection(db, "Plans"));
      this.liked = querySnapshot2.docs.map((doc) => doc.data().planId);

      this.result = [];
      const val = this.liked.map(async (element) => {
        let tempLike = false;
        let likeCount = 0;

        // get data if the user has liked this or not
        const docRef3 = doc(db, "Likes", String(element));
        const docSnap3 = await getDoc(docRef3);
        if (docSnap3.exists()) {
          const data3 = docSnap3.data();
          const Liked_Users = data3.Liked_Users || [];
          for (let i = 0; i < Liked_Users.length; i++) {
            // user has liked this so dont let him like again
            if (Liked_Users[i] == this.userEmail) {
              tempLike = true;
            }

            // get the number of likes for this plan
            likeCount = await this.getNumLikes(element);
          }

          // for those plans find out number of likes for that plan as well

          // along with plan details pass in if user has liked this or not
        } else {
          await setDoc(doc(db, "Likes", element), {
            Liked_Users: [],
          });
        }
        let deets = (await getDoc(doc(db, "Plans", element))).data();
        deets.liked = tempLike;
        deets.likeCount = likeCount;
        this.result.push(deets);
      });
    },
    async toggleHeart(planName) {
      const docRef = doc(db, "Users", this.userEmail);
      const docSnap = await getDoc(docRef);
      // if the document exists
      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedList = data.saved_list || [];

        // if the plan is not already favourited, add it
        if (!savedList.includes(planName)) {
          await this.addListItem(docRef, docSnap, "saved_list", planName);
        } else {
          // if the plan is already saved, delete it
          await this.deleteListItem(docRef, docSnap, "saved_list", planName);
        }
        this.favorites = [];
        // refresh the rest
        this.fetchAndUpdateData(String(this.userEmail));
        this.fetchPlans();
      }
    },
    async toggleLike(plan_Name) {
      // get document of that liked users from collection Likes
      const docRef = doc(db, "Likes", plan_Name);
      const docSnap = await getDoc(docRef);

      if (docSnap.data().Liked_Users.includes(String(this.userEmail))) {
        // remove thae users from liked it is already there
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
        const data = docSnap.data();
        const list = data[listFieldName] || [];
        list.push(itemAdd);
        await updateDoc(docRef, {
          [listFieldName]: list,
        });
      }
    },
    //get more plans
    loadMore() {
      if (this.user) {
        this.length = this.length + 3;
        if (this.length <= this.allPlans.length) {
          this.tempArray = this.allPlans.slice();
          this.temp = this.tempArray.slice(0, this.length);
        } else {
          this.tempArray = this.allPlans.slice();
          this.temp = this.tempArray.slice(0, this.allPlans.length);
          this.$toast.error(`All plans viewed, start a new voy8ge today!`);
        }
      } else {
        this.$router.push({
          name: "LogIn",
        });
      }
    },
    //get the colour of the heart
    heartColor(planId) {
      return this.favorites.includes(planId)
        ? "mdi-heart"
        : "mdi-heart-outline";
    },
    //get the colour of the thumbs up
    likeColor(planId) {
      for (let i = 0; i < this.result.length; i++) {
        if (this.result[i].planId == planId) {
          return this.result[i].liked ? "mdi-thumb-up" : "mdi-thumb-up-outline";
        }
      }
    },
    likeNum(planId) {
      for (let i = 0; i < this.result.length; i++) {
        if (this.result[i].planId == planId) {
          return this.result[i].likeCount;
        }
      }
    },
    // get number of likes for a specific planId
    async getNumLikes(planId) {
      const docRef = doc(db, "Likes", planId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const likedUsers = docSnap.data().Liked_Users || [];

        this.likeCount = likedUsers.length > 0 ? likedUsers.length : 0;

        return this.likeCount;
      }
    },
    goToSinglePlan(planId) {
      // go to the singlePlan view and send the planId
      // so that details related to this plan can be retrived there
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
                  <div>{{ likeNum(output.planId) }} likes</div>
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
                      // heart ? "mdi-heart" : "mdi-heart-outline"
                      heartColor(output.planId)
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
                    <v-icon>{{ likeColor(output.planId) }}</v-icon>
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
            {{ user ? "load more!" : "Sign In" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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
