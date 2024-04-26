<script setup>
import NavbarDefault from "@/components/NavbarDefault.vue";
import DefaultFooter from "@/components/FooterDefault.vue";
import MaterialButton from "@/components/material_components/MaterialButton.vue";
import MaterialSwitch from "@/components/material_components/MaterialSwitch.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { db, storage } from "../firebase.js";
import { ref as vueRef, reactive, onMounted, computed } from "vue";
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { useRoute, useRouter } from "vue-router";
import { createToaster } from "@meforma/vue-toaster";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  collection,
  getDocs,
} from "firebase/firestore";
const toaster = createToaster({
  position: "top",
  dismissable: "true",
  maxToasts: 1,
});

// Route to pass in plan ID
const route = useRoute();

// router to push to profile after updating / delete
const router = useRouter();

const planId = vueRef(route.params.planId);
const fileInputRef = vueRef(null);

// initialise planData according to firebase configs and set as placeholder values first
const planData = reactive({
  Plan_Name: "",
  numberOfVoyagers: 0,
  creator_id: "placeholder-creator-id",
  catagory_list: [],
  location_list: [],
  just_location_list: [],
  Date: new Date(),
  plan_description: "",
  Pictures: [],
  status: null,
  creator_rating: null,
  creator_review: "",
  creator_spending: 0,
  num_likes: 0,
  planId: "",
  autocomplete: null,
  address: null,
});

onMounted(() => {
  fetchPlanDetails();
});

// Pull and update information of planData
async function fetchPlanDetails() {
  if (!planId.value) {
    console.error("Plan ID is required.");
    return;
  }
  const planDocRef = doc(db, "Plans", planId.value);
  try {
    const planDocSnap = await getDoc(planDocRef);
    if (planDocSnap.exists()) {
      Object.assign(planData, planDocSnap.data());
      // convert timestamp form minutes / seconds to date to be used in date picker
      planData.Date = new Date(planData.Date.seconds * 1000);
      // convert location list that contains lat log and route to route for display
      planDocSnap.data().location_list.map((val) => {
        planData.just_location_list.push(val.route);
      });
    } else {
      console.error("No such plan!");
    }
  } catch (error) {
    console.error("Error fetching plan details:", error);
  }
}

function getAddressData(addressData) {
  planData.address = addressData;
  console.log(planData.address);
  console.log(addressData);
}

// perform validation checks to prevent un-intended values from being updated
const validations = {
  isRatingValid: computed(
    () => planData.creator_rating >= 0 && planData.creator_rating <= 5
  ),
  isNumberOfVoyagersValid: computed(() => planData.numberOfVoyagers > 0),
  isSpendingValid: computed(() => planData.creator_spending >= 0),
  isPlanNameValid: computed(() => planData.Plan_Name.trim() !== ""),
  isDateValid: computed(() => !isNaN(new Date(planData.Date))),
  isDescriptionValid: computed(() => planData.plan_description.trim() !== ""),
  isFormValid: computed(
    () =>
      validations.isRatingValid.value &&
      validations.isNumberOfVoyagersValid.value &&
      validations.isSpendingValid.value &&
      validations.isPlanNameValid.value &&
      validations.isDateValid.value &&
      validations.isDescriptionValid.value
  ),
};

// If passed all validations, update doc on firestore, else throw a toast error
async function updatePlan() {
  if (!validations.isFormValid.value) {
    if (!validations.isPlanNameValid.value) {
      toaster.error("Plan name cannot be empty");
    }
    if (!validations.isNumberOfVoyagersValid.value) {
      toaster.error("Number of voyagers must be greater than 0");
    }
    if (!validations.isDateValid.value) {
      toaster.error("Date must be selected");
    }
    if (!validations.isDescriptionValid.value) {
      toaster.error("Description cannot be empty");
    }
    if (!validations.isRatingValid.value) {
      toaster.error("Rating must be between 0 and 5");
    }
    if (!validations.isSpendingValid.value) {
      toaster.error("Spending cannot be negative");
    }
    return;
  }
  const planDocRef = doc(db, "Plans", planId.value);
  console.log("Plan ready to update:", planData);
  try {
    await updateDoc(planDocRef, planData);
    console.log("Plan updated successfully!");
    toaster.success("Plan Updated successfully!");
    router.push({ name: "Profile" });
  } catch (error) {
    console.error("Error updating plan:", error);
  }
}

function togglePlanCompleted() {
  planData.status = !planData.status;
}

// upload photo into Firebase storage and then push url link into Pictures
async function uploadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  const fileRef = storageRef(storage, `Plans/${file.name}`);
  try {
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);
    planData.Pictures.push(downloadURL);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

function triggerFileUpload() {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
}

function removePicture(index) {
  planData.Pictures.splice(index, 1);
}

