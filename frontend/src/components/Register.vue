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
      </form>
  
      <!-- Error Message -->
      <p v-if="message" class="mt-3">{{ message }}</p>
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
        passwordError: '',
      };
    },
    methods: {
      async registerUser() {
        // Reset errors and message
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
  
        // make sure username matches requirement
        if (!this.validateUsername(this.username)) {
          this.usernameError = 'Username must be between 6-10 characters and can only contain letters, numbers, and underscores.';
          return;
        }
  
        // make sure valid email
        if (!this.validateEmail(this.email)) {
          this.emailError = 'Please enter a valid email address.';
          return;
        }
  
        // make sure pw matches requirement
        if (!this.validatePassword(this.password)) {
          this.passwordError = 'Password must contain at least 8 characters, including letters and numbers.';
          return;
        }
  
        // make sure username is unique
        const existingUser = await this.checkUsernameExists(this.username);
        if (existingUser) {
          this.usernameError = 'Username already exists.';
          return;
        }
  
        // axios req to register user
        try {
          const response = await axios.post('http://localhost:8000/api/register', {
            username: this.username,
            email: this.email,
            password: this.password
          });
          
          // success message alert
          alert("Registration successful!");
          this.resetForm(); 
        } catch (error) {
          console.error('Error registering user:', error);
          this.message = 'Error registering user.';
        }
      },
  
      validateUsername(username) {
        const regex = /^[a-zA-Z0-9_]{6,10}$/; 
        return regex.test(username);
      },
  
      validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return regex.test(email);
      },
  
      validatePassword(password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
        return regex.test(password);
      },
  
      async checkUsernameExists(username) {
        try {
          const response = await axios.get(`http://localhost:8000/api/users`);
          const users = response.data;
          return users.some(user => user.username === username); 
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
  </style>
  