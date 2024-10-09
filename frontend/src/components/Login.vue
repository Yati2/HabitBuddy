<template>
  <div class="container mt-5">
    <h2 style="color:black;" class="text-center text-dark">Login</h2>
    <form @submit.prevent="loginUser">
      <div class="mb-3">
        <label for="username" style="color:black;" class="form-label text-dark">Username:</label>
        <input type="text" id="username" class="form-control" v-model="username" required />
        <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
      </div>
      <div class="mb-3">
        <label for="password" style="color:black;" class="form-label text-dark">Password:</label>
        <input type="password" id="password" class="form-control" v-model="password" required />
        <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <p v-if="message" class="mt-3">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      usernameError: '',
      passwordError: ''
    };
  },
  methods: {
    async loginUser() {
      // Reset errors
      this.usernameError = '';
      this.passwordError = '';

      // make sure got username
      if (!this.username) {
        this.usernameError = 'Username is required.';
        return;
      }

      // make sure got password
      if (!this.password) {
        this.passwordError = 'Password is required.';
        return;
      }

      // axios req to see if pw and username matches w db
      try {
        const response = await axios.post('http://localhost:8000/api/login', {
          username: this.username,
          password: this.password
        });
        this.message = response.data.message; // Show success message

        // Store the login state (this can be handled globally)
        localStorage.setItem('isLoggedIn', 'true');
      } catch (error) {
        console.error('Error logging in:', error);
        this.message = 'Invalid username or password.';
      }
    }
  }
};
</script>

<style scoped>
</style>
