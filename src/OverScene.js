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
	}

	create() {
		this.add.image(240, 300, "background")
		this.add.text(70, 300, "SCORE:" + this.score, {
			fontSize: "60px",
			fill: "#000",
		})
	}
}
