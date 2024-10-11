<template>
  <div id="app">
    <!-- Conditionally render the Navbar only if the route is not '/login' -->
    <NavBar v-if="!isLoginPage" />
    <!-- Render the current view -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    isLoginPage() {
      return (
        this.$route.path === '/login' ||
        this.$route.path === '/register' ||
        this.$route.path === '/'
      )
    }
  }
}
</script>

<style scoped>
/* Make sure html and body take up full height */
html,
body {
  height: 100%;
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

/* Ensure the app takes the full height of the viewport */
#app {
  display: flex;
  flex-direction: column; /* Stack navbar and content */
  min-height: 100vh; /* Full viewport height */
  width: 100%; /* Full width */
}

/* Content should take the remaining space after navbar */
.content {
  flex-grow: 1; /* Make content fill the rest of the height */
  padding: 20px; /* Optional padding */
  background-color: #f5f5f5; /* Add a background color to distinguish content */
}

/* Optional: Make sure content is responsive */
@media (max-width: 768px) {
  .content {
    padding: 10px;
  }
}
</style>
