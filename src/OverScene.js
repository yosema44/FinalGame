import Phaser from "phaser"
export default class OverScene extends Phaser.Scene {
    constructor() {
        super("over-scene")
    }

    init(data) {
        this.score = data.score || 0;
    }

    create() {
        this.add.text(70, 300, "SCORE:" + this.score, {
            fontSize: "60px",
            fill: "#000",
        })
    }
}
