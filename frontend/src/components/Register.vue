<template>
  <div class="container-fluid">
    <div class="overlay row">
      <!-- App Name -->
      <div class="app-info col-lg-6 col-12 text-center">
        <h1 class="app-name">HabitBuddy</h1>
        <h3 class="description">Take care of yourself while taking care of your pet!</h3>
      </div>

      <!-- Registration Form -->
      <div class="col-lg-6 col-12 d-flex justify-content-center">
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
            </div>
            <div class="mb-4">
              <label for="confirm-password" class="form-label">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                class="form-control"
                v-model="confirmPassword"
                required
              />
              <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
            </div>
            <button type="submit" class="btn w-100">Register</button>
          </form>

          <!-- Error Message -->
          <p v-if="message" class="mt-3 mb-5 text-white">{{ message }}</p>
          <p style="font-size: 1rem">Already have an account ? <a href="/login">Login here!</a></p>
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
      confirmPassword: '',
      message: '',
      usernameError: '',
      emailError: '',
      passwordError: ''
    }
  },
  methods: {
    async registerUser() {
      this.usernameError = ''
      this.emailError = ''
      this.passwordError = ''
      this.message = ''

      if (!this.validateUsername(this.username)) {
        this.usernameError =
          'Username must be between 6-10 characters and can only contain letters, numbers, and underscores.'
        return
      }

      if (!this.validateEmail(this.email)) {
        this.emailError = 'Please enter a valid email address.'
        return
      }

      if (!this.validatePassword(this.password)) {
        this.passwordError =
          'Password must contain at least 8 characters, including letters and numbers.'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match.'
        return
      }

      const existingUser = await this.checkUsernameExists(this.username)
      if (existingUser) {
        this.usernameError = 'Username already exists.'
        return
      }

      try {
        const response = await axios.post('https://habit-buddy-server.vercel.app/api/register', {
          username: this.username,
          email: this.email,
          password: this.password,
          points: 0,
          habitcompleted: 0,
          longtermcompleted: 0,
          todocompleted: 0
        })

        alert('Registration successful! Redirecting to tasks page...')

        this.$router.push('/tasks')
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
        const response = await axios.get('https://habit-buddy-server.vercel.app/api/users')
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
      this.confirmPassword = ''
      this.message = ''
    }
  }
}
</script>

<style scoped>
.btn {
  font-size: 1.3rem;
  background-color: #f7bec1;
  margin-bottom: 10px;
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
  background-image: url('https://i.pinimg.com/originals/6a/dc/87/6adc878b255111abc1f13748a257d38f.gif');
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
  padding: auto;
  width: 90%;
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
  background-color: rgba(255, 255, 255, 0.474);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.form-label {
  font-size: 1.3rem;
}
</style>
