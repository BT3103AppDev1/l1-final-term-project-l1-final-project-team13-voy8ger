<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>
  <div class="profile">
    <h1>{{ user.name }}</h1>
    <p>{{ user.bio }}</p>
    <div class="posts">
      <h2>Posts</h2>
      <ul>
        <li v-for="post in user.posts" :key="post.id">
          {{ post.content }}
        </li>
      </ul>
    </div>
  </div>
  <DefaultFooter />
</template>

<script setup>
import NavbarDefault from "../components/NavbarDefault.vue";
import DefaultFooter from "../components/FooterDefault.vue";
</script>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: {
        name: "John Doe",
        bio: "I'm a software developer",
        posts: [
          { id: 1, content: "Plans 1" },
          { id: 2, content: "Plans 2" },
          { id: 3, content: "Plans 3" },
        ],
      },
    };
  },
  components: {
    // Add your components here
  },
};
</script>

<style scoped>
.profile {
  /* Add your styles here */
}

.posts {
  /* Add your styles here */
}
</style>
