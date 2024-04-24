<script setup>
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import MaterialButton from "@/components/material_components/MaterialButton.vue";
import MaterialSwitch from "@/components/material_components/MaterialSwitch.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebase.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

import VueGoogleAutocomplete from "vue-google-autocomplete";
</script>

<script>
export default {
  data() {
    return {
      planName: "",
      numberOfVoyagers: 0,
      creatorId: "placeholder-creator-id",
      categories: [],
      availableCategories: [
        "Food & Dining",
        "Entertainment",
        "Outdoors & Nature",
        "Sports & Fitness",
        "Cultural Activities",
        "Shopping",
        "Nightlife",
        "Education & Learning",
        "Travel & Tourism",
        "Wellness & Relaxation",
        "Social & Community",
        "Hobbies & Crafts",
        "Others",
      ],
      locationList: [],
      planDate: new Date(),
      planDescription: "",
      Pictures: [],
      planCompleted: false,
      creatorRating: null,
      creatorReview: "",
      creatorSpending: 0,
      autocomplete: null,

      address: null
    };
  },
  computed: {
    // extract the name from the location list and return it
    getLocationNames() {
      let emp_list = []
      for(let index = 0; index < this.locationList.length; index++) {
        console.log(this.locationList[index])
        console.log(this.locationList[index].route)
        emp_list.push(this.locationList[index].street_number + " " + this.locationList[index].route);
      }
      return emp_list;
    },

    isFormValid() {
      return (
        this.isRatingValid &&
        this.isNumberOfVoyagersValid &&
        this.isSpendingValid &&
        this.isPlanNameValid &&
        this.isDateValid &&
        this.isDescriptionValid
      );
    },
    isRatingValid() {
      return this.creatorRating >= 0 && this.creatorRating <= 5;
    },
    isNumberOfVoyagersValid() {
      return this.numberOfVoyagers > 0;
    },
    isSpendingValid() {
      return this.creatorSpending >= 0;
    },
    isPlanNameValid() {
      return this.planName.trim() !== "";
    },
    isDateValid() {
      return !isNaN(new Date(this.planDate));
    },
    isDescriptionValid() {
      return this.planDescription.trim() !== "";
    },
  },
  components: {
    NavbarDefault,
    DefaultFooter,
    MaterialButton,
    MaterialSwitch,
    VueGoogleAutocomplete
  },
  mounted() {
    
  },
  methods: {
    
    
    async savePlanToFs() {
      await this.fetchCreatorId();
      if (!this.isFormValid) {
        if (!this.isPlanNameValid) {
          this.$toast.error("Plan name cannot be empty");
        }
        if (!this.isNumberOfVoyagersValid) {
          this.$toast.error("Number of voyagers must be greater than 0");
        }
        if (!this.isDateValid) {
          this.$toast.error("Date must be selected");
        }
        if (!this.isDescriptionValid) {
          this.$toast.error("Description cannot be empty");
        }
        if (!this.isRatingValid) {
          this.$toast.error("Rating must be between 0 and 5");
        }
        if (!this.isSpendingValid) {
          this.$toast.error("Spending cannot be negative");
        }
        return;
      }

      try {
        const docRef = await addDoc(collection(db, "Plans"), {
          Date: this.planDate,
          Pictures: this.Pictures,
          numberOfVoyagers: this.numberOfVoyagers,
          Plan_Name: this.planName,
          creator_id: this.creatorId,
          creator_rating: this.creatorRating,
          creator_review: this.creatorReview,
          creator_spending: this.creatorSpending,
          location_list: this.locationList,
          catagory_list: this.categories,
          num_likes: 0,
          plan_description: this.planDescription,
          status: this.planCompleted,
          planId: null,
        });
        await updateDoc(doc(db, "Plans", docRef.id), {
          planId: docRef.id,
        });

        const userRef = doc(db, "Users", this.creatorId);
        console.log(userRef);
        await updateDoc(userRef, {
          plans_list: arrayUnion(docRef.id),
        });

        this.$toast.success("Plan saved successfully!");
        this.resetForm();
      } catch (e) {
        this.$toast.error("Error saving the plan:", e);
      }
    },
    togglePlanCompleted() {
      this.planCompleted = !this.planCompleted;
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (!file) return;

      const fileRef = storageRef(storage, `Plans/${file.name}`);

      try {
        const uploadResult = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        this.Pictures.push(downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    async fetchCreatorId() {
      const user = getAuth().currentUser;
      if (user) {
        this.creatorId = user.email;
      } else {
        console.log("No user signed in");
      }
    },
    resetForm() {
      this.planName = "";
      this.numberOfVoyagers = 0;
      this.creatorId = "placeholder-creator-id";
      this.creatorSpending = 0;
      this.categories = [];
      this.locationList = [];
      this.planDate = new Date();
      this.planDescription = "";
      this.Pictures = [];
      this.planCompleted = false;
      this.creatorRating = null;
      this.creatorReview = "";
      this.creatorSpending = 0;
    },
    removePicture(index) {
      this.Pictures.splice(index, 1);
    },

    // HANDLING OF LOCATION 
    getAddressData: function (addressData, placeResultData, id) {
        this.address = addressData;

        // temp object to store deets of one location
        var temp_location = {}
        temp_location.latitude = this.address.latitude;
        temp_location.longitude = this.address.longitude;
        temp_location.route = this.address.route;
        temp_location.street_number = this.address.street_number;

        // push this to main location list for that plan
        this.locationList.push(temp_location);
    },
  },
};
</script>

<template>
  
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault />
      </div>
    </div>
  </div>
  <div class="page-header min-vh-90" loading="lazy">
    <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8">
          <v-row class="py-7">
            <v-col cols="12" md="6">
              <v-text-field v-model="planName" label="Plan Name" class="mb-4" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="numberOfVoyagers"
                label="Number of Voyagers"
                type="number"
                class="mb-4"
              />
            </v-col>
            <v-col cols="12">
              <input type="file" @change="uploadPhoto" hidden ref="fileInput" />
              <MaterialButton
                @click="triggerFileUpload"
                variant="gradient"
                color="dark"
                fullWidth
              >
                Upload Photos
              </MaterialButton>

              <vue-google-autocomplete 
                id="map" classname="form-control" 
                :country="['SG']" 
                placeholder="Find Location" 
                v-on:placechanged="getAddressData">
              </vue-google-autocomplete>

              <v-text-field
                v-model="getLocationNames"
                label="Location List"
                class="mb-4"
              />

              <v-select
                v-model="categories"
                :items="availableCategories"
                label="Category"
                class="mb-4"
                attach
                chips
                multiple
                clearable
                dense
                solo
                placeholder="Select category/ catagories"
              />
              <div>Date</div>
              <Datepicker v-model="planDate" :enable-time-picker="false" />
              <br />
              <v-textarea
                v-model="planDescription"
                label="Plan Description"
                class="mb-4"
              />
              <MaterialSwitch
                :checked="planCompleted"
                @change="togglePlanCompleted"
                class="mb-4 d-flex align-items-center"
                id="flexSwitchCheckDefault"
              >
                Plan Completed?
              </MaterialSwitch>
            </v-col>

            <v-col cols="12" v-if="planCompleted">
              <v-text-field
                v-model.number="creatorRating"
                label="Creator Rating (0 to 5)"
                type="number"
                class="mb-4"
              ></v-text-field>

              <v-textarea
                v-model="creatorReview"
                label="Creator Review"
                class="mb-4"
              ></v-textarea>

              <v-text-field
                v-model.number="creatorSpending"
                label="Creator Spending"
                type="number"
                class="mb-4"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
        <div class="plan preview">
          <h2>Preview Plan</h2>
          <div class="gallery-wrap"></div>
          <v-carousel v-if="Pictures.length > 0">
            <v-carousel-item v-for="(picture, index) in Pictures" :key="index">
              <div class="image-container" @click="removePicture(index)">
                <img :src="picture" alt="Uploaded Image" class="image" />
                <div class="overlay">
                  <v-icon color="white">mdi-delete</v-icon>
                </div>
              </div>
            </v-carousel-item>
          </v-carousel>

          <v-card-item>
            <v-card-title>{{ planName }}</v-card-title>
          </v-card-item>

          <v-card-text>
            <v-row class="mx-0">
              <v-rating
                v-model="creatorRating"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              ></v-rating>
              <div class="text-grey ms-4">
                {{ creatorRating || "No rating yet" }}
              </div>
            </v-row>

            <div class="my-4 text-subtitle-1">${{ creatorSpending }}</div>

            <div>{{ planDescription }}</div>
          </v-card-text>

          <v-divider class="mx-4 mb-1"></v-divider>

          <MaterialButton
            @click="savePlanToFs"
            type="submit"
            variant="gradient"
            color="dark"
            fullWidth
            >Save Plan</MaterialButton
          >

        </div>

        
      </div>
    </div>
  </div>

  <input id="search_input" name = "search_input">

  <DefaultFooter />
</template>

<style scoped>
.page-header {
  margin-top: 2rem;
  background-image: url("@/assets/img/voy8ger_image.jpeg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.image-container {
  position: relative;
  width: 100%;
}

.image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container:hover .overlay {
  opacity: 1;
}
</style>
