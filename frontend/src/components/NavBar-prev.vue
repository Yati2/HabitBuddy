<template>
  <div>
    <nav class="navbar navbar-custom navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="/tasks">
          <img
            src="/assets/habitbuddylogo.png"
            alt="Cat Icon"
            class="cat-icon d-inline-block align-text-top"
          />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/tasks">Tasks</a>
            </li>
            <!-- <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
            </li> -->
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
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  props: {
    avatar: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      avatarLoaded: false,
      placeholderAvatar: '/assets/profile/profile-icon.png'
    }
  },
  watch: {
    avatar(newValue) {
      this.avatarLoaded = !!newValue
    }
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
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

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

  .nav-link {
    font-size: 1rem;
    padding: 5px 0;
  }

  .nav-item {
    padding: 5px;
  }

  .cat-icon {
    height: 60px;
  }

  .profile-icon {
    width: 35px;
    height: 35px;
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28150, 150, 150, 0.7%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
}
</style>
