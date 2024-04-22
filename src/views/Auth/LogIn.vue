<script setup>
import { onMounted, ref } from "vue";

// example components
import Header from "@/components/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/material_components/MaterialInput.vue";
import MaterialSwitch from "@/components/material_components/MaterialSwitch.vue";
import MaterialButton from "@/components/material_components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
</script>
<template>
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                    Welcome Back
                  </h4>
                  <div class="row mt-3 justify-content-center">
                    
                    <div class="col-2 text-center mm-auto bg-black-hover">
                      <a class="btn btn-link px-2" href="javascript:;">
                        <i class="fa fa-google text-white text-lg" v-on:click="googleSignIn"></i>
                      </a>
                    </div>

                  </div>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <MaterialInput
                    ref = "emailInput"
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
                    type="email"
                  />
                  <MaterialInput
                    ref = "passwordInput"
                    id="password"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Password', class: 'form-label' }"
                    type="password"
                  />
                  <MaterialSwitch
                    class="d-flex align-items-center mb-3"
                    id="rememberMe"
                    labelClass="mb-0 ms-3"
                    checked
                    >Remember me</MaterialSwitch
                  >

                  <div class="text-center">
                    <MaterialButton
                      id = "matButton"
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      v-on:click.prevent="login"
                      >Sign in</MaterialButton
                    >
                  </div class = "register-link">
                  <p class="mt-4 text-sm text-center">
                    Don't have an account?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      v-on:click="pusher"
                      >Sign up</a
                    >
                  </p>
                  <p class="mt-1 text-sm text-center">
                    Forgot Password?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      v-on:click="resetPassword"
                      >Reset</a
                    >
                  </p>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </Header>
</template>

<script>
import { app } from "../../firebase.js"; // Import your Firebase app instance
import { collection, doc, setDoc } from "firebase/firestore"; 
import { getAuth, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, GoogleAuthProvider } from "firebase/auth";

export default {
  // get required data if any
  data() {
    return {
      email: "",
      password: "",
      error: "",
      showError: true,
      // for email verification
      isEmailVerified: false,
      loginAttempted: false,
    };
  },
  methods: {
    // going to loginPage (if user already has an account)
    pusher() {
      this.$router.push({ name: "SignUp" });
    },

    // login user with google
    async googleSignIn() {

      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    },

    // login User with emai
    async login() {
      // since cannot pass in v-model directly
      this.email = document.getElementById("email").value;
      this.password = document.getElementById("password").value 

      try {
        // create object for authentication
        const auth = getAuth(app);

        // error handling of passwords
        if (this.email.length == 0) {
          this.error = "Email Field is empty";
          throw this.error;
        } else if (this.password.length == 0) {
          this.error = "Password Field is empty";
          throw this.error;
        } 
        // if no errors/things to flag in user input
        else {
          await signInWithEmailAndPassword(auth, this.email, this.password)
            .then((UserCredential) => {
              // check if user has been verified or not before letting them to log in
              this.isEmailVerified = UserCredential.user.emailVerified;
              this.loginAttempted = true;

              if (this.isEmailVerified || UserCredential.user.email == "testuser@test.com") {
                // Sign in successful
                this.$toast.success(`Sign in has been successful`);
                // shows the sign in has been successful before going to home page
                this.$router.push({ name: "Home" });
              } else {
                this.$toast.error(`Please verify your email`);
              }
            })
            .catch((error) => {
              // Handle login error
              console.log(error);
              this.$toast.error(`There is some issues with the sign in`);
            });
        }
      } catch (err) {
        // catch the error
        if (this.error.length > 0) {
          console.log(err);
          this.$toast.error(err);
        } else {
          console.log(err);
          this.$toast.error("Your inputs did not meet our requirements");
        }
      }
    },

    // reset password - only for email
    async resetPassword(email) {
      const auth = getAuth(app);
      // since cannot pass in v-model directly
      this.email = document.getElementById("email").value;
      this.password = document.getElementById("password").value 

      await sendPasswordResetEmail(auth,this.email)
        .then(() => {
          // Password reset email sent.
          this.$toast.success("Password reset email sent successfully.");
        })
        .catch((error) => {
          // Error occurred. Handle error here.
          if (this.email.length == 0) {
            this.$toast.error("Please key in an email to reset the password");
          } else {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            this.$toast.error("Error sending email to reset password");
          }
        });
    }
  },
};
</script>

<style scoped>
.bg-black-hover {
    transition: 0.3s ease;
}

.bg-black-hover:hover {
    background-color: darkgreen;
}

</style>


