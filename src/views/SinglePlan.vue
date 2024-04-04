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
      // HTTPS link of your image
      imageLink: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
      loading: false,
      selection: 1,
      plan: '',
      imageUrls: [],
      imageKey: 0
    };
  }, mounted() {
      this.plan = this.UpdatePlan(this.$route.query.id);
      this.created();

  }, methods: {
      reserve() {
        this.loading = true
        setTimeout(() => (this.loading = false), 2000)
    },

    async UpdatePlan(planId) {
      // store this plan in a list
      console.log(planId);
      const docSnap = await getDoc(doc(db, "Plans", planId));
      
      if (docSnap.exists()) {
        // Document data is available in docSnap.data()
        console.log(docSnap.data());

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
        'status': docSnap.data().status};

        return this.plan;
      } else {
        console.log("No such document!");
        return null;
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
        //console.log(this.imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
      // trigger re render to display image on caroussel
      this.imageKey++;
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

  <body>
    <div class="page-header min-vh-90" loading="lazy">
    <v-card 
    class="mx-auto my-1"
    max-width="800"
    >

    <div class="gallery-wrap">
      <div class = "gallery">
      <v-carousel>
          <v-carousel-item v-for="imageUrl in this.imageUrls" >
            <img :src="imageUrl" alt="img">
          </v-carousel-item>
      </v-carousel>
      </div>
    </div>

    <v-card-item>
      <v-card-title>{{this.plan.Plan_Name}}</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :model-value= "this.plan.creator_rating" 
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">
          {{ this.plan.creator_rating }}
        </div>
      </v-row>

      <!-- add spending logic - aka for certain range of spending cost is this much -->
      <div class="my-4 text-subtitle-1">
        $ • Italian, Cafe
      </div>

      <!-- plan_description -->
      <div>{{ this.plan.plan_description }}</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <!-- show different class of planning status here -->
    <div class="px-4">
      <v-chip v-if="this.plan.status" color="red">
        Planning
      </v-chip>
      <v-chip v-else color="green">
        Completed
      </v-chip>
    </div>

    <v-card-actions>
      <v-btn
        color="deep-purple-lighten-2"
        variant="text"
        @click="reserve"
      >
        Favourite
      </v-btn>
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
