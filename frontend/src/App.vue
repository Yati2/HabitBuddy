<template>
  <div id="app">
    <!-- Conditionally render the Navbar only if the route is not '/login' -->
    <NavBar v-if="!isLoginPage" :avatar="avatar" />
    <!-- Render the current view -->
    <div class="content">
      <router-view @update-avatar="updateAvatar" />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      avatar: '' // Shared avatar state
    }
  },
  computed: {
    isLoginPage() {
      return (
        this.$route.path === '/login' ||
        this.$route.path === '/register' ||
        this.$route.path === '/'
      )
    }
  },
  methods: {
    updateAvatar(newAvatar) {
      console.log('Avatar updated to:', newAvatar)
      this.avatar = newAvatar
    },
    fetchAvatar() {
      const username = localStorage.getItem('username') // Get current username
      if (username) {
        axios
          .get(`http://localhost:8000/api/users/${username}`)
          .then((response) => {
            this.avatar = response.data.avatarImage // Set the avatar image from the response
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
          })
      }
    }
  },
  mounted() {
    this.fetchAvatar() // Fetch avatar when the component mounts
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.content {
  flex-grow: 1; /* Make content fill the rest of the height */
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .content {
  }
}
</style>
