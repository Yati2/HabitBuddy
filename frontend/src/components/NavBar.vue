<template>

<nav class="navbar navbar-custom navbar-expand-lg">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
      <img src="../assets/cat-icon.png" alt="Cat Icon" style="height: 40px; width: auto;" class="d-inline-block align-text-top">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
            <img src="../assets/profile-icon.png" alt="Profile Icon" style="height: 40px; width: auto;">
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
