<template>
  <div class="container-fluid w-100 p-0 pet-container">
    <LoadingOverlay :isLoading="isLoading" />
    <div v-if="!isLoading" class="row">
      <div id="game-container" ref="gameContainer" class="col-lg-10 col-12 position-relative">
        <img id="game-bg" class="position-absolute" />
      </div>

      <div id="pet-info" class="col-lg-2 col-12">
        <div class="pet-info-content d-flex justify-content-between align-items-center">
          <h5 id="pet-name" class="text-center flex-grow-1">Name: {{ petName }}</h5>
        </div>

        <div class="pet-info-content">
          <div class="d-flex justify-content-between align-items-center">
            <h5 id="pet-happiness" class="text-center flex-grow-1">
              Happiness: {{ petHappiness }}%
            </h5>
            <i
              class="bi bi-question-circle font-sm"
              @click="showHappinessHelpMsg = true"
              style="cursor: pointer; font-size: 1.2rem"
              title="Click for help"
            ></i>
          </div>
          <div class="progress-bar-container">
            <div
              class="progress-bar-filled"
              :style="{ width: petHappiness + '%' }"
              :class="progressBarClass"
              role="progressbar"
              aria-valuenow="petHappiness"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <div class="mt-2 pet-info-content">
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

                  <p v-if="fish.itemqty === 0" class="text-danger pt-1" style="font-size: 0.8rem">
                    <router-link to="/tasks" class="text-decoration-underline text-danger">
                      Purchase from Shopkeeper here</router-link
                    >!
                  </p>

                  <p
                    v-if="isCatFull && fish.itemqty > 0"
                    class="text-danger pt-1"
                    style="font-size: 0.8rem"
                  >
                    Your cat refuses to eat more!
                  </p>
                </div>
              </div>
            </div>

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
        <div class="mt-2 pet-info-content">
          <h5 class="text-center">Customise Here</h5>
          <div id="backgroundCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <div
                v-for="(item, index) in this.allCustomItems"
                :key="item.itemname"
                :class="['carousel-item', { active: index === 0 }]"
              >
                <div class="d-flex flex-column align-items-center">
                  <img
                    :src="item.imgpath"
                    class="img-fluid"
                    style="width: 110px"
                    alt="Background Icon"
                  />
                  <h5 class="pt-2">{{ item.itemname }}</h5>
                  <button
                    class="petbtn mt-3"
                    :disabled="!item.owned"
                    @click="applyCustomization(item)"
                  >
                    Apply
                  </button>
                  <p v-if="!item.owned" class="text-danger pt-1" style="font-size: 0.8rem">
                    Purchase from Shopkeeper
                    <router-link to="/tasks" class="text-decoration-underline text-danger"
                      >here</router-link
                    >!
                  </p>
                </div>
              </div>
            </div>
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

      <div
        v-if="showHappinessHelpMsg"
        ref="tooltip"
        class="custom-tooltip"
        :style="{ width: tooltipWidth }"
        @click="showHappinessHelpMsg = false"
      >
        Feed your cat to increase the happiness level! Your cat will refuse to eat more when it's
        full!
      </div>
    </div>
    <div v-if="!isLoading && showHappinessModal" class="alert-box">
      <div class="modal-content">
        <h2 class="modal-title">Attention!</h2>
        <p class="modal-message">
          Your cat is not happy and walking lazily. Feed it now to improve its mood!
        </p>
        <button class="modal-button" @click="closeModal">Okay</button>
      </div>
    </div>
  </div>
</template>

<script>
import Phaser from 'phaser'
import axios from 'axios'
import { isAuthenticated } from '../auth'
import { useRouter } from 'vue-router'
import 'bootstrap-icons/font/bootstrap-icons.css'

import LoadingOverlay from './LoadingOverlay.vue'
import orange from '/assets/pet_related/orange/orange.gif'
import siamese from '/assets/pet_related/siamese/siamese.gif'
import pinkie from '/assets/pet_related/pinkie/pinkie.gif'
import charcoal from '/assets/pet_related/charcoal/charcoal.gif'

