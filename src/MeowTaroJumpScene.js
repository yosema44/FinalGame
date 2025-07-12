import Phaser from "phaser"
export default class MeowTaroJumpScene extends Phaser.Scene {
	constructor() {
		super("meow-taro-jump-scene")
	}

	init() {

	}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
		this.load.spritesheet("idle", "Idle.png", {
			frameWidth: 48,
			frameHeight: 48,
		})
		this.load.spritesheet("Walk", "Walk.png", {
			frameWidth: 48,
			frameHeight: 48,
		})
	}
	create() {
		this.add.image(240, 320, "background")
		this.physics.add.sprite(240, 320, "idle")
	}
	update() {

	}
}
