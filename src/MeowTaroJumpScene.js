import Phaser from "phaser"
export default class MeowTaroJumpScene extends Phaser.Scene {
	constructor() {
		super("meow-taro-jump-scene")
	}

	init() {
		this.player = null
		this.cursors = null
		this.isJumping = false
		this.clownfish = undefined
		this.salmon = undefined
		this.solarfish = undefined
		this.mudfish = undefined
	}

	preload() {
		this.load.image("background", "images/backgroundColorFall.png")
		this.load.image("clownfish", "images/Clownfish.png")
		this.load.image("salmon", "images/Salmon.png")
		this.load.image("solarfish", "images/Solarfish.png")
		this.load.image("mudfish", "images/mudfish.png")
		this.load.image("platform", "images/block_yellow.png") 
		this.load.spritesheet("idle", "images/Idle.png", { frameWidth: 48, frameHeight: 48, })
		this.load.spritesheet("walk", "images/Walk.png", { frameWidth: 48, frameHeight: 48, })
	}
	create() {
		this.add.image(240, 320, "background")
		this.add.image(240, 320, "platform").setScale(0.5)
		this.player = this.physics.add.sprite(240, 320, "idle")
		this.player.setCollideWorldBounds(true)
		this.player.setBounce(0.2)
		this.cursors = this.input.keyboard.createCursorKeys()
		this.createAnimations()
		this.player.anims.play("idle", true)
		this.createPlatform()
			
	}
	createPlatform() {
		this.platform = this.physics.add.staticGroup()
		
		let YLevel = 100
		let lastX = 240;

		for (let i = 0; i < 7; i++) {
			let randomX;
			let attempts = 0;

		do {
			randomX = Math.floor(Math.random() * 420) + 30;
			attempts++;
		} while (attempts < 10 && Math.abs(randomX - lastX) < 80);

		if (Math.abs(randomX - lastX) < 80) {
			if (lastX < 240) {
				randomX = Math.min(450, lastX + 100 + Math.random() * 50);
			} else {
				randomX = Math.max(30, lastX - 100 - Math.random() * 50);
			}
		}

		this.platform.create(randomX, YLevel, "platform")
		lastX = randomX;
		const nextYLevel = YLevel + Math.floor(Math.random() * 20) + 60;
		YLevel = Math.min(nextYLevel, 480);
		}
	}

	update() {
		const onGround = this.player.body.blocked.down || this.player.body.touching.down

		if(onGround && this.isJumping) {
			this.isJumping = false
			this.player.setScale(1)
			this.player.setRotation(0)
		}

		if (this.cursors.left.isDown) {
  		this.player.setVelocity(-70, 0);
		}

		if (this.cursors.right.isDown) {
 		 this.player.setVelocityX(70);
		}

		if(this.cursors.left.isDown) {
			this.player.setVelocityX(-160)
			this.player.setFlipX(true)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("walk", true)
			}
		} 
		else if (this.cursors.right.isDown){
			this.player.setVelocityX(160)
			this.player.setFlipX(false)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("walk", true)
			}
		}
		else {
			this.player.setVelocityX(0)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("walk", true)
			}
		}

		if (this.cursors.space.isDown && onGround && !this.isJumping) {
			this.player.setVelocityY(-225)
			this.isJumping = true
			this.player.setScale(1.1)
			this.player.anims.play("jump", true)
		}
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
