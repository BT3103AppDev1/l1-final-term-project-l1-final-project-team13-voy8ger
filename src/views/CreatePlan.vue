<script setup>
import { onMounted } from "vue";
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import MaterialInput from "@/components/material_components/MaterialInput.vue";
import MaterialButton from "@/components/material_components/MaterialButton.vue";
import MaterialTextArea from "@/components/material_components/MaterialTextArea.vue";
import MaterialSwitch from "@/components/material_components/MaterialSwitch.vue";
import setMaterialInput from "@/assets/js/material-input";

// const tableRows = ref([]);
// const planName = ref("");
// const numberOfVoyagers = ref(0);
// const time = ref("");
// const category = ref("");
// const location = ref("");
// const spending = ref(0);
// const remarks = ref("");
// const totalSpending = ref(0);

onMounted(() => {
  setMaterialInput();
});
</script>

<script>
export default {
  data() {
    return {
      tableRows: [],
      planName: "",
      numberOfVoyagers: 0,
      time: "",
      category: "",
      location: "",
      spending: 0,
      remarks: "",
      totalSpending: 0,
    };
  },
  components: {
    NavbarDefault,
    DefaultFooter,
    MaterialInput,
    MaterialButton,
    MaterialTextArea,
    MaterialSwitch,
  },
  methods: {
    savePlanToFs() {
      console.log("Saving plan with details:");
      console.log("Plan Name:", this.planName);
      console.log("Number of Voyagers:", this.numberOfVoyagers);
      console.log("Total Spending:", this.totalSpending);
      console.log("Items:", this.tableRows);

      // Resetting the table and form fields after saving
      this.resetFormAndTable();
    },

    addItem() {
      console.log("Adding item with values:", {
        time: this.time,
        category: this.category,
        location: this.location,
        spending: this.spending,
        remarks: this.remarks,
      });

      const newItem = {
        time: this.time,
        category: this.category,
        location: this.location,
        spending: this.spending,
        remarks: this.remarks,
      };

      this.tableRows.push(newItem);
      this.totalSpending += parseFloat(this.spending) || 0;

      console.log("New tableRows:", this.tableRows);

      // Reset form fields
      this.time = "";
      this.category = "";
      this.location = "";
      this.spending = 0;
      this.remarks = "";
    },

    deleteItem(index) {
      const item = this.tableRows.splice(index, 1)[0];
      this.totalSpending -= item.spending;
    },
    resetFormAndTable() {
      this.planName = "";
      this.numberOfVoyagers = 0;
      this.tableRows = [];
      this.totalSpending = 0;
      this.time = "";
      this.category = "";
      this.location = "";
      this.spending = 0;
      this.remarks = "";
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
              <v-text-field
                v-model="planName"
                label="Plan Name"
                class="mb-4"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="numberOfVoyagers"
                label="Number of Voyagers"
                type="number"
                class="mb-4"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-container>
            <v-form @submit.prevent="addItem">
              <v-text-field
                v-model="time"
                label="Time"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="category"
                label="Category"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="location"
                label="Location"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model.number="spending"
                label="Spending"
                type="number"
                class="mb-4"
              ></v-text-field>

              <v-textarea
                v-model="remarks"
                label="Remarks"
                class="mb-4"
              ></v-textarea>

              <MaterialButton
                type="submit"
                variant="gradient"
                color="dark"
                fullWidth
              >
                Add Row
              </MaterialButton>
            </v-form>
          </v-container>
        </div>
        <div class="plan table">
          <table id="table" class="auto-index">
            <tr>
              <th>Time</th>
              <th>Catagory</th>
              <th>Location</th>
              <th>Spending</th>
              <th>Remarks</th>
              <th>Options</th>
            </tr>
            <tr v-for="(row, index) in tableRows" :key="index">
              <td>{{ row.time }}</td>
              <td>{{ row.category }}</td>
              <td>{{ row.location }}</td>
              <td>{{ row.spending }}</td>
              <td>{{ row.remarks }}</td>
              <td>
                <MaterialButton
                  @click="deleteItem(index)"
                  type="submit"
                  variant="gradient"
                  color="dark"
                  >Delete</MaterialButton
                >
              </td>
            </tr>
          </table>
          <br /><br />

          <h2 id="totalProfit">Total Spending: ${{ totalSpending }}</h2>

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

  <DefaultFooter />
</template>

<style scoped>
.page-header {
  margin-top: 2rem; /* Adjust the value as needed */
  background-image: url("@/assets/img/voy8ger_image.jpeg"); /* Path to your image */
  background-size: cover; /* Cover the entire space */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
}

table {
  border-collapse: collapse;
  width: 100%;
}

#totalProfit {
  text-align: center;
  font: 700;
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}
</style>
