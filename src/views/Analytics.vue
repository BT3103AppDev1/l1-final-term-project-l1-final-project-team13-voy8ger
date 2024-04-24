<template>
  <div class="container position-sticky z-index-sticky top-0">
    <NavbarDefault />
    <div class="page-header min-vh-90" loading="lazy">
      <v-container>
        <v-row class="mt-15" justify="center">
          <h1 class="text-black pt-3 mt-n5 me-2 text-center">Analytics</h1>
          <!-- Render the BarChart only when dataReady is true -->
          <BarChart :chart-data-external="chartData" v-if="chartDataReady" />
        </v-row>
        <v-row class="mt-15" justify="center">
          <h1 class="text-black pt-3 mt-n5 me-2 text-center">
            Plans Created: {{ plansCreated }}
          </h1>
        </v-row>
      </v-container>
    </div>
    <DefaultFooter />
  </div>
</template>

<script setup>
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
import BarChart from "../components/Chart.vue"; // Corrected import statement
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { ref, reactive, onMounted } from "vue";

const auth = getAuth();
const user = ref(null);
const userEmail = ref("");
const chartData = reactive({
  lastMonth: 0,
  thisMonth: 0,
  nextMonth: 0,
});
const chartDataReady = ref(false);
const plansCreated = ref(0);

onAuthStateChanged(auth, (userInstance) => {
  if (userInstance) {
    user.value = userInstance;
    userEmail.value = userInstance.email;
    fetchPlans();
  }
});

async function fetchPlans() {
  const docRef = doc(db, "Users", userEmail.value);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const plansList = docSnap.data().plans_list || [];
    plansCreated.value = plansList.length;
    await aggregateSpending(plansList);
  }
}

async function aggregateSpending(plansList) {
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  for (let planId of plansList) {
    const planRef = doc(db, "Plans", planId);
    const planSnap = await getDoc(planRef);
    if (planSnap.exists()) {
      const planData = planSnap.data();
      const planDate = new Date(planData.Date.seconds * 1000);
      if (planDate >= lastMonth && planDate < nextMonth) {
        if (planDate.getMonth() === today.getMonth() - 1) {
          chartData.lastMonth += planData.creator_spending;
        } else if (planDate.getMonth() === today.getMonth()) {
          chartData.thisMonth += planData.creator_spending;
        } else if (planDate.getMonth() === today.getMonth() + 1) {
          chartData.nextMonth += planData.creator_spending;
        }
      }
    }
  }
  console.log("Chart Data from Analytics ", chartData);
  chartDataReady.value = true;
}
</script>

<script>
export default {
  components: {
    NavbarDefault,
    DefaultFooter,
    BarChart,
  },
  data() {
    return {
      plansCreated: 0,
    };
  },
};
</script>