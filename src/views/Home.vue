<script setup>
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
              Create the perfect plan with our platform <br>
        Browse meticulously crafted plans in different locations and budgets <br>
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
  <v-card-text style="flex-grow: 1;">
      <div style="font-size: 50px; width: auto; display: flex; justify-content: center; font-weight: bold;">For You</div>

      <div style="font-size: 20px; width: auto; display: flex; justify-content: center; text-align: center;"> The current top 3 <br> most popular plans </div>
    </v-card-text>
    <v-card-actions style="display: flex; justify-content: center; width: 200px;">
      <v-btn color="green">
        <RouterLink to="/explore">VIEW ALL</RouterLink>
                      
      </v-btn>

    </v-card-actions>
  </v-col>

  <!-- Second column -->
  <v-col cols="auto">
  <v-card class="mx-auto" max-width="344" >
    <v-card-title prepend-icon="mdi-account" append-icon="mdi-check" class="text-center">Plan 1</v-card-title>
    <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
  </v-card>
</v-col>
  <v-col cols="auto">
    
  <v-card class="mx-auto" max-width="344" >
    <v-card-title prepend-icon="mdi-account" append-icon="mdi-check" class="text-center">Plan 2</v-card-title>
    <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
  </v-card>
</v-col>
  <v-col cols="auto">
    
  <v-card class="mx-auto" max-width="344" >
    <v-card-title prepend-icon="mdi-account" append-icon="mdi-check" class="text-center">Plan 3</v-card-title>
    <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</v-card-text>
  </v-card>
</v-col>
  </v-row>
  </div>
  <DefaultFooter />
</template>
