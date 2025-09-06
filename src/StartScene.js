import Phaser from "phaser"
export default class StartScene extends Phaser.Scene {
	constructor() {
		super("start-scene")
	}

	init() {}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
		this.load.image("button", "images/orangebutton.png")
	}

	create() {
		this.add.image(400, 300, "background")
		this.startButton = this.add.image(239, 500, "button").setInteractive()
		this.startButton.once(
			"pointerup",
			() => {
				this.scene.start("meow-taro-jump-scene")
			},
			this
		)
	}
}
