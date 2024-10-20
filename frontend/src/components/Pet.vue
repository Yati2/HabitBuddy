<template v-if="isAuthenticatedUser" class="container-fluid">
  <div class="row">
    <div id="game-container" ref="gameContainer" class="col-lg-10 col-12 position-relative">
      <img
        src="../assets/pet_related/bg/cozyroom.gif"
        alt="Pet Background"
        id="game-bg"
        class="position-absolute"
      />
    </div>

    <div id="pet-info" class="col-lg-2 col-12">
      <!-- Pet Name -->
      <div class="pet-info-content pet-info-name d-flex justify-content-between align-items-center">
        <h5 id="pet-name" class="text-center flex-grow-1">Name: {{ petName }}</h5>
        <i class="bi bi-pencil-square font-sm ms-1 mb-2" @click="showModal = true"></i>
      </div>

      <!-- Pet Happiness -->
      <div class="pet-info-happiness pet-info-content">
        <div class="d-flex justify-content-between align-items-center pb-2">
          <h5 id="pet-happiness" class="text-center mb-0">Happiness: {{ petHappiness }}%</h5>
          <i
            class="bi bi-question-circle ms-2 font-sm"
            @click="showHappinessHelpMsg = true"
            style="cursor: pointer; font-size: 1.2rem"
            title="Click for help"
          ></i>
        </div>
        <div class="progress">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            id="pet-happiness-bar"
            :class="progressBarClass"
            :aria-valuenow="petHappiness"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{ width: petHappiness + '%' }"
          ></div>
        </div>
      </div>

      <div
        class="pet-info-feed pet-info-content mt-3 d-flex flex-column justify-content-start align-items-center"
      >
        <!-- First Row: Fish Image -->
        <div class="d-flex align-items-center mb-2">
          <img
            src="../assets/pet_related/fish/nemo.png"
            class="img-fluid"
            style="width: 70px"
            alt="Fish Icon"
            @click="feedPet"
          />
        </div>

        <!-- Second Row: Feed Text and Help Icon -->
        <div class="d-flex justify-content-center align-items-center w-100">
          <h5 class="ms-2 text-center feed-text" @click="feedPet" style="cursor: pointer">Feed</h5>
          <i
            class="bi bi-question-circle ms-2 font-sm"
            @click="showFeedHelpMsg = true"
            style="cursor: pointer; font-size: 1.2rem"
            title="Click for help"
          ></i>
        </div>
      </div>
    </div>

    <!-- Modal for editing pet name -->
    <div
      v-if="showModal"
      class="modal fade show"
      tabindex="-1"
      role="dialog"
      style="display: block"
    >
      <div class="modal-dialog-centered custom-modal" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h5 class="modal-title">What do you want to name your pet?</h5>
            <button type="button" class="close" @click="showModal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input v-model="newPetName" class="form-control" placeholder="Enter new pet name" />
          </div>
          <div class="modal-footer d-flex justify-content-between align-items-center">
            <button type="button" class="btn btn-secondary" @click="showModal = false">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="savePetName">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal background overlay -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>

    <!-- Tooltip / Help Message for Happiness -->
    <div
      v-if="showHappinessHelpMsg"
      ref="tooltip"
      class="custom-tooltip"
      @click="showHappinessHelpMsg = false"
    >
      Every time you feed your pet, happiness level will increase by 10.
    </div>

    <!-- Tooltip / Help Message for Feeding -->
    <div
      v-if="showFeedHelpMsg"
      ref="tooltip"
      class="custom-tooltip"
      @click="showFeedHelpMsg = false"
    >
      Click on "Feed" to feed the cat and increase its happiness by 10!
    </div>
  </div>
</template>

<script>
import Phaser from 'phaser'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'
import walkingright from '../assets/pet_related/yellow_cat/walkingright.png'
import walkingleft from '../assets/pet_related/yellow_cat/walkingleft.png'
import licking from '../assets/pet_related/yellow_cat/licking.png'
import stretchingright from '../assets/pet_related/yellow_cat/stretchingright.png'
import stretchingleft from '../assets/pet_related/yellow_cat/stretchingleft.png'
import catup1 from '../assets/pet_related/yellow_cat/up1.png'
import catup2 from '../assets/pet_related/yellow_cat/up2.png'
import catup3 from '../assets/pet_related/yellow_cat/up3.png'
import fish from '../assets/pet_related/fish/nemo.png'
import eatenfish_1 from '../assets/pet_related/fish/eatenfish_1.png'
import eatenfish_2 from '../assets/pet_related/fish/eatenfish_2.png'
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min'

