<template>
  <main class="not-found-container">
    <div class="not-found-content">
      <img
        src="https://i.pinimg.com/564x/91/83/cb/9183cb908632a53bf619bbbcdfb68ae7.jpg"
        alt="404 Image"
        class="not-found-image"
      />
      <h1>Oops! Page Not Found</h1>
      <router-link to="/" class="home-button">Go Back Home</router-link>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #de9ea1;
  text-align: center;
  font-family: Arial, sans-serif;
}

.not-found-image {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

h1 {
  font-family: 'Jersey 25', sans-serif;
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-family: 'Jersey 25', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.home-button {
  font-family: 'Jersey 25', sans-serif;
  display: inline-block;
  padding: 10px 20px;
  color: white;
  text-decoration: underline;
  border-radius: 5px;
}
</style>
