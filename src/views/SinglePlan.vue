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
      plan: [],
      imageUrls: []
    };
  }, mounted() {
      this.UpdatePlan(this.$route.query.id);
      this.created();
      
      // console.log(this.$route.query.id);
      // add all the image scrollbar functionality
      let scrollBar = document.querySelector(".gallery");
      let backBtn = document.getElementById("backBtn");
      let nextBtn = document.getElementById("nextBtn");

      scrollBar.addEventListener("wheel", (event) => {
        event.preventDefault();
        scrollBar.scrollLeft += event.deltaX;
      });

      nextBtn.addEventListener("click", () => {
        scrollBar.scrollLeft += 800;
      });

      backBtn.addEventListener("click", () => {
        scrollBar.scrollLeft -= 800;
      });

  }, methods: {
      reserve() {
        this.loading = true

        setTimeout(() => (this.loading = false), 2000)
    },

    async UpdatePlan(planId) {
      // store this plan in a list
      console.log(planId);
      this.plan.push((await getDoc(doc(db, "Plans", planId))).data());
      console.log(this.plan['0']);
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
        <img src = "../assets/img/back.png" id = "backBtn">

        <div class = "gallery">
          <div>
            <span v-for="(imageUrl, index) in imageUrls.slice(0, 3)" :key="index">
              <img v-if="imageUrl" :src="imageUrl">
            </span>
          </div>
          <div>
            <span v-for="(imageUrl, index) in imageUrls.slice(3, 6)" :key="index">
              <img v-if="imageUrl" :src="imageUrl">
            </span>
          </div>
        </div>

        <img src = "../assets/img/next.png" id = "nextBtn">
      </div>

    <v-card-item>
      <v-card-title>tt</v-card-title>
    </v-card-item>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :model-value= "4.0" 
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">
          <!-- {{ this.plan['0'].creator_rating === null ? "No rating yet" : this.plan['0'].creator_rating}} -->
        </div>
      </v-row>

      <!-- add spending logic - aka for certain range of spending cost is this much -->
      <div class="my-4 text-subtitle-1">
        $ • Italian, Cafe
      </div>

      <!-- plan_description -->
      <div>rt</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Status</v-card-title>

    <!-- show different class of status here -->
    <div class="px-4">
      <v-chip-group v-model="selection">
        <v-chip>5:30PM</v-chip>

        <v-chip>7:30PM</v-chip>

        <v-chip>8:00PM</v-chip>

        <v-chip>9:00PM</v-chip>
      </v-chip-group>
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
  overflow-x: scroll;
}

.gallery div {
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 20px;
  padding: 10px;
  flex: none;
}

.gallery div img {
  width: 100%;
  transition: transform 0.5s;
}

/* make the scroll bar invisible */
.gallery::-webkit-scrollbar {
  display: none;
}

.gallery-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10% auto;
}

#backBtn, #nextBtn {
  width: 50px;
  margin: 40px;
}

.gallery div img:hover {
  filter: grayscale(0);
  transform: scale(1.11);
}

</style>
