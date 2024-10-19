<template>
    <div v-if="isAuthenticatedUser" class="profile-container">
      <h2>Welcome, {{ user.username }}!</h2>
      <img src="../assets/profilepics/pfpd.jpeg" class="avatar mx-auto">

  
      <form @submit.prevent="changePassword">
        <div>
          <label for="new-password">New Password:</label>
          <input type="password" id="new-password" v-model="newPassword" required />
        </div>
        <div>
          <label for="confirm-password">Confirm Password:</label>
          <input type="password" id="confirm-password" v-model="confirmPassword" required />
        </div>
        <button class="btn btn-outline-primary mt-2" type="submit">Change Password</button>
      </form>
      <button class="btn btn-outline-dark mt-2" @click="logoutDev">LogoutDev</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { isAuthenticated } from '@/auth'
  
  export default {
    name: 'Profile',
    data() {
      return {
        user: {},
        newPassword: '',
        confirmPassword: '',
        isAuthenticatedUser: false
      }
    },
    created() {
      // Check if the user is authenticated on creation
      if (isAuthenticated()) {
        this.isAuthenticatedUser = true
        this.getUserInfo();
      } else {
        this.isAuthenticatedUser = false
        this.$router.push('/login')
      }
    },
    methods: {
      // get user info frm backend
      getUserInfo() {
        const username = localStorage.getItem('username');
        axios.get(`http://localhost:8000/api/users/${username}`)
          .then(response => {
            this.user = response.data; 
          })
          .catch(error => {
            console.error('Error fetching user info:', error);
          });
      },

      logoutDev(){ //reset loggedin params
        localStorage.setItem('isLoggedIn', '') 
        localStorage.setItem('username', '')
        this.$router.push('/login')
      },
  
      // Change password method
      changePassword() {
        if (this.newPassword !== this.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
  
        axios.put(`http://localhost:8000/api/users/${this.user.username}/password`, {
          password: this.newPassword
        })
        .then(response => {
          alert('Password updated successfully');
          this.newPassword = '';
          this.confirmPassword = '';
        })
        .catch(error => {
          console.error('Error updating password:', error);
          alert('Error updating password');
        });
      }
    }
  }
  </script>
  
  <style scoped>
    /* Add your styles here */
    .profile-container {
      max-width: 500px;
      margin: auto;
      padding: 20px;
    }
  
    input {
      display: block;
      margin-bottom: 10px;
      padding: 8px;
      width: 100%;
      box-sizing: border-box;
    }
    .avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
 }
  </style>
  