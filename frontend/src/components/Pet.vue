<template v-if="isAuthenticatedUser" class="container-fluid">
  <div class="row">
    <div id="game-container" ref="gameContainer" class="col-lg-10 col-12 position-relative">
      <img
        src="../assets/pet_related/bg/christmas.gif"
        alt="Pet Background"
        id="game-bg"
        class="position-absolute"
      />
    </div>

    <div id="pet-info" class="col-lg-2 col-12">
      <!-- Pet Name -->
      <div class="pet-info-content d-flex justify-content-between align-items-center">
        <h5 id="pet-name" class="text-center flex-grow-1">Name: {{ petName }}</h5>
        <i class="bi bi-pencil-square font-sm" @click="showModal = true"></i>
      </div>

      <!-- Pet Happiness -->
      <div class="pet-info-content">
        <div class="d-flex justify-content-between align-items-center">
          <h5 id="pet-happiness" class="text-center flex-grow-1">Happiness: {{ petHappiness }}%</h5>
          <i
            class="bi bi-question-circle font-sm"
            @click="showHappinessHelpMsg = true"
            style="cursor: pointer; font-size: 1.2rem"
            title="Click for help"
          ></i>
        </div>

        <div
          class="progress progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          id="pet-happiness-bar"
          :class="progressBarClass"
          :aria-valuenow="petHappiness"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: petHappiness + '%' }"
        ></div>
      </div>

      <div class="mt-3 pet-info-content">
        <h5 class="text-center">Feed Your Pet</h5>
        <div id="fishCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              v-for="(fish, index) in allFishItems"
              :key="fish.itemname"
              :class="['carousel-item', { active: index === 0 }]"
            >
              <div class="d-flex flex-column align-items-center">
                <img :src="fish.imgpath" class="img-fluid" style="width: 70px" alt="Fish Icon" />
                <h5 class="pt-2">{{ fish.itemname }}</h5>
                <small>Owned: {{ fish.itemqty || 0 }}</small>
                <small>Happiness boost: {{ getHappinessBoost(fish) }}</small>
                <button
                  class="petbtn mt-3"
                  :disabled="!fish.owned || fish.itemqty === 0 || isCatFull"
                  @click="feedPet(fish)"
                >
                  Feed
                </button>
                <p
                  v-if="!fish.owned && !isCatFull"
                  class="text-danger pt-2"
                  style="font-size: 0.8rem"
                >
                  Buy from Shopkeeper
                  <router-link to="/tasks" class="text-decoration-underline text-danger"
                    >here</router-link
                  >!
                </p>
                <p v-if="isCatFull" class="text-danger pt-2" style="font-size: 0.8rem">
                  Your cat refuses to eat more!
                </p>
              </div>
            </div>
          </div>
          <!-- Carousel controls -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#fishCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#fishCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div class="mt-3 pet-info-content">
        <h5 class="text-center">Choose Background</h5>
        <div id="backgroundCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              v-for="(bg, index) in allBackgrounds"
              :key="bg.name"
              :class="['carousel-item', { active: index === 0 }]"
            >
              <div class="d-flex flex-column align-items-center">
                <img
                  :src="bg.imgpath"
                  class="img-fluid"
                  style="width: 100px"
                  alt="Background Icon"
                />
                <h5 class="pt-2">{{ bg.name }}</h5>
                <button class="petbtn mt-3" :disabled="!bg.owned" @click="applyBackground(bg)">
                  Apply
                </button>
                <p v-if="!bg.owned" class="text-danger pt-2" style="font-size: 0.8rem">
                  Purchase from Shopkeeper
                  <router-link to="/tasks" class="text-decoration-underline text-danger"
                    >here</router-link
                  >!
                </p>
              </div>
            </div>
          </div>
          <!-- Carousel controls -->
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#backgroundCarousel"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#backgroundCarousel"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
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
            <button type="button" class="petbtn" @click="showModal = false">Close</button>
            <button type="button" class="petbtn" @click="savePetName">Save changes</button>
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
      :style="{ width: tooltipWidth }"
      @click="showHappinessHelpMsg = false"
    >
      Feed your cat to increase the happiness level! Your cat will refuses to eat more when it's
      full!
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
import jumpingright from '../assets/pet_related/yellow_cat/jumpingright.png'
import jumpingleft from '../assets/pet_related/yellow_cat/jumpingleft.png'
import idle from '../assets/pet_related/yellow_cat/idle.png'
import angryright from '../assets/pet_related/yellow_cat/angryright.png'
import angryleft from '../assets/pet_related/yellow_cat/angryleft.png'
import catup1 from '../assets/pet_related/yellow_cat/up1.png'
import catup2 from '../assets/pet_related/yellow_cat/up2.png'
import catup3 from '../assets/pet_related/yellow_cat/up3.png'
import catdown1 from '../assets/pet_related/yellow_cat/down1.png'
import catdown2 from '../assets/pet_related/yellow_cat/down2.png'
import catdown3 from '../assets/pet_related/yellow_cat/down3.png'
import reg_1 from '../assets/pet_related/fish/reg_1.png'
import reg_2 from '../assets/pet_related/fish/reg_2.png'
import reg_3 from '../assets/pet_related/fish/reg_3.png'
import rare_1 from '../assets/pet_related/fish/rare_1.png'
import rare_2 from '../assets/pet_related/fish/rare_2.png'
import rare_3 from '../assets/pet_related/fish/rare_3.png'
import ulti_1 from '../assets/pet_related/fish/ulti_1.png'
import ulti_2 from '../assets/pet_related/fish/ulti_2.png'
import ulti_3 from '../assets/pet_related/fish/ulti_3.png'
import { Tooltip } from 'bootstrap/dist/js/bootstrap.bundle.min'
import Beach from '../assets/pet_related/bg/beach.gif'
import Christmas from '../assets/pet_related/bg/christmas.gif'
import Park from '../assets/pet_related/bg/park.gif'
import Cozyroom from '../assets/pet_related/bg/cozyroom.gif'

