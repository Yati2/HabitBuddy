<!-- src/views/LandingPage.vue -->
<template>
  <div class="landing-page">
    <div class="jumbotron p-5 mb-4">
      <!-- None  <576px, sm  ≥576px, md  ≥768px, lg  ≥992px, xl  ≥1200px, xxl  ≥1400px -->
      <div class="container-fluid">
        <div class="row">
          <div class="col-6 text-center">
            <h1>HabitBuddy</h1>
            <p class="desc">Take care of yourself while taking care of your pet</p>
            <router-link to="/Login" class="btn">Login</router-link>
            <router-link to="/Register" class="btn">Register</router-link>
          </div>
          <!-- col -->
          <div class="col-6">
            <img
              src="../assets/landingPage/landingpage.gif"
              alt="Landing Page Img"
              class="big-img"
            />
          </div>
          <!-- col -->
        </div>
        <!-- row -->
      </div>
      <!-- container -->
    </div>

    <div class="content">
      <h2>Our services</h2>
      <!-- None  <576px, sm  ≥576px, md  ≥768px, lg  ≥992px, xl  ≥1200px, xxl  ≥1400px -->
      <div class="container-fluid">
        <div class="row">
          <div class="feature task col-3 text-center mx-auto">
            <h3>Task</h3>
            <p>
              Set your goals, whether short-term or long-term. With the habit tracker, you can
              easily add and remove habits, giving you the flexibility to focus on what's most
              important right now.
            </p>
          </div>
          <!-- col -->
          <div class="feature dashboard col-3 text-center mx-auto">
            <h3>Dashboard</h3>
            <p>
              Stay motivated by tracking your progress. The streak dashboard shows you how long
              you’ve maintained your habits, pushing you to keep your streak alive.
            </p>
          </div>
          <!-- col -->
          <div class="feature journal col-3 text-center mx-auto">
            <h3>Journal</h3>
            <p>
              Reflect on your day with the built-in journaling feature. The calendar lets you track
              your thoughts and growth over time, helping you stay mindful and on top of your
              personal development.
            </p>
          </div>
          <!-- col -->
        </div>
        <!-- row -->
        <div class="row">
          <div class="feature pet col-3 text-center mx-auto">
            <h3>Pet</h3>
            <p>
              Make self-improvement fun! Earn points for keeping up with your habits and exchange
              them for fun accessories to customise your pet avatar. Build habits while you play.
            </p>
          </div>
          <!-- col -->
          <div class="feature forum col-3 text-center mx-auto">
            <h3>Forum</h3>
            <p>
              Find support and inspiration in the forum. Share advice or get tips on forming habits
              like studying better or working out. Join a community of people on the same journey.
            </p>
          </div>
          <!-- col -->
        </div>
        <!-- row -->
      </div>
      <!-- container -->
    </div>

    <div class="sticky">
        <img
              src="../assets/landingPage/miniFigure.gif"
              alt="Mini Figure"
              class="miniImg"
            />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
html,
body {
  background-color: #fff3e7;
  height: 100%;
  width: 100%;
  margin: 0;
}
.jumbotron {
  background-color: #eec0c2;
}
h1 {
  font-size: 4rem;
  color: black;
  font-family: 'Pixelify Sans';
  margin-top: 30px;
}
h2 {
  font-size: 3rem;
  color: black;
  font-family: 'Pixelify Sans';
  margin-top: 50px;
  text-align: center;
}
h3 {
  font-size: 2rem;
  color: black;
  font-family: 'Pixelify Sans';
  /* font-family: 'Jersey 25', sans-serif; */
  margin-top: 30px;
}
p {
  font-size: 1.25rem;
  color: black;
  /* font-family: 'Jersey 25', sans-serif; */
  font-family: 'Pixelify Sans';
  margin: 15px 10px;
}
.desc {
  font-size: 1.5rem;
  color: black;
  font-family: 'Pixelify Sans';
}
.big-img {
  margin-left: 80px;
}
.btn {
  margin: 20px 10px;
  padding: 10px 20px;
  background-color: #fff3e7;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  font-family: 'Pixelify Sans';
}
.feature {
  /* border: 5px solid #eec0c2; */
  background-color: #eec0c2;
  border-radius: 10px;
  margin-top: 40px;
}
.sticky{
    position:sticky;
    bottom:0;
    left:0;
}
.miniImg {
    width: 200px;
}
</style>
