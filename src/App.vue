<template>
  <div id ="nav">
    <router-view/>
  </div>

</template>

<script>

  import SignUp from './views/Auth/SignUp.vue';
  import LogIn from './views/Auth/LogIn.vue';
  import Home from './views/Home.vue';
  import Profile from './views/Profile.vue';

  export default {
    name: 'App',
    components: {
      SignUp,
      LogIn,
      Home,
      Profile
    }
  }
</script>

<!-- <style scoped>
</style> -->