import o_walkingright from '/assets/pet_related/orange/walkingright.png'
import o_walkingleft from '/assets/pet_related/orange/walkingleft.png'
import o_licking from '/assets/pet_related/orange/licking.png'
import o_stretchingright from '/assets/pet_related/orange/stretchingright.png'
import o_stretchingleft from '/assets/pet_related/orange/stretchingleft.png'

import o_up1 from '/assets/pet_related/orange/up1.png'
import o_up2 from '/assets/pet_related/orange/up2.png'
import o_up3 from '/assets/pet_related/orange/up3.png'
import o_down1 from '/assets/pet_related/orange/down1.png'
import o_down2 from '/assets/pet_related/orange/down2.png'
import o_down3 from '/assets/pet_related/orange/down3.png'

import s_walkingright from '/assets/pet_related/siamese/walkingright.png'
import s_walkingleft from '/assets/pet_related/siamese/walkingleft.png'
import s_licking from '/assets/pet_related/siamese/licking.png'
import s_stretchingright from '/assets/pet_related/siamese/stretchingright.png'
import s_stretchingleft from '/assets/pet_related/siamese/stretchingleft.png'
import s_up1 from '/assets/pet_related/siamese/up1.png'
import s_up2 from '/assets/pet_related/siamese/up2.png'
import s_up3 from '/assets/pet_related/siamese/up3.png'
import s_down1 from '/assets/pet_related/siamese/down1.png'
import s_down2 from '/assets/pet_related/siamese/down2.png'
import s_down3 from '/assets/pet_related/siamese/down3.png'

import p_walkingright from '/assets/pet_related/pinkie/walkingright.png'
import p_walkingleft from '/assets/pet_related/pinkie/walkingleft.png'
import p_licking from '/assets/pet_related/pinkie/licking.png'
import p_stretchingright from '/assets/pet_related/pinkie/stretchingright.png'
import p_stretchingleft from '/assets/pet_related/pinkie/stretchingleft.png'
import p_up1 from '/assets/pet_related/pinkie/up1.png'
import p_up2 from '/assets/pet_related/pinkie/up2.png'
import p_up3 from '/assets/pet_related/pinkie/up3.png'
import p_down1 from '/assets/pet_related/pinkie/down1.png'
import p_down2 from '/assets/pet_related/pinkie/down2.png'
import p_down3 from '/assets/pet_related/pinkie/down3.png'

import c_walkingright from '/assets/pet_related/charcoal/walkingright.png'
import c_walkingleft from '/assets/pet_related/charcoal/walkingleft.png'
import c_licking from '/assets/pet_related/charcoal/licking.png'
import c_stretchingright from '/assets/pet_related/charcoal/stretchingright.png'
import c_stretchingleft from '/assets/pet_related/charcoal/stretchingleft.png'
import c_up1 from '/assets/pet_related/charcoal/up1.png'
import c_up2 from '/assets/pet_related/charcoal/up2.png'
import c_up3 from '/assets/pet_related/charcoal/up3.png'
import c_down1 from '/assets/pet_related/charcoal/down1.png'
import c_down2 from '/assets/pet_related/charcoal/down2.png'
import c_down3 from '/assets/pet_related/charcoal/down3.png'

import reg_1 from '/assets/pet_related/fish/reg_1.png'
import reg_2 from '/assets/pet_related/fish/reg_2.png'
import reg_3 from '/assets/pet_related/fish/reg_3.png'
import rare_1 from '/assets/pet_related/fish/rare_1.png'
import rare_2 from '/assets/pet_related/fish/rare_2.png'
import rare_3 from '/assets/pet_related/fish/rare_3.png'
import ulti_1 from '/assets/pet_related/fish/ulti_1.png'
import ulti_2 from '/assets/pet_related/fish/ulti_2.png'
import ulti_3 from '/assets/pet_related/fish/ulti_3.png'

import Beach from '/assets/pet_related/bg/beach.gif'
import Christmas from '/assets/pet_related/bg/christmas.gif'
import Park from '/assets/pet_related/bg/park.gif'
import Cozyroom from '/assets/pet_related/bg/cozyroom.gif'