// Delete plan but also need to delete document form likes and remove form users list of created plans as well
async function deletePlan() {
  if (
    confirm(
      "Are you sure you want to delete this plan? This action cannot be undone."
    )
  ) {
    try {
      const planDocRef = doc(db, "Plans", planId.value);
      await deleteDoc(planDocRef);
      const likesDocRef = doc(db, "Likes", planId.value);
      await deleteDoc(likesDocRef);
      const userDocRef = doc(db, "Users", planData.creator_id);
      await updateDoc(userDocRef, {
        plans_list: arrayRemove(planId.value),
      });
      // Retrieve all user documents
      const usersRef = collection(db, "Users");
      const querySnapshot = await getDocs(usersRef);
      querySnapshot.forEach(async (d) => {
        // Update each user document to remove the planId from their saved_list
        const userDocRef = doc(db, "Users", d.id);
        await updateDoc(userDocRef, {
          saved_list: arrayRemove(planId.value),
        });
      });
      toaster.success("Plan deleted successfully!");
      router.push({ name: "Profile" });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toaster.error("Failed to delete plan.");
    }
  }
}
</script>

<script>
export default {
  data() {
    return {
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
    };
  },
};
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <NavbarDefault />
    <div class="page-header min-vh-90" loading="lazy">
      <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <div class="plan preview">
              <h2>Edit Plan</h2>
              <div class="gallery-wrap"></div>
              <v-carousel v-if="planData.Pictures?.length > 0">
                <v-carousel-item
                  v-for="(picture, index) in planData.Pictures"
                  :key="index"
                >
                  <div class="image-container" @click="removePicture(index)">
                    <img :src="picture" alt="Uploaded Image" class="image" />
                    <div class="overlay">
                      <v-icon color="white">mdi-delete</v-icon>
                    </div>
                  </div>
                </v-carousel-item>
              </v-carousel>

              <v-card-item>
                <v-card-title>{{ planData.Plan_Name }}</v-card-title>
              </v-card-item>

              <v-card-text>
                <v-row class="mx-0">
                  <v-rating
                    v-model="planData.creator_rating"
                    color="amber"
                    density="compact"
                    size="small"
                    half-increments
                    readonly
                  ></v-rating>
                  <div class="text-grey ms-4">
                    {{ planData.creator_rating || "No rating yet" }}
                  </div>
                </v-row>

                <div class="my-4 text-subtitle-1">
                  ${{ planData.creator_spending }}
                </div>

                <div>{{ planData.plan_description }}</div>
              </v-card-text>

              <v-divider class="mx-4 mb-1"></v-divider>
            </div>
            <v-row class="py-7">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="planData.Plan_Name"
                  label="Plan Name"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="planData.numberOfVoyagers"
                  label="Number of Voyagers"
                  type="number"
                  class="mb-4"
                />
              </v-col>
              <v-col cols="12">
                <input
                  type="file"
                  @change="uploadPhoto"
                  hidden
                  ref="fileInputRef"
                />
                <MaterialButton
                  @click="triggerFileUpload"
                  variant="gradient"
                  color="dark"
                  fullWidth
                  >Upload Photos</MaterialButton
                >
                <vue-google-autocomplete
                  id="map"
                  classname="form-control"
                  :country="['SG']"
                  placeholder="Find Location"
                  v-on:placechanged="getAddressData"
                />
                <v-text-field
                  v-model="planData.just_location_list"
                  label="Location List"
                  class="mb-4"
                  disabled
                />
                <v-select
                  v-model="planData.catagory_list"
                  :items="availableCategories"
                  label="Category"
                  class="mb-4"
                  attach
                  chips
                  multiple
                  clearable
                  dense
                  solo
                  placeholder="Select category/categories"
                />
                <Datepicker
                  v-model="planData.Date"
                  :enable-time-picker="false"
                />
                <v-textarea
                  v-model="planData.plan_description"
                  label="Plan Description"
                  class="mb-4"
                />
                <MaterialSwitch
                  v-model="planData.status"
                  @change="togglePlanCompleted"
                  class="mb-4 d-flex align-items-center"
                  id="flexSwitchCheckDefault"
                  disabled
                  >Plan Completed?</MaterialSwitch
                >
              </v-col>
              <v-col cols="12" v-if="planData.status">
                <v-text-field
                  v-model.number="planData.creator_rating"
                  label="Creator Rating (0 to 5)"
                  type="number"
                  class="mb-4"
                />
                <v-textarea
                  v-model="planData.creator_review"
                  label="Creator Review"
                  class="mb-4"
                />
                <v-text-field
                  v-model.number="planData.creator_spending"
                  label="Creator Spending"
                  type="number"
                  class="mb-4"
                />
              </v-col>
              <MaterialButton
                @click="updatePlan"
                type="submit"
                variant="gradient"
                color="dark"
                fullWidth
                >Update Plan</MaterialButton
              >
              <MaterialButton
                @click="deletePlan"
                type="button"
                variant="gradient"
                color="red"
                fullWidth
              >
                Delete Plan
              </MaterialButton>
            </v-row>
          </div>
        </div>
      </div>
    </div>
    <DefaultFooter />
  </div>
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
