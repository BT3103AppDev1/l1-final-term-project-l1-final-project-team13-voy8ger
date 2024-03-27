import { createApp } from "vue";
import { createPinia } from "pinia";
import Toaster from "@meforma/vue-toaster";
import App from "./App.vue";
import router from "./router/index.js";
import materialKit from "./material-kit";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(Toaster, {
  position: "top",
  dismissable: "true",
  maxToasts: 2,
});

app.mount("#app");
