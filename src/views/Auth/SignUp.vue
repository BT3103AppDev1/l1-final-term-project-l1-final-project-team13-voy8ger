<script setup>
import { onMounted } from "vue";

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
                    Hello Voyager
                  </h4>
                  <div class="row mt-3 justify-content-center">
                    
                    <div class="col-2 text-center mm-auto bg-black-hover">
                      <a class="btn btn-link px-2" href="javascript:;">
                        <i class="fa fa-google text-white text-lg" ></i>
                      </a>
                    </div>

                  </div>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start">
                  <MaterialInput
                    id="displayName"
                    class="input-group-outline my-3"
                    :label="{ text: 'Name', class: 'form-label' }"
                  />
                  <MaterialInput
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
                    type="email"
                  />
                  <MaterialInput
                    id="password"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Password', class: 'form-label' }"
                    type="password"
                  />
                  <MaterialInput
                    id="Rpassword"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Retype Password', class: 'form-label' }"
                    type="password"
                  />

                  <div class="text-center">
                    <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      v-on:click.prevent="signup"
                      >Sign up</MaterialButton
                    >
                  </div class = "register-link">
                  <p class="mt-4 text-sm text-center">
                    Already have an account?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      v-on:click="pusher"
                      >Sign in</a
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
import { app, db} from "../../firebase.js"; // Import your Firebase app instance
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { setDoc,doc } from "firebase/firestore";

