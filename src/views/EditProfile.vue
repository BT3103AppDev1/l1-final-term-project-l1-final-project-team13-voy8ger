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
          ref="fileInput"
          id="profilePicture"
          @change="previewImage"
          accept="image/*"
          style="display: none"
        />
        <v-btn @click="getFile">Upload Photo</v-btn>
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
      user: {
        email: "",
      },
      profilePicture: null, // temp blob url
      profilePictureFile: null,
      bio: "",
    };
  },

  async mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        this.user.email = user.email;
        this.fetchUserData();
      }
    });
  },

  methods: {
    async fetchUserData() {
      const docSnap = await getDoc(doc(db, "Users", String(this.user.email)));
      const data = docSnap.data();
      this.profilePicture = data.profilePicture;
      this.bio = data.bio;
    },
    goBack() {
      this.$router.push("/prfle");
    },
    getFile() {
      this.$refs.fileInput.click();
    },
    previewImage(event) {
      const file = event.target.files[0];
      this.profilePictureFile = file;
      //allow user to preview photo without actually uploading the photo
      //photo only uploaded when user clicks save changes
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.profilePicture = reader.result;
        };
      }
    },
    async updateProfile() {
      const file = this.profilePictureFile;
      let imageUrl = "";

      if (file) {
        const fileRef = storageRef(storage, `ProfilePictures/${file.name}`);
        try {
          const uploadResult = await uploadBytes(fileRef, file);
          imageUrl = await getDownloadURL(uploadResult.ref);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      try {
        // Update profile picture
        if (imageUrl != "") {
          await updateDoc(doc(db, "Users", String(this.user.email)), {
            profilePicture: imageUrl,
          });
        }

        // Update bio
        if (this.bio != "") {
          await updateDoc(doc(db, "Users", String(this.user.email)), {
            bio: this.bio,
          });
        }
      } catch (error) {
        console.error("Error updating profile:", error.message);
      }
    },
  },
};
</script>
