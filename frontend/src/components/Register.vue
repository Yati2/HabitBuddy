<template>
  <div class="container-fluid bg-register">
    <div class="overlay row">
      <!-- App Name -->
      <div class="app-info col-6 text-center p-10px">
        <h1 class="app-name">HabitBuddy</h1>
        <h3 class="description">Take care of yourself while taking care of your pet!</h3>
      </div>

      <!-- Registration Form -->
      <div class="col-6 d-flex justify-content-center">
        <div class="form-container">
          <h3>Sign Up For Free</h3>
          <form @submit.prevent="registerUser">
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input type="text" id="username" class="form-control" v-model="username" required />
              <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input type="email" id="email" class="form-control" v-model="email" required />
              <p v-if="emailError" class="text-danger">{{ emailError }}</p>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input
                type="password"
                id="password"
                class="form-control"
                v-model="password"
                required
              />
              <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
            </div>
            <button type="submit" class="btn w-100">Register</button>
          </form>

          <!-- Error Message -->
          <p v-if="message" class="mt-3 mb-5 text-white">{{ message }}</p>
          <p>Already have an account ? <a href="/login">Login here!</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      message: '',
      usernameError: '',
      emailError: '',
      passwordError: ''
    }
  },
  methods: {
    async registerUser() {
      // Reset errors and message
      this.usernameError = ''
      this.emailError = ''
      this.passwordError = ''
      this.message = ''

      // make sure username matches requirement
      if (!this.validateUsername(this.username)) {
        this.usernameError =
          'Username must be between 6-10 characters and can only contain letters, numbers, and underscores.'
        return
      }

      // make sure valid email
      if (!this.validateEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.'
        return
      }

      // make sure pw matches requirement
      if (!this.validatePassword(this.password)) {
        this.passwordError =
          'Password must contain at least 8 characters, including letters and numbers.'
        return
      }

      // make sure username is unique
      const existingUser = await this.checkUsernameExists(this.username)
      if (existingUser) {
        this.usernameError = 'Username already exists.'
        return
      }

      // axios req to register user
      try {
        const response = await axios.post('http://localhost:8000/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        })

        // success message alert
        alert('Registration successful!')
        this.resetForm()
      } catch (error) {
        console.error('Error registering user:', error)
        this.message = 'Error registering user.'
      }
    },

    validateUsername(username) {
      const regex = /^[a-zA-Z0-9_]{6,10}$/
      return regex.test(username)
    },

    validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },

    validatePassword(password) {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      return regex.test(password)
    },

    async checkUsernameExists(username) {
      try {
        const response = await axios.get(`http://localhost:8000/api/users`)
        const users = response.data
        return users.some((user) => user.username === username)
      } catch (error) {
        console.error('Error checking username:', error)
        return false
      }
    },

    resetForm() {
      this.username = ''
      this.email = ''
      this.password = ''
      this.message = ''
    }
  }
}
</script>

<style scoped>
.btn {
  background-color: #eec0c2ba;
  margin-bottom: 10px;
}
a {
  color: #ffc1c4;
  font-weight: bold;
}
.bg-register {
  background-image: url('@/assets/bg_login_register.gif'); /* Background GIF */
  background-size: cover; /* Set width to 100% and height to auto */
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  margin: 0;
  justify-content: center;
}

.overlay {
  position: relative;
  /* background: rgba(0, 0, 0, 0.5); Dark overlay to improve readability */
  padding: 2rem;
  width: 70%;
  border-radius: 10px;
  text-align: center;
}

.description {
  color: white;
  font-size: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
}

.app-name {
  color: white;
  font-size: 4.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 5px;
}
.app-info {
  margin-top: auto;
  margin-bottom: auto;
}

.form-container {
  background-color: rgba(255, 255, 255, 0.341); /* Semi-transparent background for form */
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}
</style>
