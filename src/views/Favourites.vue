<script setup>
// firebase stuff to get user data
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";
import { getDoc, doc, updateDoc} from "firebase/firestore";

// misc imports
import "@mdi/font/css/materialdesignicons.css";

//example components
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";

</script>

<script>
export default {
  data() {
    return {
      heart: true, // Initially, the heart icon is filled as it is in the fav page
      user: '',
      userEmail: '',
      temp: [],
      search: '',
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
    },
    
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

    async toggleLike(plan_Name) {
      // get document of that liked users from collection Likes
      const docRef = doc(db, "Likes", plan_Name);
      const docSnap = await getDoc(docRef);

      if(docSnap.data().Liked_Users.includes(String(this.userEmail))) {
        // remove thae users from liked it is already there
        await this.deleteListItem(docRef, docSnap, "Liked_Users", String(this.userEmail));

        // rather than finding the exact plan in temp then updating the like (react cannot update it :()
        // -> simply re get everything despite possible lag
        this.fetchAndUpdateData(this.userEmail);
      } else {
        // add the item to their saved list
        await this.addListItemLike(docRef, docSnap, "Liked_Users", String(this.userEmail));

        // rather than finding the exact plan in temp then updating the like (react cannot update it :()
        // -> simply re get everything despite possible lag
        this.fetchAndUpdateData(this.userEmail);
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

    async addListItemLike(docRef, docSnap, listFieldName, itemToAdd) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const existingList = docSnap.data()["Liked_Users"];
          
          // Add the new item to the existing list
          existingList.push(itemToAdd);

          // Update the document with the modified list
          await updateDoc(docRef, {
            "Liked_Users": existingList,
          });
          
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error adding item from list:", error);
      }
    },

    async fetchAndUpdateData(userEmail) {
      // clear the array before modification
      this.temp = []

      // get saved plan list of the user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);

      // get all the plans out & put it into the list temp
      const val = docSnap.data().saved_list.map(async (element) => {

        // get the count of likes & a temp variable for if user can like a plan or not
        let tempLike = true;
        let likeCount = 0;

        // get data if the user has liked this or not
        const docRef3 = doc(db, "Likes", element);
        const docSnap3 = await getDoc(docRef3);
        for(let i = 0; i < docSnap3.data().Liked_Users.length; i++) {
        
          // user has liked this so dont let him like again
          if(docSnap3.data().Liked_Users[i] == this.userEmail) {
            tempLike = false;
          }

          // get the number of likes for this plan
          likeCount = await this.getNumLikes(element);
        } 

        // along with plan details pass in if user has liked this or not
        let deets = (await getDoc(doc(db, "Plans", element))).data();
        deets.AllowLike = tempLike
        deets.likeCount = likeCount;
        if (deets.Pictures.length > 0) {
          deets.displayPic = deets.Pictures[0];
        } else {
          deets.displayPic = "https://hips.hearstapps.com/hmg-prod/images/voyager-1536x864-65809736c81aa.png";
        }

        this.temp.push(deets);
      });

    },

    // function to go a singlePlan via routing
    goToSinglePlan(planId) {
      // go to the singlePlan view and send the planId
      // so that details related to this plan can be retrived there
      this.$router.push({ name: "SinglePlan", query: {
        id: planId,
        lat: 40.689247,
        lng: -74.044502
      } });
    },

    // get number of likes for a specific planId
    async getNumLikes(planId) {
      const docRef = doc(db, "Likes", planId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.likeCount = docSnap.data().Liked_Users.length;
        return this.likeCount;
      }
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
            :src="output.displayPic"
            cover
            >

            <v-card-title >{{ output.Plan_Name }}</v-card-title>
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
                    <v-btn color="error" icon size="small" variant="plain" @click.stop="toggleHeart(output.planId)">
                        <v-icon>{{ heart ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                    </v-btn>

                    <v-btn color="#0077B6" icon small variant="plain" size="small" @click.stop="toggleLike(output.planId)">
                      <v-icon>{{output.AllowLike ? 'mdi-thumb-up-outline':'mdi-thumb-up'}}</v-icon>
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