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
  flex-grow: 1; /* Make content fill the rest of the height */
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .content {
  }
}
</style>
