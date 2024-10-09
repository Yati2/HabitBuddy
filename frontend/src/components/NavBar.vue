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
.navbar {
  font-family: 'Jersey 25', sans-serif;

  display: flex;
  align-items: center;
  justify-content: center; /* This ensures horizontal centering */
  background-color: #eec0c2;
  padding: 10px 20px;
  height: 80px;
  width: 100%;
}

.nav-item {
  padding: 10px;
}

.nav-link {
  list-style-type: none;
  padding: auto;
  margin: auto;
  display: flex;
  font-size: 1.2rem;
  font-weight: normal;
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
</style>
