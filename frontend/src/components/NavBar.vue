<template>
  <nav class="navbar">
    <div class="nav-left">
      <img src="@/assets/cat-icon.png" alt="Pet Icon" class="nav-icon" />
      <ul class="nav-links">
        <li><a href="#">Tasks</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/journal">Journal</a></li>
        <li><a href="/pet">Pet</a></li>
        <li><a href="/forum">Forum</a></li>
        <li><a href="#">Help</a></li>
      </ul>
    </div>
    <div class="nav-right">
      <img src="@/assets/profile-icon.png" alt="Profile Icon" class="profile-icon" />
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center; /* This ensures horizontal centering */
  background-color: #eec0c2;
  padding: 10px 20px;
  height: 80px;
  width: 100%;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-left {
  flex: 1;
}

.nav-right {
  flex: 1;
  justify-content: flex-end;
}

.nav-links {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  font-size: 1.2rem;
  justify-content: space-around;
  width: 100%;
  text-align: center;
}

.nav-links li {
  margin: 0 15px; /* Adjust the spacing between items */
}

.nav-links li a {
  text-decoration: none;
  font-weight: bold;
  color: black;
}

.nav-icon,
.profile-icon {
  width: 50px;
  height: 50px;
}

.profile-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: black;
}
</style>
