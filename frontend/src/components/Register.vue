<template>
    <div class="container mt-5">
      <h2 style="color:black;" class="text-center text-dark">Register</h2>
      <form @submit.prevent="registerUser">
        <div class="mb-3">
          <label for="username" style="color:black;" class="form-label text-dark">Username:</label>
          <input type="text" id="username" class="form-control" v-model="username" required />
          <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
        </div>
        <div class="mb-3">
          <label for="email" style="color:black;" class="form-label text-dark">Email:</label>
          <input type="email" id="email" class="form-control" v-model="email" required />
          <p v-if="emailError" class="text-danger">{{ emailError }}</p>
        </div>
        <div class="mb-3">
          <label for="password" style="color:black;" class="form-label text-dark">Password:</label>
          <input type="password" id="password" class="form-control" v-model="password" required />
          <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
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
        email: '',
        password: '',
        message: '',
        usernameError: '',
        emailError: '',
        passwordError: ''
      };
    },
    methods: {
      async registerUser() {
        // Reset errors
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
  
        // Validate username
        if (!this.validateUsername(this.username)) {
          this.usernameError = 'Username must be between 6-10 characters and can only contain letters, numbers, and underscores.';
          return;
        }
  
        // Validate email
        if (!this.validateEmail(this.email)) {
          this.emailError = 'Please enter a valid email address.';
          return;
        }
  
        // Validate password
        if (!this.validatePassword(this.password)) {
          this.passwordError = 'Password must contain at least 8 characters, including letters and numbers.';
          return;
        }
  
        // Check if username already exists
        const existingUser = await this.checkUsernameExists(this.username);
        if (existingUser) {
          this.usernameError = 'Username already exists.';
          return;
        }
  
        // Send registration request to the server
        try {
          const response = await axios.post('http://localhost:8000/api/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          this.message = response.data.message; // Show success message
          this.resetForm(); // Reset the form
        } catch (error) {
          console.error('Error registering user:', error);
          this.message = 'Error registering user.';
        }
      },
  
      validateUsername(username) {
        const regex = /^[a-zA-Z0-9_]{6,10}$/; // Regex for 6-10 characters, letters, numbers, underscores
        return regex.test(username);
      },
  
      validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        return regex.test(email);
      },
  
      validatePassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, including letters and numbers
        return regex.test(password);
      },
  
      async checkUsernameExists(username) {
        try {
          const response = await axios.get(`http://localhost:8000/api/users`);
          const users = response.data;
          return users.some(user => user.username === username); // Check if username exists
        } catch (error) {
          console.error('Error checking username:', error);
          return false;
        }
      },
  
      resetForm() {
        this.username = '';
        this.email = '';
        this.password = '';
        this.message = '';
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any additional styles here if needed */
  </style>
  