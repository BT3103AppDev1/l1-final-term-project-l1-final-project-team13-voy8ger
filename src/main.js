import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import Toaster from "@meforma/vue-toaster";

const app = createApp(App)

app.use(router)
app.use(Toaster, {
    position: "top",
    dismissable: "true",
    maxToasts: 2
})

app.mount('#app')