export default {
  // get required data if any
  data() {
    return {
      name: "",
      user: "",
      email: "",
      password: "",
      confirmedPassword: "",
      error: "",
      showError: true,
    };
  },
  methods: {
    // going to loginPage (if user already has an account)
    pusher() {
      this.$router.push({ name: "LogIn" });
    },

    async signup() {
      this.name = document.getElementById('displayName').value;
      this.email = document.getElementById('email').value;
      this.password = document.getElementById('password').value;
      this.confirmedPassword = document.getElementById('Rpassword').value;

      try {
        // create object for authentication
        const auth = getAuth(app);

        // error handling of passwords
        if (this.password != this.confirmedPassword) {
          this.error = "The 2 passwords doesn't match";
          throw this.error;
        } else if (this.password.length < 6) {
          this.error = "Ensure that the password is min 6 characters";
          throw this.error;
        }
        // if no errors/things to flag in user input
        else {
          await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password,
            this.confirmedPassword
          )
            .then((userCred) => {
              this.user = userCred.user;
              
              // Sign up successful
              this.$toast.success(`Sign up has been successful`);
              
              // shows the sign up has been successful for 1 seconds before going to home page
              setTimeout(() => {
                this.$router.push({ name: "LogIn" });
              }, 2000);
          
            })
            .catch((error) => {
              // Handle sign up error
              this.$toast.error(`There is some issues with the sign up`);
              console.log(error);
            });

          // set the user details into the firestore database
          const docRef = await setDoc(doc(db, "Users", this.email), {
            Name:this.name,
            email:this.email,
            plans_list:[],
            profile_pic:null,
            saved_list: [],
            username: this.name
          })
          console.log(docRef);

          // send email Verification to user
          await sendEmailVerification(this.user);
          
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
  }


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




 <!-- <template>
//   <body>
//     <div class="wrapper">
//       <form action="">
//         <div class="boxer">
//           <h1>Greetings Voyager</h1>
//         </div>

//         <div class="input-box">
//           <input type="text" placeholder="Display Name" required />
//         </div>

//         <div class="input-box">
//           <input type="text" placeholder="Email" v-model="email" required />
//         </div>

//         <div class="input-box">
//           <input
//             type="password"
//             placeholder="Password"
//             v-model="password"
//             required
//           />
//         </div>

//         <div class="input-box">
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             v-model="confirmedPassword"
//             required
//           />
//         </div>

//         <button type="submit" class="btn" v-on:click.prevent="signup">
//           Sign Up
//         </button>
//         <div class="register-link">
//           <p>
//             Already have an account? <a href="#" v-on:click="pusher">Sign in</a>
//           </p>
//           <p>Forgot Password? <a href="#">Reset</a></p>
//         </div>
//       </form>
//     </div>
//   </body>
// </template>

// <script>
// import { app } from "../../firebase.js"; // Import your Firebase app instance
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   sendEmailVerification,
// } from "firebase/auth";
// // import { ref } from "vue";

// export default {
//   // get required data if any
//   data() {
//     return {
//       email: "",
//       password: "",
//       confirmedPassword: "",
//       error: "",
//       showError: true,
//       user: "",
//     };
//   },
//   methods: {
//     // going to loginPage (if user already has an account)
//     pusher() {
//       this.$router.push({ name: "LogIn" });
//     },

//     // creating User
//     async signup() {
//       try {
//         // create object for authentication
//         const auth = getAuth(app);

//         // error handling of passwords
//         if (this.password != this.confirmedPassword) {
//           this.error = "Your password doesn't match just like your face";
//           throw this.error;
//         } else if (this.password.length < 6) {
//           this.error = "Length of password is too small just like ur";
//           throw this.error;
//         }
//         // if no errors/things to flag in user input
//         else {
//           await createUserWithEmailAndPassword(
//             auth,
//             this.email,
//             this.password,
//             this.confirmedPassword
//           )
//             .then((userCred) => {
//               // store user details
//               this.user = userCred.user;

//               // Sign up successful
//               this.$toast.success(`Sign up has been successful`);
//               // shows the sign up has been successful for 1 seconds before going to home page
//               setTimeout(() => {
//                 this.$router.push({ name: "LogIn" });
//               }, 2000);
//             })
//             .catch((error) => {
//               // Handle sign up error
//               this.$toast.error(`There is some issues with the sign up`);
//               console.log(error);
//             });

//           // send email Verification to user
//           await sendEmailVerification(this.user);
//         }
//       } catch (err) {
//         // catch the error
//         if (this.error.length > 0) {
//           console.log(err);
//           this.$toast.error(err);
//         } else {
//           console.log(err);
//           this.$toast.error("Your inputs did not meet our requirements");
//         }
//       }
//     },
//   },
// };
// </script>

// <style scoped>
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
//   font-family: "Poppins", sans-serif;
// }
// body {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
//   background: url(bg.jpg) no-repeat;
//   background-size: cover;
//   background-position: center;
//   background-color: #333;
// }

// .wrapper {
//   width: 400px;
//   border: 2px solid rgba(255, 255, 255, 0.2);
//   backdrop-filter: blur(9px);
//   background-color: #fff;
//   border-radius: 10px;
//   padding: 30px 40px;
// }

// .wrapper .boxer {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 55px;
//   background: linear-gradient(to bottom right, turquoise, blue);
//   box-shadow: 0px 5px 5px -5px rgba(0, 0, 0, 0.75);
//   border-radius: 10px;
// }

// .boxer h1 {
//   font-size: 20px;
//   color: white;
// }

// .wrapper .input-box {
//   position: relative;
//   width: 100%;
//   height: 35px;
//   margin: 10px 0;
// }

// .input-box input {
//   width: 100%;
//   height: 100%;
//   border: 1px solid lightslategray;
//   border-radius: 5px;
//   font-size: 13px;
//   color: black;
//   padding: 15px 40px 15px 15px;
// }

// .input-box input::placeholder {
//   color: lightslategray;
// }

// .wrapper .remember-forgot {
//   display: inline-block;
//   justify-content: space-between;
//   font-size: 14.5px;
//   margin: 10px 0px 15px;
// }
// .remember-forgot label input {
//   accent-color: #fff;
//   margin-right: 5px;
// }
// .remember-forgot a {
//   color: #fff;
//   text-decoration: none;
// }

// .remember-forgot a:hover {
//   text-decoration: underline;
// }

// .wrapper .btn {
//   width: 100%;
//   height: 45px;
//   border: none;
//   background: turquoise;
//   border-radius: 10px;
//   font-size: 16px;
//   color: white;
//   font-weight: 600;
// }

// .wrapper .btn:hover {
//   filter: brightness(85%);
// }

// .wrapper .register-link {
//   font-size: 14.5px;
//   text-align: center;
//   margin: 20px 3px 15px;
//   color: lightslategray;
// }
// .register-link p a {
//   color: black;
//   text-decoration: none;
//   font-weight: 600;
// }

// .register-link p a:hover {
//   text-decoration: underline;
// }
// </style> -->
