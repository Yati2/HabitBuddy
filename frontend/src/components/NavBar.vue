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
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/team">About Us</a>
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.cat-icon,
.logo {
  height: 50px;
  width: auto;
  transition: transform 0.3s ease;
}
.cat-icon:hover,
.logo:hover {
  transform: scale(1.1);
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: black;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.profile-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.navbar {
  background-image: url('https://i.pinimg.com/564x/a7/df/70/a7df70069a27956088556ad4833f8e03.jpg');
  background-size: cover;
  z-index: 1000;
  font-size: 1.5rem;
  font-family: 'Jersey 25', sans-serif;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  height: 80px;
  width: 100%;
  transition: background-color 0.3s ease;
}
.navbar li {
  color: #eec0c2;
  transform: translateX(5px);
}

.nav-item {
  padding: 10px;
}

.nav-link {
  font-size: 1.2rem;
  font-weight: normal;
  text-align: center;

  text-decoration: none;
  transition:
    color 0.3s ease,
    background-color 0.3s ease;
}
.nav-link:hover {
  color: #eec0c2;

  border-radius: 5px;
  padding: 5px;
}

.btn-sidebar-toggle {
  font-size: 1.5rem;
  border: none;
  background: transparent;
  color: #333;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.btn {
  font-size: 1rem;
  margin-top: 9px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
.btn:hover {
  background-color: #eec0c2;
  color: black;
  border-color: transparent;
}

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
