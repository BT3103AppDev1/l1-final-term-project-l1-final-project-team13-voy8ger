<script setup>
// firebase stuff to get user data
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage } from "../firebase.js";
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  query, where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

// misc imports
import { onMounted, onUnmounted} from "vue";
import { RouterLink } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";

//example components
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import Header from "../components/Header.vue";

const menu = ref(false)
</script>

<script>
export default {

  data() {
    return {
      // HTTPS link of your image
      imageLink: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
      loading: false,
      selection: 1,

      plan: '',
      imageUrls: [],
      imageKey: 0,

      locationSnapshot: '',

      AllowFavourite: true,
      AllowLike: true,

      userEmail: '',
      userName: '',
      likeCount: '',
      planId: this.$route.query.id,

      HasPicture: false
    };
  }, 
  
  beforeMount() {
    this.HasPicture = this.created();
    this.UpdatePlan(this.planId);
    this.likeCount = this.getNumLikes();
  },
  
  mounted() {
      // get current user details
      const auth = getAuth();
      
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userEmail = user.email;
        }
      });

  }, methods: {
      reserve() {
        this.loading = true
        setTimeout(() => (this.loading = false), 2000)
    },

    async UpdatePlan(planId) {
      // store this plan in a list
      console.log(planId);
      const docSnap = await getDoc(doc(db, "Plans", this.planId));
      
      if (docSnap.exists()) {
        // Document data is available in docSnap.data()

        // having issues extracting indiv fields if we pass the whole .data() object
        // so this is an alternative
        this.plan = {'Plan_Name':docSnap.data().Plan_Name, 
        'creator_id': docSnap.data().creator_id,
        'creator_rating': docSnap.data().creator_rating,
        'creator_review': docSnap.data().creator_review,
        'creator_spending': docSnap.data().creator_spending,
        'location_list': docSnap.data().location_list,
        'num_likes': docSnap.data().num_likes,
        'creator_spending': docSnap.data().creator_spending,
        'planId': docSnap.data().planId,
        'plan_description': docSnap.data().plan_description,
        'status': docSnap.data().status
      };

        // get ALL location details of that plan
        this.locationSnapshot = []
        console.log(docSnap.data().location_list[1]);

        // Iterate over the snapshot to access each document
        this.plan.location_list.forEach(doc => {
            this.locationSnapshot.push(doc.route);
        });

        // check if user has favourited this plan or not -> show that user has fav it
        const docRef2 = doc(db, "Users", String(this.userEmail));
        const docSnap2 = await getDoc(docRef2);
        for(let i = 0; i < docSnap2.data().saved_list.length; i++) {
          if(docSnap2.data().saved_list[i] == this.planId) {
            this.AllowFavourite = false;
          }
        } 

        // check if user has liked this plan or not -> show that user has liked it
        const docRef3 = doc(db, "Likes", this.planId);
        const docSnap3 = await getDoc(docRef3);
        for(let i = 0; i < docSnap3.data().Liked_Users.length; i++) {
          if(docSnap3.data().Liked_Users[i] == this.userEmail) {
            this.AllowLike = false;
          }
        } 

        // get the plan's original user's name -> to be displayed
        const docRef4 = doc(db, "Users", String(this.plan.creator_id));
        const docSnap4 = await getDoc(docRef4);
        this.userName = docSnap4.data().Name

        
      } else {
        console.log("No such document!");
      }
    },

    async toggleHeart(planId) {
      // get document of that user
      const docRef = doc(db, "Users", String(this.userEmail));
      const docSnap = await getDoc(docRef);
      console.log(docSnap.data());

      if(docSnap.data().saved_list.includes(planId)) {
        // remove that plan from his favourites if it is already there
        await this.deleteListItem(docRef, docSnap, "saved_list", planId);
        // they can favourite it again
        this.AllowFavourite = true;
      } else {
        // add the item to their saved list
        await this.addListItemHeart(docRef, docSnap, "saved_list", planId);
        // they cannot favourite it again
        this.AllowFavourite = false;
      }
    }, 

    async toggleLike(planId) {
      // get document of that liked users from collection Likes
      const docRef = doc(db, "Likes", planId);
      const docSnap = await getDoc(docRef);

      if(docSnap.data().Liked_Users.includes(String(this.userEmail))) {
        // remove thae users from liked it is already there
        await this.deleteListItem(docRef, docSnap, "Liked_Users", String(this.userEmail));
        // reduce num likes
        this.likeCount--;
        // they can like it again
        this.AllowLike = true;
        
      } else {
        // add the item to their saved list
        await this.addListItemLike(docRef, docSnap, "Liked_Users", String(this.userEmail));
        // increase the number of likes shown
        this.likeCount += 1
        // they cannot favourite it again
        this.AllowLike = false;
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
          console.log("Item removed from the list:", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error removing item from list:", error);
      }
    },

    // add item to a list in a document
    async addListItemHeart(docRef, docSnap, listFieldName, itemToAdd) {
      try {
        if (docSnap.exists()) {
          // Get the data from the document
          const existingList = docSnap.data()["saved_list"];
          
          // Add the new item to the existing list
          existingList.push(itemToAdd);

          // Update the document with the modified list
          await updateDoc(docRef, {
            "saved_list": existingList,
          });
          console.log("Item added to the list:", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error adding item from list:", error);
      }
    },

    // to get the images of the plan
    async created() {
      const folderRef = ref(storage, "Plans/" + String(this.$route.query.id));

      try {
        const imageList = await listAll(folderRef);
        for (const item of imageList.items) {
          const imageUrl = await getDownloadURL(item);
          this.imageUrls.push(imageUrl);
        }
         return true
        //console.log(this.imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
      return false
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
          console.log("Item added to the list:", itemToRemove);
        } else {
          console.log("Document does not exist!");
        }
      } catch (error) {
        console.error("Error adding item from list:", error);
      }
    },

    // get number of likes for a plan
    async getNumLikes() {
      const docRef = doc(db, "Likes", this.planId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.likeCount = docSnap.data().Liked_Users.length;
        return this.likeCount;
      }
    },

    LikeCount() {
      return this.likeCount;
    },

    // function to go a single Location view via routing
    goToSingleLocation() {
      this.$router.push({ name: "LocationView", query: {
        id: planId
      } });
    },

  }, computed: {
    HeartColor() {
      return this.AllowFavourite ? 'mdi-heart-outline':'mdi-heart';
    },
    LikeColor() {
      return this.AllowLike ? 'mdi-thumb-up-outline':'mdi-thumb-up';
    }
  }
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

  <body v-if="(imageUrls.length > 0) || (HasPicture == true)">
    <div class="page-header min-vh-90">
    <v-card 
    class="mx-auto my-1"
    max-width="800"
    >

    <div class="gallery-wrap">
      <div class = "gallery">
      <v-carousel>
          <v-carousel-item v-for="(imageUrl,i) in imageUrls" :key="i">
            <img :src="imageUrl" alt="img" height="100%"/>
          </v-carousel-item>
      </v-carousel>
      </div>
    </div>

    <v-card-item>
      <v-row align="center" dense>
        <v-col cols="auto">
          <v-avatar size="36px">
            <v-img
              alt="Avatar"
              src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
            ></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="auto">
          <v-card-title>{{userName}}'s</v-card-title>
        </v-col>
      </v-row>
    </v-card-item>

    <v-card-item>
      <v-card-title>{{plan.Plan_Name}}</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-row align="center">
        <v-rating
          :model-value= "plan.creator_rating" 
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">
          {{ plan.creator_rating }}
        </div>
      </v-row>

      <!-- add spending logic - aka for certain range of spending cost is this much -->
      <div class="my-4 text-subtitle-1">
        $ • Italian, Cafe
      </div>

      <!-- Location List -->
      <div class="my-4">
        <v-chip v-for="locations in locationSnapshot" class="mr-2 mb-2" @click="goToSingleLocation" >
          {{locations }}
        </v-chip>
      </div>

      <!-- plan_description -->
      <div>{{ plan.plan_description }}</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-actions>
      <v-btn color="error" icon size="small" variant="plain" @click="toggleHeart(plan.planId)">
        <v-icon>{{ HeartColor }}</v-icon>
      </v-btn>
      <v-btn color="#0077B6" icon small variant="plain" size="small" @click="toggleLike(plan.planId)">
        <v-icon>{{ LikeColor }}</v-icon>
      </v-btn>
      <v-card-title>{{ LikeCount() }} Likes</v-card-title>
    </v-card-actions>

  </v-card>

  </div>
  </body>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.gallery {
  width: 800px;
  display: flex;
}

.gallery div img {
  width: 100%;
  transition: transform 0.5s;
}

.gallery div img:hover {
  filter: grayscale(0);
  transform: scale(1.11);
}

</style>
