<template>
<body>
  <div class="wrapper">
    <form action="">
      <div class = "boxer">
        <h1>Greetings Voyager</h1>
      </div>
      
      <!-- All the form elements -->
      <div class="input-box">
        <input type="text" placeholder="Display Name" required>
      </div>

      <div class="input-box">
        <input type="text" placeholder="Email" v-model="email" required>
      </div>

      <div class="input-box">
        <input type="password" placeholder="Password" v-model="password" required>
      </div>

      <div class="input-box">
        <input type="password" placeholder="Confirm Password" v-model="confirmedPassword" required>
      </div>

      <button type="submit" class="btn" v-on:click.prevent = "signup">Sign Up</button>
      <div class="register-link">
        <p>Already have an account? <a href="#" v-on:click="pusher">Sign in</a></p>
        <p>Forgot Password? <a href="#">Reset</a></p>
      </div>

    </form>
  </div>
</body>
</template>

<script>
import { app } from '../../firebase.js'; // Import your Firebase app instance
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from 'vue' 

    export default {
        // get required data if any
        data() {
            return {
                email: '',
                password: '',
                confirmedPassword: '',
                error: '',
                showError: true
            };
        },
        methods: {
            // going to loginPage (if user already has an account)
            pusher() {
              this.$router.push({ name: 'LogIn' });
            },
           
            // creating User
            async signup(){

                try {
                  // create object for authentication
                  const auth = getAuth(app)
                  
                  // error handling of passwords
                  if(this.password != this.confirmedPassword) {
                      this.error = "Your password doesn't match just like your face";
                      throw this.error;
                  } else if ((this.password.length) < 6) {
                      this.error = "Length of password is too small just like ur";
                      throw this.error;
                  } 
                  // if no errors/things to flag in user input
                  else {
                      await createUserWithEmailAndPassword(auth,this.email, this.password, this.confirmedPassword)
                  .then(() => {
                  // Sign up successful
                  this.$toast.success(`Sign up has been successful`);
                  // shows the sign up has been successful for 1 seconds before going to home page
                  setTimeout(() => {
                    this.$router.push({ name: 'Login' });
                  }, 2000);
                  })
                  .catch(error => {
                  // Handle sign up error
                  this.$toast.error(`There is some issues with the sign up`);
                  });
                }
                } 
                // catch the error
                catch(err) {
                  if(this.error.length > 0) {
                    console.log(err);
                    this.$toast.error(err);
                  } else {
                    console.log(err);
                    this.$toast.error("Your inputs did not meet our requirements");
                  } 
                }
            }
        }
        };
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url(bg.jpg) no-repeat;
  background-size: cover;
  background-position: center;
  background-color: #333;
}

.wrapper{
  width: 400px;
  border: 2px solid rgba(255, 255, 255, .2);
  backdrop-filter: blur(9px);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px 40px;
}

.wrapper .boxer {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 55px;
    background: linear-gradient(to bottom right, turquoise, blue);
    box-shadow: 0px 5px 5px -5px rgba(0, 0, 0, 0.75);
    border-radius: 10px;
}

.boxer h1{
  font-size: 20px;
  color: white;
}

.wrapper .input-box{
  position: relative;
  width: 100%;
  height: 35px;
  margin: 10px 0;
}

.input-box input{
  width: 100%;
  height: 100%;
  border: 1px solid lightslategray;
  border-radius: 5px;
  font-size: 13px;
  color: black;
  padding: 15px 40px 15px 15px;
}

.input-box input::placeholder{
  color: lightslategray
}

.wrapper .remember-forgot{
  display: inline-block;
  justify-content: space-between;
  font-size: 14.5px;
  margin: 10px 0px 15px;
}
.remember-forgot label input{
  accent-color: #fff;
  margin-right: 5px;

}
.remember-forgot a{
  color: #fff;
  text-decoration: none;
}

.remember-forgot a:hover{
  text-decoration: underline;
}

.wrapper .btn{
  width: 100%;
  height: 45px;
  border: none;
  background: turquoise;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.wrapper .btn:hover {
    filter: brightness(85%);
}

.wrapper .register-link{
  font-size: 14.5px;
  text-align: center;
  margin: 20px 3px 15px;
  color: lightslategray
}
.register-link p a{
  color: black;
  text-decoration: none;
  font-weight: 600;
}

.register-link p a:hover{
  text-decoration: underline;
}

</style>