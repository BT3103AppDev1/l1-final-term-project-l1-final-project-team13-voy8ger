<script setup>
// example component
import HorizontalTeamCard from "@/examples/cards/teamCards/HorizontalTeamCard.vue";

// images
import emma from "@/assets/img/team-5.jpg";
import william from "@/assets/img/bruce-mars.jpg";
import ivana from "@/assets/img/ivana-squares.jpg";
import coco from "@/assets/img/coco.png";
import KJ from "@/assets/img/KJ.png";
import Ram from "@/assets/img/Ram.png";
import JL from "@/assets/img/JL.png";
import HJ from "@/assets/img/HJ.png";
</script>

<template>
  <section class="pb-5 position-relative bg-gradient-dark mx-n3">
    <div class="container">
      <div class="row">
        <div class="col-md-8 text-start mb-5 mt-5">
          <h3 class="text-white z-index-1 position-relative">
            The Executive Team
          </h3>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-12">
          <HorizontalTeamCard
            class="mt-4"
            :image="KJ"
            :profile="{ name: 'FONG KAI JUN', link: 'javascript:;' }"
            :position="{ label: 'Developer / SCRUM Master', color: 'success' }"
            description="Kai Jun is a seasoned software developer proficient in various programming languages and frameworks. He stays at the forefront of industry trends, constantly seeking to expand his knowledge and expertise."
          />
        </div>

        <div class="col-lg-6 col-12">
          <HorizontalTeamCard
            class="mt-lg-4 mt-5"
            :image="Ram"
            :profile="{
              name: 'GOPAL RADHAKRISHNAN RAMANEN BHARATWA',
              link: 'javascript:;',
            }"
            :position="{ label: 'Developer / Product Owner', color: 'success' }"
            description="Ramanen is a seasoned software developer proficient in various programming languages and frameworks. He stays at the forefront of industry trends, constantly seeking to expand his knowledge and expertise."
          />
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-lg-6 col-12">
          <HorizontalTeamCard
            class="mt-4 z-index-2"
            :image="JL"
            :profile="{ name: 'JERON LIAW XUAN JUN', link: 'javascript:;' }"
            :position="{ label: 'Developer', color: 'success' }"
            description="Jeron is a seasoned software developer proficient in various programming languages and frameworks. He stays at the forefront of industry trends, constantly seeking to expand his knowledge and expertise."
          />
        </div>
        <div class="col-lg-6 col-12">
          <HorizontalTeamCard
            class="mt-lg-4 mt-5 z-index-2"
            :image="coco"
            :profile="{ name: 'COCO LI XINRUI', link: 'javascript:;' }"
            :position="{ label: 'Developer', color: 'success' }"
            description="Coco is a seasoned software developer proficient in various programming languages and frameworks. She stays at the forefront of industry trends, constantly seeking to expand his knowledge and expertise."
          />
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-lg-6 col-12">
          <HorizontalTeamCard
            class="mt-lg-4 mt-5 z-index-2"
            :image="HJ"
            :profile="{ name: 'LAI HSUAN JUNG', link: 'javascript:;' }"
            :position="{ label: 'Developer', color: 'success' }"
            description="Hsuan Jung is a seasoned software developer proficient in various programming languages and frameworks. She stays at the forefront of industry trends, constantly seeking to expand his knowledge and expertise."
          />
        </div>
      </div>
    </div>
  </section>
</template>
