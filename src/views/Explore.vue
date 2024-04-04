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
  <div class="page-header min-vh-90" loading="lazy">
    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
      <h1
        class="text-black pt-3 mt-n5 me-2 text-center"
        :style="{ display: 'inline-block ' }"
      >
        Find plans you love!
      </h1>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 1</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 2</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 3</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 1</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 2</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 3</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 1</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 2</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
        <v-col cols="auto">
          <v-card class="mx-auto" max-width="344">
            <v-card-title
              prepend-icon="mdi-account"
              append-icon="mdi-check"
              class="text-center"
              >Plan 3</v-card-title
            >
            <v-card-text
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.</v-card-text
            >
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>

  <DefaultFooter />
</template>
