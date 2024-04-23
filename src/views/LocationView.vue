<script setup>
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import Header from "../components/Header.vue";

import { GoogleMap, Marker } from 'vue3-google-map'
const center = { lat: 40.689247, lng: -74.044502 }
// const center = { lat: this.$route.query.lat, lng: this.$route.query.lng }
// console.log(this.$route.query.lat);
</script>

<template>
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <NavbarDefault :sticky="true" />
        </div>
      </div>

      <GoogleMap
        api-key="AIzaSyB91PgHyhp9tvua_eCT5eiiqSQxXTcZoe0"
        style="width: 100%; height: 500px; margin-top: 10%;"
        :center="center"
        :zoom="15"
        >
            <Marker :options="{ position: center }" />
        </GoogleMap>
    </div>
</template>

<script>

</script>