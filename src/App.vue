<template>
  <div id="nav">
    <router-view />
  </div>
</template>

<script>

  import SignUp from './views/Auth/SignUp.vue';
  import LogIn from './views/Auth/LogIn.vue';
  import Home from './views/Home.vue';
  import Profile from './views/Profile.vue';
  import Favourites from "./views/Favourites.vue";
  import SinglePlan from "./views/SinglePlan.vue";

  export default {
    name: 'App',
    components: {
      SignUp,
      LogIn,
      Home,
      Profile,
      Favourites,
      SinglePlan
    }
  }
</script>

<!-- <style scoped>
</style> -->
