<template>
  <nav class="navbar navbar-custom navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">
        <img
          src="../assets/cat-icon.png"
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
            <a class="nav-link active" aria-current="page" href="#">Tasks</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/dashboard">Dashboard</a>
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
            <a class="nav-link active" aria-current="page" href="/">Help</a>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="/profile" title="Profile">
              <img src="../assets/profile-icon.png" alt="Profile Icon" class="profile-icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
/* Style the navbar for larger screens */
.navbar {
  background-image: url('@/assets/nav_background.jpeg');
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

.cat-icon {
  height: 40px;
  width: auto;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: black;
}

/* Adjustments for smaller screens */
@media (max-width: 991px) {
  .navbar {
    padding: 10px;
    height: auto; /* Let the navbar height adjust automatically */
  }

  .nav-link {
    font-size: 1rem; /* Reduce font size */
    padding: 5px 0;
  }

  .nav-item {
    padding: 5px;
    text-align: left;
  }

  .cat-icon {
    height: 35px; /* Slightly reduce the size of the cat icon */
  }

  .profile-icon {
    width: 35px;
    height: 35px;
  }

  /* Make sure the navbar expands properly */
  .navbar-collapse {
    position: relative; /* Match navbar background */
  }

  .navbar-toggler {
    border-color: rgba(0, 0, 0, 0.1); /* Style the toggle button */
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28150, 150, 150, 0.7%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e"); /* Custom icon */
  }

  .collapse .nav-item {
    text-align: left; /* Align items to the left in collapsed mode */
  }
}
</style>
