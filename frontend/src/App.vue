<template>
  <div id="app">
    <NavBar v-if="!isLoginPage" :avatar="avatar" />

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
      avatar: ''
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
      const username = localStorage.getItem('username')
      if (username) {
        axios
          .get(`https://habit-buddy-server.vercel.app/api/users/${username}`)
          .then((response) => {
            this.avatar = response.data.avatarImage
          })
          .catch((error) => {
            console.error('Error fetching user data:', error)
          })
      }
    }
  },
  mounted() {
    this.fetchAvatar()
  }
}
</script>

<style scoped>
html,
body {
  height: 100%;
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 0;
}
</style>
