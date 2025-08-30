import Phaser from "phaser"
export default class StartScene extends Phaser.Scene {
	constructor() {
		super("start-scene")
	}

	init() {}

	create() {
		this.startButton = this.add.image(200, 500, "start-button").setInteractive()
		this.startButton.once(
			"pointerup",
			() => {
				this.scene.start("game-scene")
			},
			this
		)
		this.time.addEvent({
			delay: 3000,
			callback: this.startGame,
			callbackScope: this,
			loop: true,
		})
	}

	startGame() {
		this.scene.start("meaow-taro-jump-scene")
	}
}
