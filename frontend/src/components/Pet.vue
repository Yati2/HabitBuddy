<template>
  <div id="game-container">
    <img
      id="background-gif"
      src="../assets/pet_related/bg/cozyroom.gif"
      alt="Cozy Room Background"
    />
  </div>
</template>

<script>
import Phaser from 'phaser'
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

class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game')
  }

  preload() {
    // Load all sprite sheets and images
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
    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 100, 'catWalkingRight')
      .setScale(2.5)
      .setInteractive()

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
      frames: this.anims.generateFrameNumbers('stretchRight', { start: 0, end: 6 }),
      frameRate: 5,
      repeat: 0 // Play once
    })
    this.anims.create({
      key: 'stretchLeft',
      frames: this.anims.generateFrameNumbers('stretchLeft', { start: 0, end: 6 }),
      frameRate: 5,
      repeat: 0 // Play once
    })

    this.anims.create({
      key: 'goUp',
      frames: [{ key: 'catUp1' }, { key: 'catUp2' }, { key: 'catUp3' }],
      frameRate: 5,
      repeat: -1
    })

    // Play the initial walking animation
    this.cat.play('walkRight')
    this.currentAction = 'walkRight'
    this.isWalkingRight = true

    // Track states
    this.isLicking = false
    this.isGoingUp = false
    this.isWalkingLeft = false
    this.isStretchingRight = false
    this.isStretchingLeft = false

    // Sofa position
    this.sofaPosition = 700

    // Interaction - trigger stretch when hovering over the cat
    this.cat.on('pointerover', () => {
      this.triggerStretch() // Trigger stretch when the user pets the cat
    })
  }

  triggerStretch() {
    if (this.isStretchingRight && this.isStretchingLeft && this.isGoingUp && this.isLicking) return // If the cat is already stretching, do nothing

    const previousAction = this.currentAction
    previousAction === 'walkRight'
      ? (this.isStretchingRight = true)
      : (this.isStretchingLeft = true)

    this.cat.anims.stop() // Stop the current animation
    this.currentAction = previousAction === 'walkRight' ? 'stretchRight' : 'stretchLeft'
    previousAction === 'walkRight'
      ? this.cat.play('stretchRight').setScale(2.5)
      : this.cat.play('stretchLeft').setScale(2.5)

    this.time.delayedCall(
      1000, // Time for the stretch animation
      () => {
        this.isStretchingRight = false
        this.isStretchingLeft = false // Reset the stretching flag
        this.resumeAction(previousAction) // Resume the previous action
      },
      [],
      this
    )
  }

  resumeAction(previousAction) {
    // Resume the previous action (walking, licking, etc.)

    this.currentAction = previousAction // Restore the previous action
    if (previousAction === 'walkRight') {
      this.cat.play('walkRight')
    } else if (previousAction === 'walkLeft') {
      this.cat.play('walkLeft')
    } else if (previousAction === 'lick') {
      this.cat.play('lick')
    } else if (previousAction === 'goUp') {
      this.cat.play('goUp')
    }
  }

  update() {
    // If any of the other states (licking, going up, etc.) are active, stop further updates
    if (
      this.isLicking ||
      this.isGoingUp ||
      this.isWalkingLeft ||
      this.isStretchingRight ||
      this.isStretchingLeft
    )
      return

    // Move the cat right if it's not stretching or doing something else
    this.cat.x += 2

    // Check if the cat has reached the sofa position
    if (this.cat.x >= this.sofaPosition) {
      this.cat.anims.stop()
      this.isWalkingRight = false
      this.cat.play('lick')
      this.isLicking = true
      this.currentAction = 'lick' // Update the current action to licking

      this.time.delayedCall(3000, this.startGoingUp, [], this)
    }
  }

  startGoingUp() {
    this.cat.anims.stop()
    this.isLicking = false
    this.isGoingUp = true

    this.cat.setTexture('catUp1').setScale(1.5).disableInteractive()
    this.cat.play('goUp')

    this.currentAction = 'goUp' // Update the current action to goUp

    this.upEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.y -= 5 // Move the cat up by 5 pixels
        if (this.cat.y == 350) {
          this.cat.anims.stop() // Stop the upward movement animation
          this.upEvent.remove()

          this.startWalkingLeft() // Start walking left
        }
      },
      repeat: -1
    })
  }

  startWalkingLeft() {
    this.cat.play('walkLeft').setScale(2.5).setInteractive()
    this.isGoingUp = false
    this.isWalkingLeft = true
    this.currentAction = 'walkLeft' // Update the current action to walkLeft

    this.leftEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.x -= 5 // Slightly faster left movement
        if (this.cat.x == 100) {
          this.cat.anims.stop()
          this.cat.play('lick')
          this.isWalkingLeft = false
          this.isLicking = true
          this.currentAction = 'lick' // Update the current action to licking
          this.leftEvent.remove()
        }
      },
      repeat: -1
    })
  }
}

export default {
  mounted() {
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
