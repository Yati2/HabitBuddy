<template>
  <div class="landing-page">
    <div class="jumbotron p-5 mb-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-6 text-center">
            <h1>HabitBuddy</h1>
            <p class="desc">Take care of yourself while taking care of your pet</p>
            <router-link to="/login" class="btn">Login</router-link>
            <router-link to="/register" class="btn">Register</router-link>
          </div>
          <div class="col-12 col-md-6">
            <img src="/assets/landingPage/landingpage.gif" alt="Landing Page Img" class="big-img" />
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <h2>Our services</h2>
      <div id="servicesCarousel" class="carousel slide" data-bs-ride="carousel">
        <!-- Carousel indicators -->
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#servicesCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#servicesCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#servicesCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#servicesCarousel"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
          <button
            type="button"
            data-bs-target="#servicesCarousel"
            data-bs-slide-to="4"
            aria-label="Slide 5"
          ></button>
        </div>

        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="feature-container">
              <div class="feature task text-center">
                <h3>Task</h3>
                <p>
                  Set your goals, whether short-term or long-term. With the habit tracker, you can
                  easily add and remove habits, giving you the flexibility to focus on what's most
                  important right now.
                </p>
              </div>
            </div>
          </div>

          <div class="carousel-item">
            <div class="feature-container">
              <div class="feature dashboard text-center">
                <h3>Dashboard</h3>
                <p>
                  Stay motivated by tracking your progress. The streak dashboard shows you how long
                  you’ve maintained your habits, pushing you to keep your streak alive.
                </p>
              </div>
            </div>
          </div>

          <div class="carousel-item">
            <div class="feature-container">
              <div class="feature journal text-center">
                <h3>Journal</h3>
                <p>
                  Reflect on your day with the built-in journaling feature. The calendar lets you
                  track your thoughts and growth over time, helping you stay mindful and on top of
                  your personal development.
                </p>
              </div>
            </div>
          </div>

          <div class="carousel-item">
            <div class="feature-container">
              <div class="feature pet text-center">
                <h3>Pet</h3>
                <p>
                  Make self-improvement fun! Earn points for keeping up with your habits and
                  exchange them for fun accessories to customise your pet avatar. Build habits while
                  you play.
                </p>
              </div>
            </div>
          </div>

          <div class="carousel-item">
            <div class="feature-container">
              <div class="feature forum text-center">
                <h3>Forum</h3>
                <p>
                  Find support and inspiration in the forum. Share advice or get tips on forming
                  habits like studying better or working out. Join a community of people on the same
                  journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        <a
          class="carousel-control-prev"
          href="#servicesCarousel"
          role="button"
          data-bs-slide="prev"
        >
          <div class="carousel-control-content">
            <img
              src="/assets/landingPage/left.png"
              alt="Previous"
              class="carousel-control-prev-icon"
            />
            <p class="control-label">Previous</p>
          </div>
        </a>
        <a
          class="carousel-control-next"
          href="#servicesCarousel"
          role="button"
          data-bs-slide="next"
        >
          <div class="carousel-control-content">
            <img
              src="/assets/landingPage/right.png"
              alt="Next"
              class="carousel-control-next-icon"
            />
            <p class="control-label">Next</p>
            <!-- Text below the image -->
          </div>
        </a>
      </div>
    </div>

    <div class="sticky">
      <img src="/assets/landingPage/miniFigure.gif" alt="Mini Figure" class="miniImg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingPage'
}
</script>

<style scoped>
.landing-page,
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
  margin-top: 30px;
}
p {
  font-size: 1.25rem;
  color: black;
  font-family: 'Pixelify Sans';
  margin: 15px 10px;
}
/* jumbotron elements */
.desc {
  font-size: 1.5rem;
  color: black;
  font-family: 'Pixelify Sans';
}
.big-img {
  margin-left: 80px;
  margin-top: 50px;
  width: 400px;
}
.btn {
  margin: 20px 10px;
  padding: 10px 20px;
  background-color: #fff3e7;
  color: black;
  text-decoration: none;
  border-radius: 7px;
  font-family: 'Pixelify Sans';
  font-size: 1.5rem;
}
.btn:hover {
  background-color: #f8dbbf;
}
/* features */
.feature-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-image: url('/assets/landingPage/featureBG.gif');
  background-size: cover;
  background-position: center;
  height: 400px;
  padding: 20px;
  width: 60%;
  margin: auto;
  margin-top: 40px;
}
.feature {
  background-color: rgba(238, 192, 194, 0.7);
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  flex: 1;
  max-width: 100%;
}
/* carousel */
.sr-only,
.control-label {
  color: black;
}
.carousel-control-prev {
  left: 80px;
  top: 80px;
}
.carousel-control-next {
  right: 80px;
  top: 80px;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
  width: 50px;
  height: auto;
}
/* mini gif */
.sticky {
  position: sticky;
  bottom: 0;
  left: 0;
}
.miniImg {
  width: 200px;
}

/* responsiveness */
@media (max-width: 992px) {
  h1 {
    font-size: 2.8rem;
  }
  h2 {
    font-size: 2.3rem;
  }
  h3 {
    font-size: 1.65rem;
  }
  p {
    font-size: 0.95rem;
  }
  .big-img {
    margin-left: 0;
    width: 390px;
  }
  .feature-container {
    width: 65%;
  }
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 40px;
    height: auto;
  }
  .carousel-control-prev {
    left: 0px;
  }
  .carousel-control-next {
    right: 0px;
  }
  .miniImg {
    width: 180px;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  p {
    font-size: 0.9rem;
  }
  .big-img {
    width: 360px;
  }
  .feature-container {
    width: 65%;
  }
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 40px;
    height: auto;
  }
  .carousel-control-prev {
    left: 0px;
  }
  .carousel-control-next {
    right: 0px;
  }
  .miniImg {
    width: 150px;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 2.2rem;
  }
  h2 {
    font-size: 1.8rem;
  }
  h3 {
    font-size: 1.4rem;
  }
  p {
    font-size: 0.85rem;
  }
  .big-img {
    margin-left: 20px;
    width: 250px;
  }
  .feature-container {
    width: 68%;
  }
  .miniImg {
    width: 100px;
  }
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 30px;
    height: auto;
  }
  .carousel-control-prev {
    left: 0px;
  }
  .carousel-control-next {
    right: 0px;
  }
}
</style>
