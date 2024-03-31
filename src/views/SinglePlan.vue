<template>
  <body>
    <v-card
    class="mx-auto my-12"
    max-width="800"
  >

    <div class="gallery-wrap">
        <img src = "../assets/img/back.png" id = "backBtn">

        <div class = "gallery">
          <div>
            <span><img :src=this.imageLink></span>
            <span><img :src=this.imageLink></span>
            <span><img :src=this.imageLink></span>
          </div>
          <div>
            <span><img :src=this.imageLink></span>
            <span><img :src=this.imageLink></span>
            <span><img :src=this.imageLink></span>
          </div>
        </div>

        <img src = "../assets/img/next.png" id = "nextBtn">
      </div>

    <v-card-item>
      <v-card-title>Cafe Badilico</v-card-title>

      <v-card-subtitle>
        <span class="me-1">Local Favorite</span>

        <v-icon
          color="error"
          icon="mdi-fire-circle"
          size="small"
        ></v-icon>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-row
        align="center"
        class="mx-0"
      >
        <v-rating
          :model-value="4.5"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        ></v-rating>

        <div class="text-grey ms-4">
          4.5 (413)
        </div>
      </v-row>

      <div class="my-4 text-subtitle-1">
        $ • Italian, Cafe
      </div>

      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
    </v-card-text>

    <v-divider class="mx-4 mb-1"></v-divider>

    <v-card-title>Tonight's availability</v-card-title>

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
        Reserve
      </v-btn>
    </v-card-actions>
  </v-card>

  </body>
</template>

<script>
export default {
  data() {
    return {
      // HTTPS link of your image
      imageLink: "https://cdn.vuetifyjs.com/images/cards/cooking.png",
      loading: false,
      selection: 1
    };
  }, mounted() {
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
  },
};
</script>

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
