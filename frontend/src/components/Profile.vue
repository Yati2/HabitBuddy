<template>
  <div v-if="isAuthenticatedUser" class="profile-container">
    <LoadingOverlay :isLoading="isLoading" />
    <div v-if="!isLoading">
      <div class="jumbotron">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12 text-center position-relative">
              <img :src="bgImage" alt="Background Img" class="bg-img" />
              <button
                @click="showImageOptions('bg')"
                class="btn btn-primary change-bg-button"
                style="border-radius: 10px"
              >
                Change Picture
              </button>
              <img :src="avatarImage" class="avatar mx-auto" />
              <div class="row">
                <div class="col-12 profile text-center">
                  <h1>{{ user.username }}'s Profile!</h1>
                </div>
              </div>
              <button
                @click="showImageOptions('avatar')"
                class="btn btn-primary change-avatar-button"
                style="border-radius: 10px"
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
            <button class="btn styled-button" type="submit" style="border-radius: 10px">
              Change Password
            </button>
            <button
              class="btn styled-button close"
              type="button"
              style="border-radius: 10px"
              @click="closeModal"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>

      <div class="button-container">
        <button class="btn styled-button" @click="showModal = true" style="border-radius: 10px">
          Change Password
        </button>
        <button class="btn styled-button" @click="logoutDev" style="border-radius: 10px">
          Logout
        </button>
      </div>

      <div class="dashboard-container">
        <div class="task-summary">
          <h3>Here is a summary of your tasks and progress.</h3>
          <div class="task-list">
            <div class="task-category">
              <h5>
                Completed
                <p>Habits</p>
              </h5>
              <div class="count-container">
                <img src="../assets/dashboard/star.png" alt="Star Icon" class="star-icon" />
                <p class="count">{{ habitCompletedCount }}</p>
              </div>
            </div>
            <div class="task-category">
              <h5>
                Completed
                <p>Long Term Tasks</p>
              </h5>
              <div class="count-container">
                <img src="../assets/dashboard/star.png" alt="Star Icon" class="star-icon" />
                <p class="count">{{ longTermCompletedCount }}</p>
              </div>
            </div>
            <div class="task-category">
              <h5>
                Completed
                <p>Daily To-dos</p>
              </h5>
              <div class="count-container">
                <img src="../assets/dashboard/star.png" alt="Star Icon" class="star-icon" />
                <p class="count">{{ todoCompletedCount }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Section -->
        <div class="inventory-section">
          <h3>Inventory</h3>
          <div v-for="(items, itemType) in groupedInventoryItems" :key="itemType">
            <h5>{{ itemType }}</h5>
            <div class="row">
              <div class="col-lg-3 col-md-6 col-xs-12" v-for="item in items" :key="item._id">
                <div class="inventory-item text-center">
                  <div v-if="item.itemname.toLowerCase().includes('fish')">
                    <img
                      :src="item.imgpath"
                      alt="Item Image"
                      class="item-image"
                      :style="{ width: '100px' }"
                    />
                  </div>
                  <div v-else>
                    <img :src="item.imgpath" alt="Item Image" class="item-image" />
                  </div>
                  <p>{{ item.itemname }}</p>
                  <span class="item-count" v-if="item.itemname.toLowerCase().includes('fish')">
                    Qty: {{ item.itemqty }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { isAuthenticated } from '@/auth'
import LoadingOverlay from './LoadingOverlay.vue'
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
  components: { LoadingOverlay },
  name: 'UserProfile',
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
      showModal: false,
      habitCompletedCount: 0,
      longTermCompletedCount: 0,
      todoCompletedCount: 0,
      inventoryItems: [],
      quote: '',
      author: ''
    }
  },
  mounted() {
    this.isLoading = true
    const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 1100))

    Promise.all([minimumLoadingTime, this.checkAuthentication()])
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.error('Error during loading:', error)
        this.isLoading = false
      })
  },
  computed: {
    groupedInventoryItems() {
      return this.inventoryItems.reduce((groups, item) => {
        const itemType = item.itemtype
        if (!groups[itemType]) {
          groups[itemType] = []
        }
        groups[itemType].push(item)
        return groups
      }, {})
    }
  },
  methods: {
    checkAuthentication() {
      this.isLoading = true
      try {
        if (isAuthenticated()) {
          this.isAuthenticatedUser = true
          this.username = localStorage.getItem('username')
          this.fetchHabitCompletedCount()
          this.fetchLongTermCompletedCount()
          this.fetchTodoCompletedCount()
          this.fetchInventoryItems()
          this.getUserInfo()
        } else {
          this.isAuthenticatedUser = false
          this.$router.push('/login')
        }
      } catch (e) {
        console.log(e)
      }
    },
    fetchHabitCompletedCount() {
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${this.username}/habitcompleted`)
        .then((response) => {
          this.habitCompletedCount = response.data.habitcompleted
        })
        .catch((error) => {
          console.error('Error fetching habit completed count:', error)
        })
    },
    fetchLongTermCompletedCount() {
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${this.username}/longtermcompleted`)
        .then((response) => {
          this.longTermCompletedCount = response.data.longtermcompleted
        })
        .catch((error) => {
          console.error('Error fetching long term completed count:', error)
        })
    },

    fetchTodoCompletedCount() {
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${this.username}/todocompleted`)
        .then((response) => {
          this.todoCompletedCount = response.data.todocompleted
        })
        .catch((error) => {
          console.error('Error fetching todo completed count:', error)
        })
    },
    fetchInventoryItems() {
      axios
        .get(`https://habit-buddy-server.vercel.app/api/userinventory/${this.username}`)
        .then((response) => {
          this.inventoryItems = response.data
        })
        .catch((error) => {
          console.error('Error fetching inventory items:', error)
        })
    },
    getUserInfo() {
      const username = localStorage.getItem('username')
      this.isLoading = true
      axios
        .get(`https://habit-buddy-server.vercel.app/api/users/${username}`)
        .then((response) => {
          this.user = response.data
          this.bgImage = response.data.bgImage
          this.avatarImage = response.data.avatarImage
        })
        .catch((error) => {
          console.error('Error fetching user info:', error)
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
      this.isLoading = true
      try {
        this.bgImage = image
        this.user.bgImage = image
        this.updateUserImages()
        this.showImageSelector = false
      } catch (error) {
        console.error('Error updating background:', error)
        alert('Error updating background')
      } finally {
        this.isLoading = false
      }
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
  justify-content: center;
  align-items: center;
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
  margin-top: -40px;
  display: block;
  margin-left: auto;
  margin-right: auto;
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
  z-index: 1;
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
  margin: 10px 10px;
}

.change-bg-button:hover,
.change-avatar-button:hover,
.styled-button:hover {
  background-color: #c49393;
}

.button-container {
  display: block;
  text-align: center;
  margin-top: 10px;
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

.dashboard-container {
  padding: 20px;
  background-color: #fff3e7;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

p {
  font-family: 'Jersey 25', sans-serif;
}

.task-summary,
.inventory-section {
  text-align: center;
  background: #eec0c2;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 50px;
}

.task-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.task-category {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.count-container {
  position: relative;
}

.star-icon {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: auto;
}

.count {
  background: #f8d1d3;
  padding: 20px;
  border-radius: 10%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 120px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  color: #333;
}

.task-category h5 {
  margin-bottom: 20px;
  color: #666;
  text-align: center;
}

h3 {
  text-align: center;
  font-family: 'Jersey 25', sans-serif;
  margin: 20px;
}

.item-image {
  width: 180px;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.item-image:hover {
  transform: translateY(-5px);
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.4));
}

h5,
span {
  font-family: 'Jersey 25', sans-serif;
  color: #666;
}

.quoteCat {
  width: 100px;
}

.quote {
  position: relative;
  text-align: center;
  margin: 20px;
}

.quote-bubble {
  display: inline-block;
  background: #eec0c2;
  padding: 10px 15px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.quote-bubble::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -10px;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #eec0c2 transparent transparent;
}

.row {
  justify-content: center;
}

.inventory-item {
  width: 100%;
  margin: 10px 0px;
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
  .change-avatar-button,
  .styled-button {
    padding: 5px 10px;
    font-size: 0.8rem;
    margin-top: 5px;
  }

  .inventory-item {
    width: 30%;
    margin: 10px 90px;
  }
}

@media (min-width: 576px) {
  .inventory-item {
    width: 48%;
  }
}

@media (max-width: 448px) {
  .quote-bubble::after {
    top: -10px;
    left: 50%;
    margin-left: -5px;
    margin-top: 0;
    border-color: transparent transparent #eec0c2 transparent;
  }
}
</style>