export default {
  components: {
    LoadingOverlay
  },
  name: 'PetComponent',
  setup() {
    const router = useRouter()
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      console.log('Logged in user:', localStorage.getItem('username')) // Log the username
    }
  },
  data() {
    return {
      isLoading: true,
      petName: '',
      username: '',
      petHappiness: '',
      showHappinessHelpMsg: false,
      showHappinessModal: false,
      isEating: false,
      tooltipWidth: 'auto',

      allFishItems: [
        { itemname: 'Regular Fish', imgpath: reg_1, owned: false },
        { itemname: 'Rare Fish', imgpath: rare_1, owned: false },
        { itemname: 'Ultra Fish', imgpath: ulti_1, owned: false }
      ],

      allCustomItems: [
        { itemname: 'Cozyroom', imgpath: Cozyroom, owned: true, itemtype: 'Background' },
        { itemname: 'Beach', imgpath: Beach, owned: false, itemtype: 'Background' },
        { itemname: 'Christmas', imgpath: Christmas, owned: false, itemtype: 'Background' },
        { itemname: 'Park', imgpath: Park, owned: false, itemtype: 'Background' },
        { itemname: 'Orange', imgpath: orange, owned: true, itemtype: 'Cat' },
        { itemname: 'Siamese', imgpath: siamese, owned: false, itemtype: 'Cat' },
        { itemname: 'Pinkie', imgpath: pinkie, owned: false, itemtype: 'Cat' },
        { itemname: 'Charcoal', imgpath: charcoal, owned: false, itemtype: 'Cat' }
      ]
    }
  },
  async mounted() {
    this.isLoading = true
    console.log('loading.....', this.isLoading)
    try {
      this.getCurrentUsername()
      await this.fetchPet()
      setTimeout(() => this.setTooltipWidth(), 150)
      window.addEventListener('resize', this.setTooltipWidth)
      this.fetchUserInventory()

      if (this.petHappiness < 20) {
        this.showHappinessModal = true
        this.movementSpeed = 0.8
        console.log('petHappiness: for movement', this.movementSpeed)
      }

      const savedPet = localStorage.getItem('selectedPet') || 'orange'

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
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [new GameScene(savedPet, this.petHappiness)]
      }

      this.phaserGame = new Phaser.Game(config)

      setInterval(this.decreaseHappiness, 60 * 60 * 1000)
    } catch (error) {
      console.error('Error fetching pet data:', error)
    } finally {
      this.isLoading = false
      console.log('loaded')
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.setTooltipWidth)
  },

  computed: {
    movementSpeed() {
      console.log('petHappiness: in computed', this.petHappiness)
      return this.petHappiness < 20 ? 0.8 : 3
    },
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
  watch: {
    movementSpeed(newSpeed) {
      const gameScene = this.phaserGame.scene.keys['scene-game']
      if (gameScene) {
        console.log('newSpeed: in watch', newSpeed)
        gameScene.updateMovementSpeed(newSpeed)
      }
    }
  },
  methods: {
    closeModal() {
      this.showHappinessModal = false
    },
    getCurrentUsername() {
      this.username = localStorage.getItem('username')
      console.log(this.username)
    },
    setTooltipWidth() {
      console.log('setting tooltip width')
      const gameContainer = this.$refs.gameContainer

      if (gameContainer) {
        this.tooltipWidth = `${gameContainer.clientWidth}px`
        console.log('container width' + this.$refs.gameContainer)
        console.log('tooltip width' + this.tooltipWidth)
      } else {
        console.log('Container width is not defined' + this.$refs.gameContainer)
      }
    },

    updateGameWithNewPet(newPetType) {
      if (this.phaserGame) {
        this.phaserGame.destroy(true)
      }

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
          default: 'arcade',
          arcade: {
            gravity: { y: 0 },
            debug: false
          }
        },
        scene: [new GameScene(newPetType, this.petHappiness)]
      }

      this.phaserGame = new Phaser.Game(config)
    },

    applyCustomization(selectedItem) {
      console.log('Applying customization:', selectedItem)
      this.isLoading = true
      try {
        if (selectedItem.owned || selectedItem.applied) {
          if (selectedItem.itemtype === 'Background') {
            const gameBg = document.getElementById('game-bg')
            if (gameBg) {
              gameBg.src = selectedItem.imgpath
            }
            localStorage.setItem('selectedBackground', selectedItem.itemname)
            this.applyItemOnServer(selectedItem, 'Background')
            console.log('Applied background:', selectedItem)
          } else if (selectedItem.itemtype === 'Cat') {
            console.log('selectedItem:', selectedItem)

            console.log('petType:', this.petType)
            localStorage.setItem('selectedPet', selectedItem.itemname)
            this.updateGameWithNewPet(selectedItem.itemname)

            this.applyItemOnServer(selectedItem, 'Cat')
            console.log('Applied Cat:', selectedItem)
          }
        } else {
          console.warn('This item is either not owned or not applicable as a background or pet.')
        }
      } catch (error) {
        console.error('Error applying customization:', error)
      } finally {
        this.isLoading = false
      }
    },

    async applyItemOnServer(item, itemType) {
      try {
        const response = await axios.put(
          `https://habit-buddy-server.vercel.app/api/userinventory/apply`,
          {
            username: this.username,
            itemname: item.itemname,
            itemtype: itemType
          }
        )
        console.log('applied', response.data.message)
      } catch (error) {
        console.error('Error applying item on server:', error)
      }
    },

    getHappinessBoost(fish) {
      if (fish.itemname.includes('Regular')) {
        return 10
      } else if (fish.itemname.includes('Rare')) {
        return 15
      } else if (fish.itemname.includes('Ultra')) {
        return 20
      } else {
        return 0
      }
    },
    async fetchPet() {
      try {
        console.log('Fetching pet data')
        const response = await axios.get(
          `https://habit-buddy-server.vercel.app/api/pet/${this.username}`
        )
        this.petName = response.data.petName

        this.petHappiness = response.data.happinessLevel

        console.log(this.petName, this.petHappiness)
      } catch (error) {
        console.error('Error fetching pet name:', error)
      }
    },

    decreaseHappiness() {
      if (this.petHappiness > 0) {
        this.petHappiness -= 10
        if (this.petHappiness < 0) {
          this.petHappiness = 0
        }

        this.updateHappinessOnServer()
      }
    },
    async fetchUserInventory() {
      const { username } = this
      this.loading = true
      try {
        const response = await axios.get(
          `https://habit-buddy-server.vercel.app/api/userinventory/${username}`
        )
        const inventory = response.data

        let appliedBackground = inventory.find(
          (item) => item.itemtype === 'Background' && item.applied
        )

        let appliedPet = inventory.find((item) => item.itemtype === 'Cat' && item.applied)

        if (appliedBackground) {
          this.applyCustomization(appliedBackground)
        } else {
          const defaultBackground = this.allCustomItems.find((item) => item.itemname === 'Cozyroom')
          this.applyCustomization(defaultBackground)
        }

        if (appliedPet) {
          console.log('applying pet:', appliedPet)
          this.updateGameWithNewPet(appliedPet.itemname)
          localStorage.setItem('selectedPet', appliedPet.itemname)
        } else {
          this.updateGameWithNewPet('Orange')
          localStorage.setItem('selectedPet', 'Orange')
        }

        this.allFishItems.forEach((fish) => {
          const userFish = inventory.find((item) => item.itemname === fish.itemname)
          if (userFish) {
            fish.owned = true
            fish.itemqty = userFish.itemqty
          } else {
            fish.itemqty = 0
          }
        })

        this.allCustomItems.forEach((item) => {
          const userItem = inventory.find(
            (inventoryItem) => inventoryItem.itemname === item.itemname
          )
          if (userItem) {
            item.owned = true
          }
        })
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        this.isLoading = false
      }
    },

    async feedPet(fish) {
      if (this.isEating || this.petHappiness >= 100 || fish.itemqty <= 0) return

      try {
        await axios.put(`https://habit-buddy-server.vercel.app/api/inventory/decrease`, {
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
            this.petHappiness = Math.min(this.petHappiness + this.getHappinessBoost(fish), 100)
            this.updateHappinessOnServer()
            const newSpeed = this.movementSpeed
            gameScene.updateMovementSpeed(newSpeed)
          })
        }
      } catch (error) {
        console.error('Error decreasing item quantity:', error)
      }
    },
    async updateHappinessOnServer() {
      try {
        console.log('updating happiness level:', this.petHappiness)
        await axios.put(`https://habit-buddy-server.vercel.app/api/pet/${this.username}`, {
          happinessLevel: this.petHappiness
        })
      } catch (error) {
        console.error('Error updating happiness level:', error)
      }
    }
  }
}
class GameScene extends Phaser.Scene {
  constructor(petType, petHappiness) {
    super('scene-game')
    this.preActionForResize = null
    this.petType = petType
    this.petHappiness = petHappiness
    this.movementSpeed = this.petHappiness < 20 ? 0.8 : 3
  }

