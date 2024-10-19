<template>
  <div v-if="isAuthenticatedUser" id="game-container">
    <img
      id="background-gif"
      src="../assets/pet_related/bg/cozyroom.gif"
      alt="Cozy Room Background"
    />
  </div>
  <div v-else>
    <p>You need to be logged in to access this page. Redirecting...</p>
  </div>
</template>

<script>
import Phaser from 'phaser'
import { isAuthenticated } from '@/auth' // Import authentication functions
import walkingright from '../assets/pet_related/yellow_cat/walkingright.png'
import walkingleft from '../assets/pet_related/yellow_cat/walkingleft.png'
import licking from '../assets/pet_related/yellow_cat/licking.png'
import stretchingright from '../assets/pet_related/yellow_cat/stretchingright.png'
import stretchingleft from '../assets/pet_related/yellow_cat/stretchingleft.png'
import catup1 from '../assets/pet_related/yellow_cat/up1.png'
import catup2 from '../assets/pet_related/yellow_cat/up2.png'
import catup3 from '../assets/pet_related/yellow_cat/up3.png'

const sizes = {
  width: 900,
  height: 600
}

export default {
  data() {
    return {
      isAuthenticatedUser: false // Track authentication status
    }
  },
  created() {
    // Check if the user is authenticated
    if (isAuthenticated()) {
      this.isAuthenticatedUser = true
    } else {
      this.isAuthenticatedUser = false
      this.$router.push('/login')
    }
  },
  mounted() {
    this.isAuthenticatedUser = true
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: sizes.width,
      height: sizes.height,
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [GameScene]
    }

    new Phaser.Game(config)
  }
}

// Define your Phaser GameScene below
class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
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
  }

  create() {
    // Game creation logic
    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 100, 'catWalkingRight')
      .setScale(2.5)
      .setInteractive()

    // Define animations, etc.
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

    this.cat.play('walkRight')
    this.currentAction = 'walkRight'
    this.isWalkingRight = true

    // Track states
    this.isLicking = false
    this.isGoingUp = false
    this.isWalkingLeft = false
    this.isStretchingRight = false
    this.isStretchingLeft = false

    this.sofaPosition = 700

    // Trigger stretch on hover
    this.cat.on('pointerover', () => {
      this.triggerStretch()
    })
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

    this.cat.x += 2

    if (this.cat.x >= this.sofaPosition) {
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

    this.upEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.y -= 5
        if (this.cat.y == 350) {
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
    this.isGoingUp = false
    this.isWalkingLeft = true
    this.currentAction = 'walkLeft'

    this.leftEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.x -= 5
        if (this.cat.x == 100) {
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

<style scoped>
#game-container {
  position: relative;
  width: 900px;
  height: 600px;
  margin: 50px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  z-index: 1;
}

#background-gif {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}

canvas {
  z-index: 1;
}
</style>