export default {
  data() {
    return {
      petName: '',
      username: '',
      petHappiness: '',
      showHappinessHelpMsg: false,
      showFeedHelpMsg: false,
      showModal: false,
      newPetName: '',
      tooltipwidth: '',
      isEating: false
    }
  },
  mounted() {
    this.getCurrentUsername()
    this.fetchPetName()

    const config = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: 'game-container',
      transparent: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade', // Ensure the physics system is set to 'arcade' or another valid type
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene]
    }

    this.phaserGame = new Phaser.Game(config)

    //Decrease happiness every 8 hours (8 * 60 * 60 * 1000 milliseconds)
    setInterval(this.decreaseHappiness, 8 * 60 * 60 * 1000)
  },

  computed: {
    progressBarClass() {
      if (this.petHappiness > 50) {
        return 'bg-success' // Green for happiness above 50
      } else if (this.petHappiness <= 50 && this.petHappiness > 15) {
        return 'bg-warning' // Yellow for happiness 15-50
      } else {
        return 'bg-danger' // Red for happiness below 15
      }
    }
  },
  methods: {
    getCurrentUsername() {
      this.username = localStorage.getItem('username')
      console.log(this.username)
    },
    async fetchPetName() {
      try {
        const response = await axios.get(`http://localhost:8000/api/pet/${this.username}`)
        this.petName = response.data.petName
        this.newPetName = this.petName // Set the current name in the modal input
        this.petHappiness = response.data.happinessLevel
      } catch (error) {
        console.error('Error fetching pet name:', error)
      }
    },

    async savePetName() {
      try {
        const response = await axios.put(`http://localhost:8000/api/pet/${this.username}`, {
          petName: this.newPetName // Send the new name to the API
        })
        this.petName = response.data.petName // Update the displayed pet name
        this.showModal = false // Close the modal
      } catch (error) {
        console.error('Error updating pet name:', error)
      }
    },
    decreaseHappiness() {
      if (this.petHappiness > 0) {
        this.petHappiness -= 10
        if (this.petHappiness < 0) {
          this.petHappiness = 0
        }
        // Optionally, update the server with the new happiness level
        this.updateHappinessOnServer()
      }
    },
    async feedPet() {
      if (this.isEating || this.petHappiness >= 100) return

      // Check if the Phaser game scene exists
      const gameScene = this.phaserGame.scene.keys['scene-game']
      if (!gameScene) return

      this.isEating = true

      gameScene.startFishEatingAnimation(() => {
        // Once the animation completes, update happiness
        this.petHappiness = Math.min(this.petHappiness + 10, 100)
        this.updateHappinessOnServer()
        this.isEating = false
      })
    },

    async updateHappinessOnServer() {
      try {
        await axios.put(`http://localhost:8000/api/pet/${this.username}`, {
          happinessLevel: this.petHappiness
        })
      } catch (error) {
        console.error('Error updating happiness level:', error)
      }
    }
  }
}
class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
    this.preActionForResize = null
  }

  preload() {
    // Load assets here
    this.load.spritesheet('catWalkingRight', walkingright, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('catWalkingLeft', walkingleft, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('catLicking', licking, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('stretchRight', stretchingright, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('stretchLeft', stretchingleft, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.image('catUp1', catup1)
    this.load.image('catUp2', catup2)
    this.load.image('catUp3', catup3)
    this.load.image('fish', fish)
    this.load.image('eatenfish_1', eatenfish_1)
    this.load.image('eatenfish_2', eatenfish_2)
  }

  create() {
    // Start the cat's initial position relative to the canvas size
    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 100, 'catWalkingRight')
      .setScale(2.5)
      .setInteractive()
    console.log('current height' + this.cat.y)
    console.log('canvas height' + this.cameras.main.height)

    // Define animations
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('catWalkingRight', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('catWalkingLeft', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'lick',
      frames: this.anims.generateFrameNumbers('catLicking', { start: 0, end: 14 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'stretchRight',
      frames: this.anims.generateFrameNumbers('stretchRight', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: 0 // Play once
    })

    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: 0 // Play once
    })

    this.anims.create({
      key: 'goUp',
      frames: [{ key: 'catUp1' }, { key: 'catUp2' }, { key: 'catUp3' }],
      frameRate: 5,
      repeat: -1
    })

    // Start cat walking animation
    this.cat.play('walkRight')
    this.currentAction = 'walkRight'
    this.preActionForResize = 'walkRight'
    this.isWalkingRight = true

    // Track states
    this.isLicking = false
    this.isGoingUp = false
    this.isWalkingLeft = false
    this.isStretchingRight = false
    this.isStretchingLeft = false

    // Set sofa position dynamically based on canvas width
    this.sofapositionRight = this.scale.width * 0.8
    this.sofapositionLeft = this.scale.width * 0.2
    this.floorUp = this.scale.height * 0.7

    // Handle window resize events
    this.scale.on('resize', this.resizeHandler, this)
    this.eatenFish = this.add.sprite(300, 500, 'eatenfish_1').setVisible(false).setScale(0.5)
    this.cat.on('pointerover', () => {
      this.triggerStretch()
    })
  }
  startFishEatingAnimation(onComplete) {
    const fishY = this.cat.y
    if (this.currentAction === 'walkRight' && this.cat.x < this.sofapositionRight) {
      var fishX = this.cat.x + 100
    } else if (this.currentAction === 'walkLeft') {
      fishX = this.cat.x - 100
    } else if (this.currentAction === 'lick') {
      this.eatenFish.setScale(-1)
      fishX = this.cat.x - 50
    }

    // Set the fish's position and scale it
    this.eatenFish.setPosition(fishX, fishY).setScale(0.2).setVisible(true)

    // Show the first fish image
    this.eatenFish.setTexture('eatenfish_1').setVisible(true)

    // Show the second fish image after 1 second
    this.time.delayedCall(1000, () => {
      this.eatenFish.setTexture('eatenfish_2')
    })

    // Hide the fish after 2 seconds and call the completion callback
    this.time.delayedCall(2000, () => {
      this.eatenFish.setVisible(false)
      onComplete() // Call the callback to update happiness
    })
  }

  resizeHandler(gameSize) {
    const width = gameSize.width
    const height = gameSize.height

    this.cameras.resize(width, height)
    console.log('Resized to:', width, 'x', height)

    const lgBreakpoint = 1200

    let newScale

    if (width >= lgBreakpoint) {
      newScale = 2.5 // Large screens
    } else {
      newScale = 2 // Medium screens
    }
    console.log('previous cat scale:', this.cat.scale)
    this.cat.setScale(newScale)
    console.log('new cat scale:', newScale)

    this.sofapositionRight = width * 0.8
    this.sofapositionLeft = width * 0.2
    this.floorUp = height * 0.7

    if (this.currentAction === 'walkRight') {
      this.cat.y = height - 100
    } else if (this.currentAction === 'walkLeft') {
      this.cat.y = this.floorUp
    } else if (this.currentAction === 'lick' && this.preActionForResize === 'walkRight') {
      this.cat.y = height - 100
      this.cat.x = this.sofapositionRight
      console.log('adjusting second last condtion')
    } else if (this.currentAction === 'lick' && this.preActionForResize === 'walkLeft') {
      this.cat.y = this.floorUp
      this.cat.x = this.sofapositionLeft
      console.log('adjusting last condtion')
    }

    console.log(this.preActionForResize)
    console.log(this.cat.x, this.cat.y)

    if (this.cat.x > width) {
      this.cat.x = width - 100
    }
    if (this.cat.y > height) {
      this.cat.y = height - 100
    }
  }

  triggerStretch() {
    if (this.isStretchingRight && this.isStretchingLeft && this.isGoingUp && this.isLicking) return

    const previousAction = this.currentAction
    previousAction === 'walkRight'
      ? (this.isStretchingRight = true)
      : (this.isStretchingLeft = true)

    this.cat.anims.stop()
    this.currentAction = previousAction === 'walkRight' ? 'stretchRight' : 'stretchLeft'
    previousAction === 'walkRight'
      ? this.cat.play('stretchRight').setScale(2.5)
      : this.cat.play('stretchLeft').setScale(2.5)

    this.time.delayedCall(
      1000,
      () => {
        this.isStretchingRight = false
        this.isStretchingLeft = false
        this.resumeAction(previousAction)
      },
      [],
      this
    )
  }

  resumeAction(previousAction) {
    this.currentAction = previousAction
    if (previousAction === 'walkRight') {
      this.cat.play('walkRight')
    } else if (previousAction === 'walkLeft') {
      this.cat.play('walkLeft')
    } else if (previousAction === 'goUp') {
      this.cat.play('goUp')
    }
  }

  update() {
    if (
      this.isLicking ||
      this.isGoingUp ||
      this.isWalkingLeft ||
      this.isStretchingRight ||
      this.isStretchingLeft
    )
      return

    // Move the cat right
    this.cat.x += 2

    // Check if the cat reaches the sofa position relative to the canvas width
    if (this.cat.x >= this.sofapositionRight) {
      this.cat.anims.stop()
      this.isWalkingRight = false
      this.cat.play('lick').disableInteractive()
      this.isLicking = true
      this.currentAction = 'lick'

      this.time.delayedCall(3000, this.startGoingUp, [], this)
    }
  }

  startGoingUp() {
    this.cat.anims.stop()
    this.isLicking = false
    this.isGoingUp = true

    this.cat.setTexture('catUp1').setScale(1.5).disableInteractive()
    this.cat.play('goUp')
    this.currentAction = 'goUp'
    this.preActionForResize = 'goUp'

    this.upEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.y -= 5

        if (this.cat.y <= this.floorUp) {
          this.cat.anims.stop()
          this.upEvent.remove()
          this.startWalkingLeft()
        }
      },
      repeat: -1
    })
  }

  startWalkingLeft() {
    this.cat.play('walkLeft').setScale(2.5).setInteractive()
    console.log(this.cat.y)
    this.isGoingUp = false
    this.isWalkingLeft = true
    this.currentAction = 'walkLeft'
    this.preActionForResize = 'walkLeft'

    this.leftEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.x -= 5
        if (this.cat.x <= this.sofapositionLeft) {
          this.cat.anims.stop()
          this.cat.play('lick').disableInteractive()
          this.isWalkingLeft = false
          this.isLicking = true
          this.currentAction = 'lick'
          this.leftEvent.remove()
        }
      },
      repeat: -1
    })
  }
}
</script>

