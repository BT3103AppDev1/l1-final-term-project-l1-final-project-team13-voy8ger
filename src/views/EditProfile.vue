<template>
  <div class="container">
    <v-btn color="error" icon size="small" variant="plain" @click="goBack">
      <v-icon>{{ "mdi-keyboard-backspace" }}</v-icon
      >Back
    </v-btn>
    <h3>Edit Profile</h3>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="profilePicture">Profile Picture: </label>
        <div v-if="profilePicture">
          <v-avatar size="100" class="mb-2">
            <img :src="profilePicture" alt="uploaded image" />
          </v-avatar>
        </div>
        <div v-else id="no-image">No Image</div>
        <input
          type="file"
          id="profilePicture"
          @change="previewImage, uploadPhoto"
          accept="image/*"
        />
      </div>
      <div>
        <label for="bio">Bio:</label>
        <textarea id="bio" v-model="bio"></textarea>
      </div>
      <v-btn @click="updateProfile">Save Changes</v-btn>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage } from "../firebase.js";
import "@mdi/font/css/materialdesignicons.css";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
</script>
<script>
export default {
  name: "EditProfile",
  data() {
    return {
      user : {
        email: "",
      },
      profilePicture: ref(""),
      bio: ref(""),
    };
  },

  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.user.email = user.email;
      }
    });
  },

  methods: {
    async updateProfile() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // Update profile picture
        if (this.profilePicture.value) {
          const storageRef = storage.ref();
          const fileRef = storageRef.child(`profilePictures/${user.uid}`);
          await fileRef.put(this.profilePicture.value);
          const imageUrl = await fileRef.getDownloadURL();
          await updateDoc(doc(db, "Users", user.uid), {
            profilePicture: imageUrl,
          });
        }

        // Update bio
        await updateDoc(doc(db, "Users", user.uid), {
          bio: this.bio.value,
        });

        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (!file) return;

      const fileRef = storageRef(storage, `ProfilePictures/${file.name}`);

      try {
        const uploadResult = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    },
    goBack() {
      this.$router.push("/prfle");
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.profilePicture = reader.result;
        };
      }
    },
  },
};
</script>
