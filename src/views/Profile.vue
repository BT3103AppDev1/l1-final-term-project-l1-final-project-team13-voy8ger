<template>
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
</template>

<script>
export default {
    data() {
        return {
            user: {
                name: "John Doe",
                bio: "I'm a software developer",
                posts: [
                    { id: 1, content: "Hello, world!" },
                    { id: 2, content: "Just had a great day!" },
                    { id: 3, content: "Working on a new project" }
                ]
            }
        };
    }
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