import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '../components/Auth/SignUp.vue'
import LogIn from '../components/Auth/LogIn.vue'
import Home from '../components/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SignUp',
      component: SignUp
    }, {
      path: '/login',
      name: 'LogIn',
      component: LogIn
    }, {
        path: '/Home',
        name: 'Home',
        component: Home
    }
  ]
})

export default router