export default {
  data() {
    return {
      petName: '',
      username: '',
      petHappiness: '',
      showHappinessHelpMsg: false,
      showModal: false,
      newPetName: '',
      isEating: false,
      tooltipWidth: 'auto',
      allFishItems: [
        { itemname: 'Regular Fish', imgpath: reg_1, owned: false },
        { itemname: 'Rare Fish', imgpath: rare_1, owned: false },
        { itemname: 'Ultra Fish', imgpath: ulti_1, owned: false }
      ],

      // Define all background items
      allBackgrounds: [
        { name: 'Cozyroom', imgpath: Cozyroom, owned: true },
        { name: 'Beach ', imgpath: Beach, owned: false },
        { name: 'Christmas', imgpath: Christmas, owned: false },
        { name: 'Park ', imgpath: Park, owned: false }

        // Add other backgrounds as needed
      ]
    }
  },
  mounted() {
    this.getCurrentUsername()
    this.fetchPetName()
    this.setTooltipWidth()
    this.fetchUserInventory()

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
    setInterval(this.decreaseHappiness, 1 * 60 * 60 * 1000)
  },

  computed: {
    progressBarClass() {
      if (this.petHappiness > 50) {
        return 'bg-success'
      } else if (this.petHappiness <= 50 && this.petHappiness > 15) {
        return 'bg-warning'
      } else {
        return 'bg-danger'
      }
    },
    isCatFull() {
      return this.petHappiness === 100
    }
  },
  methods: {
    getCurrentUsername() {
      this.username = localStorage.getItem('username')
      console.log(this.username)
    },
    setTooltipWidth() {
      const gameContainer = this.$refs.gameContainer
      if (gameContainer) {
        this.tooltipWidth = `${gameContainer.clientWidth}px` // Set tooltip width to match #game-container
      }
    },
    applyBackground(background) {
      if (background.owned) {
        const gameBg = document.getElementById('game-bg')
        if (gameBg) {
          gameBg.src = background.imgpath
        }

        this.saveBackgroundToUser(background.name)
      } else {
        console.warn('Background not owned and cannot be applied.')
      }
    },
    getHappinessBoost(fish) {
      if (fish.itemname.includes('Regular')) {
        return 10
      } else if (fish.itemname.includes('Rare')) {
        return 15
      } else if (fish.itemname.includes('Ultimate')) {
        return 20
      } else {
        return 0
      }
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
    async fetchUserInventory() {
      const { username } = this
      try {
        const response = await axios.get(`http://localhost:8000/api/userinventory/${username}`)
        const inventory = response.data

        // Update `allFishItems` based on user-owned items
        this.allFishItems.forEach((fish) => {
          const userFish = inventory.find((item) => item.itemname === fish.itemname)
          if (userFish) {
            fish.owned = true
            fish.itemqty = userFish.itemqty
          } else {
            fish.itemqty = 0
          }
        })

        // Update `allBackgrounds` based on user-owned backgrounds
        this.allBackgrounds.forEach((bg) => {
          const userBg = inventory.find((item) => item.itemname === bg.name)
          if (userBg) {
            bg.owned = true
          }
        })
      } catch (error) {
        console.error('Error fetching inventory:', error)
      }
    },
    async feedPet(fish) {
      if (this.isEating || this.petHappiness >= 100 || fish.itemqty <= 0) return

      // Decrease the quantity of the selected fish
      try {
        console.log('decreasing item quantity')
        // Update the quantity in the database
        await axios.put(`http://localhost:8000/api/inventory/decrease`, {
          username: this.username,
          itemname: fish.itemname,
          decreaseBy: 1
        })

        fish.itemqty -= 1
        let fishType = ''
        if (fish.itemname.includes('Regular')) {
          fishType = 'reg'
        } else if (fish.itemname.includes('Rare')) {
          fishType = 'rare'
        } else if (fish.itemname.includes('Ultra')) {
          fishType = 'ulti'
        }
        const gameScene = this.phaserGame.scene.keys['scene-game']
        if (gameScene) {
          gameScene.startFishEatingAnimation(fishType, () => {
            this.petHappiness = Math.min(this.petHappiness + 10, 100)
            this.updateHappinessOnServer()
          })
        }
      } catch (error) {
        console.error('Error decreasing item quantity:', error)
      }
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
    this.load.spritesheet('jumpingright', jumpingright, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('jumpingleft', jumpingleft, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('idle', idle, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('angryright', angryright, {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('angryleft', angryleft, {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.image('catUp1', catup1)
    this.load.image('catUp2', catup2)
    this.load.image('catUp3', catup3)
    this.load.image('catDown1', catdown1)
    this.load.image('catDown2', catdown2)
    this.load.image('catDown3', catdown3)
    this.load.image('reg_1', reg_1)
    this.load.image('reg_2', reg_2)
    this.load.image('reg_3', reg_3)
    this.load.image('rare_1', rare_1)
    this.load.image('rare_2', rare_2)
    this.load.image('rare_3', rare_3)
    this.load.image('ulti_1', ulti_1)
    this.load.image('ulti_2', ulti_2)
    this.load.image('ulti_3', ulti_3)
  }

  create() {
    // Start the cat's initial position relative to the canvas size
    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 50, 'catWalkingRight')
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
    this.anims.create({
      key: 'goDown',
      frames: [{ key: 'catDown1' }, { key: 'catDown2' }, { key: 'catDown3' }],
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
    this.floorUp = this.scale.height * 0.8

    // Handle window resize events
    this.scale.on('resize', this.resizeHandler, this)
    this.eatenFish = this.add.sprite(300, 500, 'reg_1').setVisible(false).setScale(0.5)
    this.cat.on('pointerover', () => {
      this.triggerStretch()
    })
  }
  startFishEatingAnimation(fishType, onComplete) {
    // Set the fish images based on the type
    const fishImages = {
      reg: ['reg_1', 'reg_2', 'reg_3'],
      rare: ['rare_1', 'rare_2', 'rare_3'],
      ulti: ['ulti_1', 'ulti_2', 'ulti_3']
    }

    let fishY = this.cat.y
    let fishX

    if (this.currentAction === 'walkRight' && this.cat.x < this.sofapositionRight) {
      fishX = this.cat.x + 50
      fishY = this.cat.y - 50
    } else if (this.currentAction === 'walkLeft') {
      fishX = this.cat.x - 50
      fishY = this.cat.y - 50
    }

    this.eatenFish.setPosition(fishX, fishY).setVisible(true)

    // Apply consistent scaling for all fish types
    console.log('fish type:', fishType)
    // Check if the fish type is valid
    if (!fishImages[fishType]) {
      console.error(`Invalid fish type '${fishType}'`)
      return
    }
    var scale = fishType === 'reg' || fishType === 'ulti' ? 0.5 : 0.25
    this.eatenFish.setScale(scale).setTexture(fishImages[fishType][0]).setVisible(true)

    // Animate through the fish images
    this.time.delayedCall(1000, () => {
      this.eatenFish.setTexture(fishImages[fishType][1])
    })

    this.time.delayedCall(2000, () => {
      this.eatenFish.setTexture(fishImages[fishType][2])
    })

    // Hide the fish after the animation and call the completion callback
    this.time.delayedCall(3000, () => {
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
    if (this.currentAction !== 'goUp') {
      if (width >= lgBreakpoint) {
        newScale = 2.5 // Large screens
      } else {
        newScale = 2 // Medium screens
      }
    } else {
      if (width >= lgBreakpoint) {
        newScale = 1.5 // Large screens
      } else {
        newScale = 1 // Medium screens
      }
    }
    console.log('previous cat scale:', this.cat.scale)
    this.cat.setScale(newScale)
    console.log('new cat scale:', newScale)

    this.sofapositionRight = width * 0.8
    this.sofapositionLeft = width * 0.2
    this.floorUp = height * 0.8

    if (this.currentAction === 'walkRight') {
      this.cat.y = height - 50
    } else if (this.currentAction === 'walkLeft') {
      this.cat.y = this.floorUp
    } else if (this.currentAction === 'lick' && this.preActionForResize === 'walkRight') {
      this.cat.y = height - 50
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
      this.cat.y = height - 50
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
  startGoingDown() {
    this.cat.anims.stop()
    this.cat.setTexture('catDown1').setScale(2).disableInteractive()
    this.cat.play('goDown')
    this.currentAction = 'goDown'
    this.isGoingDown = true

    this.time.delayedCall(50, () => {
      this.isGoingDown = false
    })
  }

  startWalkingRight() {
    this.cat.play('walkRight').setScale(2.5).setInteractive()
    this.currentAction = 'walkRight'
    this.isWalkingRight = true
  }

  resumeAction(previousAction) {
    this.currentAction = previousAction
    if (previousAction === 'walkRight') {
      this.cat.play('walkRight')
    } else if (previousAction === 'walkLeft') {
      this.cat.play('walkLeft')
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

    if (this.currentAction === 'walkRight') {
      this.cat.x += 2
      if (this.cat.x >= this.sofapositionRight) {
        this.startGoingUp()
      }
    }

    // Move the cat up
    if (this.currentAction === 'goUp') {
      this.cat.y -= 2
      if (this.cat.y <= this.floorUp) {
        this.startWalkingLeft()
      }
    }

    // Move the cat left
    if (this.currentAction === 'walkLeft') {
      this.cat.x -= 2
      if (this.cat.x <= this.sofapositionLeft) {
        this.startGoingDown()
      }
    }

    // Move the cat down
    if (this.currentAction === 'goDown') {
      console.log('going down')
      this.cat.y += 2
      if (this.cat.y >= this.cameras.main.height - 50) {
        this.startWalkingRight() // Restart the loop
      }
    }
  }

  startGoingUp() {
    this.cat.anims.stop()
    this.isLicking = false
    this.isGoingUp = true

    this.cat.setTexture('catUp1').setScale(1.5).disableInteractive()
    this.cat.play('goUp').setScale(1.5)
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
  startLicking() {
    this.cat.anims.stop()
    this.cat.play('lick').disableInteractive()
    this.isLicking = true
    this.currentAction = 'lick'

    this.time.delayedCall(3000, () => {
      this.isLicking = false
      // Check the previous action to decide the next step
      if (this.preActionForResize === 'walkRight') {
        this.isWalkingRight = false
        this.startGoingUp() // Next action is going up
      } else if (this.preActionForResize === 'walkLeft') {
        this.isWalkingLeft = false
        this.startGoingDown() // Next action is going down
      }
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
          this.startLicking()
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
  border-right: 4px solid rgba(209, 208, 208, 0.552);
  border-left: 2px solid rgba(209, 208, 208, 0.552);
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
  margin-top: 10px;
  margin-right: 10px;
  max-height: 70vh;
  padding: 10px;
  width: 90%;
  align-items: center;
  border-radius: 10px;
  overflow-y: auto;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px;
}
.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #fecfa5;
}
.carousel-control-prev,
.carousel-control-next {
  width: 2%;
}

.petbtn {
  color: black;
  background-color: #fecfa5;
  font-family: 'Jersey 25', sans-serif;
  border-radius: 0 0 10px 10px;
}

.petbtn:disabled {
  background-color: #d3d3d3;
  border-color: #d3d3d3;
}
.petbtn:hover {
  background-color: #e4805b;
  color: white;
}

.text-danger {
  color: #ff4500; /* Bright red for alert text */
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
