<template>
  <div v-if="isAuthenticatedUser" class="profile-container">
    <!-- Profile content -->
    <div class="jumbotron">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 profile text-center">
            <h1>{{ user.username || 'user' }}'s Profile!</h1>
          </div>
        </div>

        <div class="row">
          <div class="col-12 text-center position-relative">
            <img :src="bgImage" alt="Background Img" class="bg-img" />
            <button @click="showImageOptions('bg')" class="btn btn-primary change-bg-button">
              Change Picture
            </button>
            <img :src="avatarImage" class="avatar mx-auto" />
            <button
              @click="showImageOptions('avatar')"
              class="btn btn-primary change-avatar-button"
            >
              Change Avatar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Selector -->
    <div v-if="showImageSelector" class="image-selector">
      <div v-if="selectedType === 'bg'" class="image-options">
        <h3>Select a Background Image</h3>
        <div class="images">
          <img
            v-for="(image, index) in backgroundImages"
            :key="index"
            :src="image"
            @click="changeBackground(image)"
            class="image-option"
          />
        </div>
      </div>
      <div v-else-if="selectedType === 'avatar'" class="image-options">
        <h3>Select an Avatar Image</h3>
        <div class="images">
          <img
            v-for="(image, index) in avatarImages"
            :key="index"
            :src="image"
            @click="changeAvatar(image)"
            class="image-option"
          />
        </div>
      </div>
    </div>

    <!-- Modal for changing password -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Change Password</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label for="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              v-model="newPassword"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              v-model="confirmPassword"
              class="form-control"
              required
            />
          </div>
          <button class="btn styled-button" type="submit">Change Password</button>
          <button class="btn styled-button close" type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>

    <div class="button-container">
      <button class="btn styled-button" @click="showModal = true">Change Password</button>
      <button class="btn styled-button" @click="logoutDev">Logout</button>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { isAuthenticated } from '@/auth'

// Import default images
import bg1 from '/assets/profile/profilebackgrounds/background1.webp'
import bg2 from '/assets/profile/profilebackgrounds/background2.webp'
import bg3 from '/assets/profile/profilebackgrounds/background3.webp'
import bg4 from '/assets/profile/profilebackgrounds/background4.webp'
import bg5 from '/assets/profile/profilebackgrounds/background5.jpg'
import avatar1 from '/assets/profile/profilepics/pfp1.jpeg'
import avatar2 from '/assets/profile/profilepics/pfp2.jpeg'
import avatar3 from '/assets/profile/profilepics/pfp3.jpeg'
import avatar4 from '/assets/profile/profilepics/pfp4.jpeg'
import avatar5 from '/assets/profile/profilepics/pfp5.jpg'
import avatar6 from '/assets/profile/profilepics/pfp6.jpg'
import placeholderBg from '/assets/profile/background.png'
import placeholderAvatar from '/assets/profile/profile-icon.png'