<style>
#game-container {
  height: 90vh;
  border: 5px solid rgba(160, 154, 154, 0.509);
  position: relative;
}
#game-bg {
  width: 100%;
  height: 100%;
  padding-right: 10px;
  object-fit: cover;
  z-index: 1;
}
canvas {
  position: relative;
  z-index: 2; /* Ensure the Phaser canvas is above the background */
}

#pet-info {
  background-color: #f5f5f5;
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  max-height: 90vh;
  overflow-y: auto;
}

.pet-info-content {
  background-color: #fef7f6;
  border: 2px solid #fecfa5;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Jersey 25', sans-serif;
  margin-top: 20px;
  max-height: 70vh;
  padding: 10px;
  width: 80%;
  align-items: center;
  border-radius: 10px;
  overflow-y: auto;
}

@media (max-width: 992px) {
  #game-container {
    height: 70vh;
  }
  #pet-info {
    max-height: 70vh;
    width: 100%;
  }
}

@media (max-width: 768px) {
  #game-container {
    height: 50vh;
  }
  #pet-info {
    max-height: 50vh;
    width: 100%;
  }
}
.custom-tooltip {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: #fecfa5;
  border: 2px solid #fef7f6;
  padding: 20px;
  font-family: 'Jersey 25', sans-serif;
  text-align: center;
  z-index: 1050;
  cursor: pointer;
  box-sizing: border-box; /* Ensure padding and border are included in the width */
}

