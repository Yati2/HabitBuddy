<template>
  <div class="container-fluid">
    <div class="overlay row">
      <div class="app-info col-lg-6 col-12 text-center">
        <h1 class="app-name">HabitBuddy</h1>
        <h3 class="description">Take care of yourself while taking care of your pet!</h3>
      </div>
      <div class="col-lg-6 col-12 d-flex justify-content-center">
        <div class="form-container">
          <h3>Welcome Back</h3>
          <form @submit.prevent="loginUser">
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input type="text" id="username" class="form-control" v-model="username" required />
              <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
            </div>
            <div class="mb-4">
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
            <button type="submit" class="btn w-100">Login</button>
            <p v-if="message" class="mt-3 text-center">{{ message }}</p>
            <p style="font-size: 1rem">New here ? <a href="/register">Register here!</a></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router' // Import useRouter

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      usernameError: '',
      passwordError: ''
    }
  },
  setup() {
    const router = useRouter() // Initialize the router
    return { router }
  },
  methods: {
    async loginUser() {
      // Reset errors
      this.usernameError = ''
      this.passwordError = ''

      // make sure got username
      if (!this.username) {
        this.usernameError = 'Username is required.'
        return
      }

      // make sure got password
      if (!this.password) {
        this.passwordError = 'Password is required.'
        return
      }

      // axios req to see if pw and username matches w db
      try {
        const response = await axios.post('https://habit-buddy-server.vercel.app//api/login', {
          username: this.username,
          password: this.password
        })
        this.message = response.data.message // Show success message

        // Store the login state (this can be handled globally)
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('username', this.username)
        this.$router.push('/tasks')
      } catch (error) {
        console.error('Error logging in:', error)
        this.message = 'Invalid username or password.'
      }
    }
  }
}
</script>

<style scoped>
.btn {
  background-color: #f7bec1;
  margin-bottom: 10px;
  font-size: 1.2rem;
}
.btn:hover {
  background-color: #be9294;
}
a {
  color: #ffc1c4;
  font-weight: bold;
}
a:hover {
  color: #be9294;
}
.container-fluid {
  background-image: url('@/assets/backgrounds/bg_login_register.gif'); /* Background GIF */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
}

.overlay {
  position: relative;
  /* background: rgba(0, 0, 0, 0.5); Dark overlay to improve readability */
  padding: auto;
  width: 100%;
  height: 100%;
  margin: auto;
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
  font-size: 4rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 5px;
}
.app-info {
  margin-top: auto;
  margin-bottom: auto;
  font-family: 'Pixelify Sans', sans-serif;
}

.form-container {
  font-family: 'Jersey 25', sans-serif;
  font-size: 1.3rem;
  background-color: rgba(255, 255, 255, 0.474); /* Semi-transparent background for form */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}
</style>
