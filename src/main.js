import Phaser from "phaser"

import MeowTaroJumpScene from "./MeowTaroJumpScene.js"
import StartScene from "./StartScene.js"
import OverScene from "./OverScene.js"
import Level2 from "./Level2.js"

const config = {
	type: Phaser.AUTO,
	parent: "app",
	width: 480,
	height: 640,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 },
			debug: true,
		},
	},
	scene: [StartScene, MeowTaroJumpScene, Level2, OverScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
}

export default new Phaser.Game(config)
