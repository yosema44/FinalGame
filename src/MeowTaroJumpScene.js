import Phaser from "phaser"
export default class MeowTaroJumpScene extends Phaser.Scene {
	constructor() {
		super("meow-taro-jump-scene")
	}

	init() {
		this.player = null
		this.cursors = null
		this.isJUmping = false
	}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
		this.load.image("clownfish", "images/Clownfish.png")
		this.load.image("salmon", "images/Salmon.png")
		this.load.image("solarfish", "images/Solarfish.png")
		this.load.image("mudfish", "images/mudfish.png")
		this.load.image("tile", "images/block_yellow.png")
		this.load.spritesheet("idle", "images/Idle.png", {
			frameWidth: 48,
			frameHeight: 48,
		})
		this.load.spritesheet("Walk", "images/Walk.png", {
			frameWidth: 48,
			frameHeight: 48,
		})
	}
	create() {
		this.add.image(240, 320, "background")

		this.player = this.physics.add.sprite(240, 320, "idle")
		this.player.setCollideWorldBounds(true)
		this.player.setBounce(0.2)

		this.createAnimations()
	}
	update() {
		const onGround = this.player.body.blocked.down || this.player.body.touching.down
	}
	createAnimations() {
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 3 }),
			frameRate: 8,
			repeat: -1,
		})

		this.anims.create({
			key: "walk",
			frames: this.anims.generateFrameNumbers("walk", { start: 0, end: 7 }),
			frameRate: 12,
			repeat: -1,
		})

		this.anims.create({
			key: "jump",
			frames: this.anims.generateFrameNumbers("idle", { start: 0, end: 3 }),
			frameRate: 16,
			repeat: -1,
		})
	}
}