  updateMovementSpeed(newSpeed) {
    console.log('newSpeed in gamescene:', newSpeed)
    this.movementSpeed = newSpeed
  }

  preload() {
    this.isLoading = true
    try {
      this.loadAssetsForPet()
    } catch (error) {
      console.error('Error loading assets:', error)
    } finally {
      this.isLoading = false
    }
  }

  loadAssetsForPet() {
    if (this.petType === 'Orange') {
      console.log('loading orange pet assets')

      this.load.spritesheet('catWalkingRight', o_walkingright, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('catWalkingLeft', o_walkingleft, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('catLicking', o_licking, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('stretchRight', o_stretchingright, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('stretchLeft', o_stretchingleft, { frameWidth: 64, frameHeight: 64 })

      this.load.image('catUp1', o_up1)
      this.load.image('catUp2', o_up2)
      this.load.image('catUp3', o_up3)
      this.load.image('catDown1', o_down1)
      this.load.image('catDown2', o_down2)
      this.load.image('catDown3', o_down3)
    } else if (this.petType === 'Siamese') {
      console.log('loading siamese pet assets')

      this.load.spritesheet('catWalkingRight', s_walkingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catWalkingLeft', s_walkingleft, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catLicking', s_licking, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('stretchRight', s_stretchingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('stretchLeft', s_stretchingleft, { frameWidth: 64, frameHeight: 54 })

      this.load.image('catUp1', s_up1)
      this.load.image('catUp2', s_up2)
      this.load.image('catUp3', s_up3)
      this.load.image('catDown1', s_down1)
      this.load.image('catDown2', s_down2)
      this.load.image('catDown3', s_down3)
    } else if (this.petType === 'Pinkie') {
      console.log('loading siamese pet assets')

      this.load.spritesheet('catWalkingRight', p_walkingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catWalkingLeft', p_walkingleft, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catLicking', p_licking, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('stretchRight', p_stretchingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('stretchLeft', p_stretchingleft, { frameWidth: 64, frameHeight: 54 })

      this.load.image('catUp1', p_up1)
      this.load.image('catUp2', p_up2)
      this.load.image('catUp3', p_up3)
      this.load.image('catDown1', p_down1)
      this.load.image('catDown2', p_down2)
      this.load.image('catDown3', p_down3)
    } else if (this.petType === 'Charcoal') {
      console.log('loading Charcoal pet assets')

      this.load.spritesheet('catWalkingRight', c_walkingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catWalkingLeft', c_walkingleft, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('catLicking', c_licking, { frameWidth: 64, frameHeight: 64 })
      this.load.spritesheet('stretchRight', c_stretchingright, { frameWidth: 64, frameHeight: 54 })
      this.load.spritesheet('stretchLeft', c_stretchingleft, { frameWidth: 64, frameHeight: 54 })

      this.load.image('catUp1', c_up1)
      this.load.image('catUp2', c_up2)
      this.load.image('catUp3', c_up3)
      this.load.image('catDown1', c_down1)
      this.load.image('catDown2', c_down2)
      this.load.image('catDown3', c_down3)
      console.log('loaded Charcoal pet assets')
    }

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
    let initialTexture = this.petType === 'Orange' ? 'catWalkingRight' : 'catWalkingRight'

    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 50, initialTexture)
      .setScale(2.5)
      .setInteractive()

    if (this.petType === 'Orange') {
      this.defineOrangeCatAnimations()
    } else if (this.petType === 'Siamese') {
      this.defineSiameseCatAnimations()
    } else if (this.petType === 'Pinkie') {
      this.definePinkieCatAnimations()
    } else if (this.petType === 'Charcoal') {
      this.defineCharcoalCatAnimations()
    }
    this.anims.create({
      key: 'goUp',
      frames: [{ key: 'catUp1' }, { key: 'catUp2' }, { key: 'catUp3' }],
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'goDown',
      frames: [{ key: 'catDown1' }, { key: 'catDown2' }, { key: 'catDown3' }],
      frameRate: 10,
      repeat: -1
    })

    this.cat.play('walkRight')
    this.currentAction = 'walkRight'
    this.preActionForResize = 'walkRight'
    this.isWalkingRight = true

    this.sofapositionRight = this.scale.width * 0.8
    this.sofapositionLeft = this.scale.width * 0.2
    this.floorUp = this.scale.height * 0.8

    this.scale.on('resize', this.resizeHandler, this)
    this.eatenFish = this.add.sprite(300, 500, 'reg_1').setVisible(false).setScale(0.5)

    this.cat.on('pointerover', () => {
      this.triggerStretch()
    })
  }

  defineOrangeCatAnimations() {
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('catWalkingRight', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('catWalkingLeft', { start: 0, end: 5 }),
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
      repeat: 0
    })

    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: 0
    })
  }

  defineSiameseCatAnimations() {
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('catWalkingRight', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('catWalkingLeft', { start: 0, end: 5 }),
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
      repeat: 0
    })

    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 5 }),
      frameRate: 5,
      repeat: 0
    })
  }
  defineCharcoalCatAnimations() {
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
      frames: this.anims.generateFrameNumbers('stretchRight', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: 0
    })

    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: 0
    })
  }

  definePinkieCatAnimations() {
    // Define all animations for the pinkie cat
    this.anims.create({
      key: 'walkRight',
      frames: this.anims.generateFrameNumbers('catWalkingRight', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walkLeft',
      frames: this.anims.generateFrameNumbers('catWalkingLeft', { start: 0, end: 6 }),
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
      frames: this.anims.generateFrameNumbers('stretchRight', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: 0
    })

    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 4 }),
      frameRate: 5,
      repeat: 0
    })
  }

  startFishEatingAnimation(fishType, onComplete) {
    const fishImages = {
      reg: ['reg_1', 'reg_2', 'reg_3'],
      rare: ['rare_1', 'rare_2', 'rare_3'],
      ulti: ['ulti_1', 'ulti_2', 'ulti_3']
    }

    let fishY = this.cat.y
    let fishX

    if (this.currentAction === 'walkRight') {
      if (this.cat.x < this.sofapositionRight) {
        fishX = this.cat.x + 10
      } else {
        fishX = this.cat.x + 5
      }

      fishY = this.cat.y - 10
    } else if (this.currentAction === 'walkLeft') {
      if (this.cat.x > this.sofapositionLeft) {
        fishX = this.cat.x - 10
      } else {
        fishX = this.cat.x - 5
      }

      fishY = this.cat.y - 10
    }

    this.eatenFish.setPosition(fishX, fishY).setVisible(true)

    console.log('fish type:', fishType)

    if (!fishImages[fishType]) {
      console.error(`Invalid fish type '${fishType}'`)
      return
    }
    var scale = fishType === 'reg' || fishType === 'ulti' ? 0.5 : 0.25
    this.eatenFish.setScale(scale).setTexture(fishImages[fishType][0]).setVisible(true)

    this.time.delayedCall(100, () => {
      this.eatenFish.setTexture(fishImages[fishType][1])
    })

    this.time.delayedCall(1100, () => {
      this.eatenFish.setTexture(fishImages[fishType][2])
    })

    this.time.delayedCall(1400, () => {
      this.eatenFish.setVisible(false)
      onComplete()
    })
  }

  resizeHandler(gameSize) {
    const width = gameSize.width
    const height = gameSize.height

    this.cameras.resize(width, height)

    const lgBreakpoint = 1200

    let newScale
    if (this.currentAction !== 'goUp') {
      if (width >= lgBreakpoint) {
        newScale = 2.5
      } else {
        newScale = 2
      }
    } else {
      if (width >= lgBreakpoint) {
        newScale = 1.5
      } else {
        newScale = 1
      }
    }

    this.cat.setScale(newScale)

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
    } else if (this.currentAction === 'lick' && this.preActionForResize === 'walkLeft') {
      this.cat.y = this.floorUp
      this.cat.x = this.sofapositionLeft
    }

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
      this.cat.x += this.movementSpeed
      if (this.cat.x >= this.sofapositionRight) {
        this.startGoingUp()
      }
    }

    if (this.currentAction === 'goUp') {
      this.cat.y -= this.movementSpeed
      if (this.cat.y <= this.floorUp) {
        this.startWalkingLeft()
      }
    }

    if (this.currentAction === 'walkLeft') {
      this.cat.x -= this.movementSpeed
      if (this.cat.x <= this.sofapositionLeft) {
        this.startGoingDown()
      }
    }

    if (this.currentAction === 'goDown') {
      this.cat.y += this.movementSpeed
      if (this.cat.y >= this.cameras.main.height - 50) {
        this.startWalkingRight()
      }
    }
  }

  startGoingUp() {
    this.cat.anims.stop()
    this.isLicking = false
    this.isGoingUp = true
    console.log('going up')
    this.cat.setTexture('catUp1').setScale(1.5).disableInteractive()
    this.cat.play('goUp').setScale(1.5)
    this.currentAction = 'goUp'
    this.preActionForResize = 'goUp'

    this.upEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.y -= this.movementSpeed

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

      if (this.preActionForResize === 'walkRight') {
        this.isWalkingRight = false
        this.startGoingUp()
      } else if (this.preActionForResize === 'walkLeft') {
        this.isWalkingLeft = false
        this.startGoingDown()
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
        this.cat.x -= this.movementSpeed
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
  height: 91vh;
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
  z-index: 2;
}

#pet-info {
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  max-height: 90vh;
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
  height: fit-content;
  align-items: center;
  border-radius: 10px;
}

.carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  color: #ff4500;
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
  top: 30%;
  left: 0;

  background-color: #fecfa5;
  border: 2px solid #fef7f6;
  padding: 20px;
  font-family: 'Jersey 25', sans-serif;
  text-align: center;
  z-index: 1050;
  cursor: pointer;
  box-sizing: border-box;
  max-width: 80%;
  word-wrap: break-word;
}

@media (max-width: 768px) {
  .custom-tooltip {
    padding: 15px;
    font-size: 0.9rem;
    max-width: 90%;
  }
}

@media (max-width: 576px) {
  .custom-tooltip {
    padding: 10px;
    font-size: 0.8rem;
    width: 100%;
    left: 0;
    transform: none;
    text-align: center;
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
  animation: glow 1.5s infinite ease-in-out;
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
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #f3e0b5;
  border-radius: 10px;
  border: 2px solid #fecfa5;
  position: relative;
  overflow: hidden;
}

.progress-bar-filled {
  height: 100%;
  background-color: #ff9e80;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  background-size: 20px 20px;
  border-radius: 10px 0 0 10px;
  transition: width 0.5s ease;
}

.feed-text {
  display: inline-block;
  cursor: pointer;
  animation: bounce 2s infinite;
}

.alert-box {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fef7f6;
  border: 2px solid #000000;
  border-radius: 20px;
  max-width: fit-content;
  max-height: fit-content;
  width: 70%;
  padding: 5px;
  z-index: 1050;
  text-align: center;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .alert-box {
    max-width: 300px;
    padding: 10px;
  }
}

@media (min-width: 1024px) {
  .alert-box {
    max-width: 350px;
    width: fit-content;
    padding: 10px;
    top: 50%;
    left: 45%;
  }
}

@media (max-width: 480px) {
  .alert-box {
    top: 35%;
    width: 300px;
    height: fit-content;
    font-size: 0.5rem;
    padding: 5px;
  }
}

.modal-content {
  padding: 20px;
  width: 90%;
  max-width: 400px;
  border-radius: 20px;
  text-align: center;
  font-family: 'Jersey 25', sans-serif;
}

.modal-title {
  font-size: 1.5rem;
  color: #ffb84d;
  margin-bottom: 10px;
}

.modal-message {
  font-size: 1rem;
  margin-bottom: 20px;
}

.modal-button {
  background-color: #fecfa5;
  border: 2px solid #000000;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  color: black;
}

.modal-button:hover {
  background-color: #e4805b;
  color: white;
}
</style>
