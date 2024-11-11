<template>
  <main class="about-us">
    <section class="our-story">
      <h2>Our Story</h2>
      <p>
        Once upon a time (well, 10 weeks ago), a group of random strangers found themselves thrown
        together for a school project. None of us knew what to expect, and we were initially lost,
        trying to figure out which direction to take. Ideas flew around, but nothing quite felt
        right. That’s when Fayaz pitched a concept that sparked excitement—a perfect blend of
        creativity and challenge✨✨.
      </p>
      <p>
        With his idea as our compass, we set out on an adventure to bring it to life. Through
        late-night coding, countless cups of coffee, and a lot of project meetings, we shaped this
        web app into something we’re truly proud of🙏🏻.
      </p>
      <p>
        And here we are, 7 weeks later! Our journey doesn’t end here; we’re committed to making this
        project even better, evolving it into something truly special. We can’t wait to see where
        this path leads us next🐾🐾.
      </p>
    </section>
    <section class="meet-our-team">
      <h2>Meet Our Team</h2>
    </section>
    <div class="team-container">
      <div v-for="member in teamMembers" :key="member.id" class="team-member-card">
        <img :src="member.photo" :alt="member.name" class="member-photo" />
        <h2 style="color: #eec0c3">{{ member.name }}</h2>
        <p class="member-description">{{ member.description }}</p>

        <div class="stats">
          <h3>Stats</h3>
          <div v-for="stat in member.stats" :key="stat.name" class="stat-bar">
            <label>{{ stat.name }}</label>
            <div class="progress">
              <div class="progress-fill" :style="{ width: stat.value + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      teamMembers: [
        {
          id: 1,
          name: 'Dylan 🐻',
          photo: '/assets/team/dylan.jpg',
          description: 'Super strength and exceptionally poor swimmer',

          stats: [
            { name: 'Tiredness', value: 100 },
            { name: 'WAD2 Project Grade', value: 100 },
            { name: 'Bank Account Balance', value: 1 }
          ]
        },
        {
          id: 2,
          name: 'Fayaz 🐺',
          photo: '/assets/team/fay.jpg',
          description: 'I enjoy painting and making art for others!',

          stats: [
            { name: 'Fitness Level', value: 90 },
            { name: 'Artistic Ability', value: 99 },
            { name: 'Swag', value: 70 }
          ]
        },
        {
          id: 3,
          name: 'Jiahong 🐴',
          photo: '/assets/team/jh.jpg',
          description: 'I like chicken rice',

          stats: [
            { name: 'Time Management', value: 20 },
            { name: 'Coding Ability', value: 20 },
            { name: 'Want for Sem to end', value: 99 }
          ]
        },
        {
          id: 4,
          name: 'Jenis 🐰',
          photo: '/assets/team/jenis.jpg',
          description: 'Expert in last-minute brilliance and occasional overthinking',

          stats: [
            { name: 'stress level', value: 100 },
            { name: 'Sugar intake', value: 75 },
            { name: 'Mario party obsession', value: 90 }
          ]
        },
        {
          id: 5,
          name: 'Sue 🦦',
          photo: '/assets/team/sue.jpg',
          description: 'I yap but I always get the job done 🤪',

          stats: [
            { name: 'Fitness Level', value: 20 },
            { name: 'Coffee Consumption', value: 95 },
            { name: 'Tired Energy', value: 90 }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.meet-our-team {
  margin-top: 2rem;
  text-align: center;
  color: #eec0c3;
  font-family: 'Jersey 25', sans-serif;
  animation: fadeIn 1s ease-in-out;
}

.meet-our-team h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.our-story {
  font-family: 'Jersey 25', sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  animation: fadeIn 1s ease-in-out;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #333;
}

.our-story h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #eec0c3;
}

.our-story p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.about-us {
  text-align: center;
  height: 100vh;
  overflow-y: auto;
  background-image: url('https://i.pinimg.com/originals/8d/73/1f/8d731f8b2355a81edc3efcb1727645ed.gif');
  background-size: cover;
}

h1 {
  font-family: 'Pixelify Sans', sans-serif;
  font-size: 2rem;
  animation: fadeIn 1s ease-in-out;
}

.team-container {
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-family: 'Jersey 25', sans-serif;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.team-member-card {
  width: 400px;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 3px 5px 8px rgba(0, 0, 0, 0.2);
  background-color: white;
  text-align: center;
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease;
  animation: fadeIn 0.8s ease-in-out;
  opacity: 0;
  animation-fill-mode: forwards;
}

.team-member-card:hover {
  transform: scale(2);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
}

.member-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 4px 5px 8px rgba(0.1, 0.1, 0, 0.2);
}

.stats {
  font-family: 'Jersey 25', sans-serif;
  margin-top: 1rem;
  text-align: center;

  color: #333;
}

.stat-bar {
  margin-top: 1rem;
  position: relative;
}

.stat-bar label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  display: block;
  color: #444;
}

.progress {
  background-color: #333;
  border: 2px solid #111;
  border-radius: 8px;
  overflow: hidden;
  height: 15px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #eec0c2, #cf7e82);
  border-right: 2px solid #d08770;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 0.8rem;
  color: #fff;
  font-weight: bold;
}
@media (max-width: 835px) {
  .our-story {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>