export default {
  name: 'Profile',
  data() {
    return {
      user: {},
      newPassword: '',
      confirmPassword: '',
      isAuthenticatedUser: false,
      showImageSelector: false,
      bgImage: placeholderBg,
      avatarImage: placeholderAvatar,
      selectedType: '',
      backgroundImages: [bg1, bg2, bg3, bg4, bg5],
      avatarImages: [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6],
      isLoading: true,
      showModal: false
    }
  },
  created() {
    if (isAuthenticated()) {
      this.isAuthenticatedUser = true
      this.getUserInfo()
    } else {
      this.isAuthenticatedUser = false
      this.$router.push('/login')
    }
  },
  methods: {
    getUserInfo() {
      const username = localStorage.getItem('username')
      this.isLoading = true
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${username}`)
        .then((response) => {
          this.user = response.data
          this.bgImage = response.data.bgImage || this.placeholderBg
          this.avatarImage = response.data.avatarImage || this.placeholderAvatar
        })
        .catch((error) => {
          console.error('Error fetching user info:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    logoutDev() {
      localStorage.setItem('isLoggedIn', '')
      localStorage.setItem('username', '')
      this.$router.push('/login')
    },
    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      axios
        .put(`https://habit-buddy-server.vercel.app/api/users/${this.user.username}/password`, {
          password: this.newPassword
        })
        .then((response) => {
          alert('Password updated successfully')
          this.newPassword = ''
          this.confirmPassword = ''
          this.closeModal()
        })
        .catch((error) => {
          console.error('Error updating password:', error)
          alert('Error updating password')
        })
    },
    showImageOptions(type) {
      this.selectedType = type
      this.showImageSelector = true
    },
    changeBackground(image) {
      this.bgImage = image
      this.user.bgImage = image // Update user object
      this.updateUserImages() // Save to backend
      this.showImageSelector = false
    },
    changeAvatar(image) {
      this.avatarImage = image
      this.user.avatarImage = image // Update user object
      this.updateUserImages() // Save to backend
      this.$emit('update-avatar', image)
      this.showImageSelector = false
    },
    updateUserImages() {
      const username = this.user.username
      axios
        .put(`https://habit-buddy-server.vercel.app/api/users/${username}/images`, {
          bgImage: this.user.bgImage,
          avatarImage: this.user.avatarImage
        })
        .then((response) => {
          console.log('Images updated successfully:', response.data)
        })
        .catch((error) => {
          console.error('Error updating images:', error)
          alert('Error updating images')
        })
    },
    closeModal() {
      this.showModal = false // Close the modal
    }
  }
}
</script>

<style scoped>
html,
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}
.profile-container {
  background-color: #fff3e7;
  margin: 0px;
  min-height: 100vh;
}

.jumbotron,
.container-fluid,
.row,
.col-12 {
  padding: 0;
  margin: 0;
  width: 100vw;
}

.profile h1 {
  margin: 0;
}

.profile {
  font-family: 'Jersey 25', sans-serif;
  display: flex;
  justify-content: center; /* Horizontally center the text */
  align-items: center; /* Vertically center the text */
  height: 100px;
  font-size: 2rem;
}

.bg-img {
  width: 100vw;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: -40px; /* Negative margin to pull it up */
  display: block; /* Center align the avatar */
  margin-left: auto; /* Center horizontally */
  margin-right: auto; /* Center horizontally */
}

.form-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}

.image-selector {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eec0c2;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
}

.btn,
h3,
.form-group {
  font-family: 'Jersey 25', sans-serif;
}

.image-options {
  display: flex;
  flex-direction: column;
}

.images {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
  overflow-x: auto;
  max-width: 600px;
}

.image-option {
  max-height: 150px;
  margin: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-option:hover {
  transform: scale(1.1);
}

.change-bg-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1; /* Ensure the button appears above the background */
  padding: 10px 15px;
}

.change-bg-button:hover {
  background-color: #c49393;
}

.change-avatar-button {
  margin-top: 10px;
  padding: 10px 15px;
}

.change-bg-button,
.change-avatar-button,
.styled-button {
  background-color: #eec0c2;
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin-top: 10px;
}

.change-bg-button:hover,
.change-avatar-button:hover,
.styled-button:hover {
  background-color: #c49393;
}

.button-container {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center horizontally */
  margin-top: 20px; /* Add some space above */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: #fff3e7;
  font-family: 'Jersey 25', sans-serif;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  margin-left: 10px;
}

@media (max-width: 768px) {
  .avatar {
    width: 70px;
    height: 70px;
  }

  .bg-img {
    min-width: 100vw;
  }

  .name h1 {
    font-size: 6vw;
  }

  .username {
    font-size: 5vw;
  }

  .form-container {
    max-width: 90%;
  }

  .image-option {
    width: 100px;
  }

  .image-selector {
    width: 90%;
  }

  .change-bg-button,
  .change-avatar-button {
    padding: 5px 10px;
    font-size: 0.8rem;
    margin-top: 5px;
  }
}
</style>
