<template>
  <transition name="slide">
    <div v-if="showSidebar">
      <div class="sidebar-overlay" @click="toggleSidebar"></div>
      <div class="sidebar">
        <div class="sidebar-header">
          <a class="nav-link" href="/profile" title="Profile">
            <img
              :src="avatarLoaded ? avatar : placeholderAvatar"
              alt="Profile Icon"
              class="profile-icon"
            />
            <p class="username">{{ username }}</p>
          </a>
          <button class="close-btn" @click="toggleSidebar">&times;</button>
        </div>

        <div class="border-bottom-custom"></div>

        <div class="sidebar-content">
          <ul class="sidebar-nav">
            <li @click="navigate('/tasks')">Tasks</li>
            <li @click="navigate('/journal')">Journal</li>
            <li @click="navigate('/pet')">Pet</li>
            <li @click="navigate('/forum')">Forum</li>
            <li @click="navigate('/help')">Help</li>
            <li @click="navigate('/profile')">Profile</li>
          </ul>
        </div>
        <div class="border-bottom-custom"></div>
        <div class="sidebar-footer">
          <li class="sidebar-logout" @click="logout">Logout</li>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AppSidebar',
  props: {
    showSidebar: {
      type: Boolean,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  mounted() {
    console.log('Avatar:', this.avatar)
    this.username = localStorage.getItem('username') || 'User'
    if (this.avatar) {
      this.avatarLoaded = true
    }
  },
  data() {
    return {
      avatarLoaded: false,
      username: '',
      placeholderAvatar: '/assets/profile/profile-icon.png'
    }
  },
  watch: {
    avatar(newValue) {
      this.avatarLoaded = !!newValue
      console.log('Avatar loaded:', this.avatarLoaded)
    }
  },
  emits: ['closeSidebar'],
  setup(props, { emit }) {
    const router = useRouter()

    const toggleSidebar = () => {
      emit('closeSidebar')
    }

    const navigate = (path) => {
      router.push(path)
      toggleSidebar()
    }

    const logout = () => {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      router.push('/login')
      toggleSidebar()
    }

    return { toggleSidebar, navigate, logout }
  }
}
</script>

<style scoped>
.sidebar {
  font-family: 'Jersey 25', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background-image: url('https://i.pinimg.com/564x/c3/3c/28/c33c28c2fce3069931d041c0c9137ef6.jpg');
  background-size: cover;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 3000;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.sidebar-content {
  margin-top: 5px;
  margin-left: 2px;
  flex-grow: 1;
}

.sidebar-logout {
  font-size: 1.2rem;
  margin-left: 2px;
  cursor: pointer;
  transition: color 0.3s;
  list-style: none;
}

.sidebar-logout:hover {
  color: #be9294;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: 10px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}
.border-bottom-custom {
  border-bottom: 1px solid #333;
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}
.sidebar-footer {
  margin-top: 10px;
}

.close-btn {
  font-size: 40px;
  margin-bottom: 100px;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
}

.sidebar-nav li {
  margin: 15px 0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px;
}

.sidebar-nav li:hover {
  color: #eec0c2;
  transform: translateX(5px);
}

.username {
  font-size: 1.2rem;
  color: black;
  text-align: center;
  margin-top: 10px;
  margin-left: 2px;
}
</style>
