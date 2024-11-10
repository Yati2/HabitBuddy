<template>
  <div>
    <!-- Original Navbar for Web View -->
    <nav v-if="!isMobileView" class="navbar navbar-custom navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/tasks">
          <img
            src="/assets/habitbuddylogo.png"
            alt="Cat Icon"
            class="cat-icon d-inline-block align-text-top"
          />
        </a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/tasks">Tasks</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/journal">Journal</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/pet">Pet</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/forum">Forum</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/help">Help</a>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/profile" title="Profile">
                <img
                  :src="avatarLoaded ? avatar : placeholderAvatar"
                  alt="Profile Icon"
                  class="profile-icon"
                />
              </a>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-dark" @click="logoutDev">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Sidebar for Mobile View -->
    <div>
      <nav v-if="isMobileView" class="navbar navbar-custom">
        <div class="container-fluid">
          <a href="/tasks">
            <img
              src="/assets/habitbuddylogo.png"
              alt="Cat Icon"
              class="cat-icon logo d-inline-block align-text-top"
            />
          </a>
          <button class="btn-sidebar-toggle" @click="toggleSidebar" aria-label="Toggle sidebar">
            &#9776;
          </button>
        </div>
      </nav>
      <Sidebar
        :showSidebar="showSidebar"
        :avatar="avatar"
        @closeSidebar="toggleSidebar"
        v-if="isMobileView"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'

export default {
  name: 'NavBar',
  components: { Sidebar },
  props: {
    avatar: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      avatarLoaded: false,
      placeholderAvatar: '/assets/profile/profile-icon.png',
      showSidebar: false,
      isMobileView: window.innerWidth <= 991
    }
  },
  watch: {
    avatar(newValue) {
      this.avatarLoaded = !!newValue
      console.log('Avatar loaded:', this.avatarLoaded)
    }
  },
  updated() {
    this.isMobileView = window.innerWidth <= 991
    if (this.isMobileView) {
      this.handleResize()
    }
    console.log('changing to mobile view', this.isMobileView)
  },
  setup() {
    const router = useRouter()

    const logoutDev = () => {
      localStorage.setItem('isLoggedIn', '')
      localStorage.setItem('username', '')

      router.push('/login')
    }

    return {
      logoutDev
    }
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    },
    handleResize() {
      this.isMobileView = window.innerWidth <= 991
      console.log('changing to mobile view')

      if (!this.isMobileView) {
        this.showSidebar = false
      }
    }
  },
  mounted() {
    if (this.avatar) {
      this.avatarLoaded = true
    } else {
      this.avatarLoaded = false
    }
    window.addEventListener('resize', this.handleResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
}

.navbar-custom {
  background-color: #eec0c2;
}

.cat-icon {
  height: 60px;
  width: auto;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: black;
}

.navbar {
  background-image: url('https://i.pinimg.com/564x/a7/df/70/a7df70069a27956088556ad4833f8e03.jpg');
  background-size: cover;
  z-index: 1000;
  position: relative;
  font-size: 1.5rem;
  font-family: 'Jersey 25', sans-serif;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 80px;
  width: 100%;
}
.btn-sidebar-toggle {
  font-size: 1.5rem;
  border: none;
  background: transparent;
  color: #333;
  margin-right: 10px;
}

.nav-item {
  padding: 10px;
}

.nav-link {
  font-size: 1.2rem;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  width: 100%;
  text-align: center;
}

.btn {
  font-size: 1rem;
  margin-top: 9px;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .navbar {
    padding: 5px;
    height: auto;
  }
  .logo {
    width: 50px;
    height: auto;
  }
}
</style>
