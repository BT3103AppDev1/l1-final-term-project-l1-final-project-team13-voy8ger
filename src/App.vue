<template>
  <div id ="nav">
    <router-view/>
  </div>

</template>

<script>

  import SignUp from './components/Auth/SignUp.vue';
  import LogIn from './components/Auth/LogIn.vue';
  import Home from './components/Home.vue';

  export default {
    name: 'App',
    components: {
      SignUp,
      LogIn,
      Home
    }
  }
</script>

<style scoped>
</style>
