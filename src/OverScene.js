import Phaser from "phaser"
export default class OverScene extends Phaser.Scene {
	constructor() {
		super("over-scene")
	}

	init(data) {
		this.score = data && data.score ? data.score : 0
	}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
		// Add retry button image loading
		this.load.image("retryButton", "images/retrybutton.png")
	}

	create() {
		this.add.image(240, 300, "background")
		this.add.text(70, 300, "SCORE:" + this.score, {
			fontSize: "60px",
			fill: "#000",
		})

		// Add retry button
		const retryButton = this.add
			.image(240, 400, "retryButton")
			.setScale(0.5) // Adjust scale as needed
			.setInteractive() // Make it clickable

		// Add hover effect
		retryButton.on("pointerover", () => {
			retryButton.setScale(0.55) // Slightly larger on hover
		})

		retryButton.on("pointerout", () => {
			retryButton.setScale(0.5) // Normal size when not hovering
		})

		// Add click handler
		retryButton.on("pointerup", () => {
			// Reset to first level
			this.scene.start("meow-taro-jump-scene")
		})
	}
}
