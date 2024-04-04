import { createApp } from "vue";
import { createPinia } from "pinia";
import Toaster from "@meforma/vue-toaster";
import App from "./App.vue";
import router from "./router/index.js";
import materialKit from "./material-kit";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
})

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(Toaster, {
  position: "top",
  dismissable: "true",
  maxToasts: 2,
});
app.use(vuetify);

app.mount("#app");
