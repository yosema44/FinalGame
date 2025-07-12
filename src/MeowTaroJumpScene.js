import Phaser from "phaser"
export default class MeowTaroJumpScene extends Phaser.Scene {
	constructor() {
		super("meow-taro-jump-scene")
	}

	init() {

	}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
	}
	create() {
		this.add.image(240, 320, "background")
	}
	update() {

	}
}