@media (max-width: 768px) {
  .custom-tooltip {
    padding: 15px; /* Adjust padding for smaller screens */
  }
}

/* Adjust tooltip width and font size for smaller screens */
@media (max-width: 576px) {
  .custom-tooltip {
    width: 90%;
    font-size: 1rem; /* Smaller font for small screens */
  }
}

/* Modal styles */
.custom-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  width: 100%;
  max-width: 500px;
}

.modal-backdrop {
  z-index: 1040; /* Ensure the backdrop is behind the modal */
}

.modal-content {
  border-radius: 10px;
}

.modal-header {
  background-color: #fecfa5;
  font-family: 'Jersey 25', sans-serif;
  border-radius: 10px 10px 0 0;
}

.modal-body {
  background-color: #fef7f6;
  font-family: 'Jersey 25', sans-serif;
}

.modal-footer button {
  color: black;
  background-color: #fecfa5;
  font-family: 'Jersey 25', sans-serif;
  border-radius: 0 0 10px 10px;
}

/* Adjust modal size for smaller screens */
@media (max-width: 576px) {
  .custom-modal {
    max-width: 90%;
    padding: 10px;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
/* Glowing animation */
@keyframes glow {
  0% {
    text-shadow:
      0 0 5px #fceabb,
      0 0 10px #f8b500,
      0 0 15px #ffb84d;
  }
  50% {
    text-shadow:
      0 0 10px #ffd700,
      0 0 20px #f8b500,
      0 0 30px #ffb84d;
  }
  100% {
    text-shadow:
      0 0 5px #fceabb,
      0 0 10px #f8b500,
      0 0 15px #ffb84d;
  }
}

.feed-text:hover {
  animation: glow 1.5s infinite ease-in-out; /* Glowing animation */
}
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px); /* Move up */
  }
  60% {
    transform: translateY(-5px); /* Move down a bit */
  }
}

.feed-text {
  display: inline-block;
  cursor: pointer;
  animation: bounce 2s infinite; /* Infinite bounce animation */
}
</style>
