<template>
  <div id="app">
    <!-- Conditionally render the Navbar only if the route is not '/login' -->
    <NavBar v-if="!isLoginPage" />
    <!-- Render the current view -->
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue' // Make sure to import the NavBar component

export default {
  name: 'App',
  components: {
    NavBar
  },
  computed: {
    // Check if the current route is the login page
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
