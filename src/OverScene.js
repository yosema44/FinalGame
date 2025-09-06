import Phaser from "phaser"
export default class StartScene extends Phaser.Scene {
	constructor() {
		super("over-scene")
	}

	init(data) {
			this.score = data.score;
	}

	create() {
		this.add.text(70, 300, "SCORE:" + this.score, {
			fontSize: "60px",
			fill: "#000",
		})
		if (this.lifeLabel.getLife() == 0) {
			this.scene.start("game-over-scene", {
				score: this.scoreLabel.getScore(),
			})
		}
	}
}
