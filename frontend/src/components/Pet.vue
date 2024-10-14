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
import catlicking from '../assets/pet_related/yellow_cat/licking.png'
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

    this.load.spritesheet('catLicking', catlicking, {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.image('catUp1', catup1)
    this.load.image('catUp2', catup2)
    this.load.image('catUp3', catup3)
  }

  create() {
    // Create the cat sprite and scale it
    this.cat = this.physics.add
      .sprite(0, this.cameras.main.height - 100, 'catWalkingRight')
      .setScale(2.5)

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
      key: 'goUp',
      frames: [{ key: 'catUp1' }, { key: 'catUp2' }, { key: 'catUp3' }],
      frameRate: 5,
      repeat: -1
    })

    // Play the initial walking animation
    this.cat.play('walkRight')

    // Track states
    this.isLicking = false
    this.isGoingUp = false
    this.isWalkingLeft = false

    // Sofa position
    this.sofaPosition = 700
  }

  update() {
    if (this.isLicking || this.isGoingUp || this.isWalkingLeft) return

    // Move cat right
    this.cat.x += 2

    if (this.cat.x >= this.sofaPosition) {
      this.cat.anims.stop()
      this.cat.play('lick')
      this.isLicking = true

      this.time.delayedCall(4000, this.startGoingUp, [], this)
    }
  }

  startGoingUp() {
    this.cat.anims.stop()

    this.cat.setTexture('catUp1').setScale(1.5)
    this.cat.play('goUp')

    this.isLicking = false
    this.isGoingUp = true

    this.upEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.y -= 5 // Move the cat up by 5 pixels
        if (this.cat.y == 350) {
          // Check if the cat has reached Y = 300
          this.cat.anims.stop() // Stop the upward movement animation
          this.upEvent.remove() // Stop further upward movement

          this, this.startWalkingLeft()

          // Start licking when it reaches Y = 300
        }
      },
      repeat: -1 // Repeat until we stop it
    })
  }

  startWalkingLeft() {
    this.cat.play('walkLeft').setScale(2.5)
    this.isGoingUp = false
    this.isWalkingLeft = true

    this.leftEvent = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.cat.x -= 5 // Slightly faster left movement
        if (this.cat.x == 100) {
          this.cat.anims.stop()
          this.cat.play('lick')
          this.isWalkingLeft = false
          this.isLicking = true
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
