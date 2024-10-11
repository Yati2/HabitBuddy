<template>
  <div class="pet-game">
    <img src="../assets/pet_background.png" />
    <h1>My Virtual Pet</h1>
    <div class="pet-display" :style="{ top: petY + 'px', left: petX + 'px' }">
      <img :src="currentPetSprite" alt="Virtual Pet" />
    </div>
    <div class="actions">
      <button @click="moveCat">Move Cat</button>
    </div>
  </div>
</template>

<script>
import catStanding from '../assets/cat-standing.png'
import catSitting from '../assets/cat-sitting.png'
import catResting from '../assets/cat-sleeping.png'

export default {
  data() {
    return {
      petSprites: [catStanding, catSitting, catResting],
      currentPetSprite: catStanding,
      petX: 100, // Initial horizontal position
      petY: 100 // Initial vertical position
    }
  },
  methods: {
    moveCat() {
      // Generate random positions within the window bounds
      this.petX = Math.random() * (window.innerWidth - 150) // 150 is the width of the cat sprite
      this.petY = Math.random() * (window.innerHeight - 150) // 150 is the height of the cat sprite
    }
  },
  mounted() {
    // Move the cat automatically every 2 seconds
    setInterval(this.moveCat, 2000)
  }
}
</script>

<style scoped>
.pet-game {
  text-align: center;
  padding: 20px;
  position: relative; /* Set relative positioning for the container */
  height: 100vh; /* Full height */
  overflow: hidden; /* Prevent overflow */
}
.pet-display {
  position: absolute; /* Allow absolute positioning */
  transition:
    top 0.5s ease,
    left 0.5s ease; /* Smooth transition for movement */
}
.pet-display img {
  width: 150px; /* Adjust size according to your sprite */
  height: auto;
}
.actions button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
