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
		this.platform = undefined
		this.fishes = undefined
		this.scoreText = undefined
		this.score = 0
		this.scoreLabel = undefined
		this.startGame = undefined
		this.lifeLabel = undefined
		this.life = 3
		this.ground = undefined
		this.lastY = 0
		this.wasOnPlatform = false
	}
	preload() {
		this.load.image("ground", "images/ground.png")
		this.load.image("background", "images/backgroundColorFall.png")
		this.load.image("clownfish", "images/Clownfish.png")
		this.load.image("salmon", "images/Salmon.png")
		this.load.image("solarfish", "images/Solarfish.png")
		this.load.image("mudfish", "images/mudfish.png")
		this.load.image("platform", "images/block_yellow.png")
		this.load.spritesheet("idle", "images/Idle.png", { frameWidth: 48, frameHeight: 48 })
		this.load.spritesheet("walk", "images/Walk.png", { frameWidth: 48, frameHeight: 48 })
		this.load.image("log", "images/ground.png")
		this.load.audio("backgroundMusic", "images/pixel3.mp3")
		this.load.audio("pickupSound", "images/coin.mp3")
	}
	create() {
		const music = this.sound.add("backgroundMusic", {
			loop: true,
			volume: 0.2,
		})
		music.play()
		this.add.image(240, 320, "background")
		this.ground = this.physics.add.staticGroup()
		this.player = this.physics.add.sprite(240, 320, "idle")
		this.player.setCollideWorldBounds(true)
		this.player.setBounce(0.2)
		this.cursors = this.input.keyboard.addKeys("A,D,space")
		this.createAnimations()
		this.player.anims.play("idle", true)
		this.createPlatform()
		this.createFishes()
		this.physics.add.collider(this.player, this.ground)
		this.physics.add.collider(this.player, this.platform)

		let cords = 30
		for (let i = 0; i < 16; i++) {
			this.ground.create(cords, 625, "log")
			cords += 30
		}
		this.scoreText = this.add.text(16, 16, "Score: 0", {
			fontSize: "32px",
			color: "#030000ff",
		})

		this.lifeLabel = this.add.text(10, 50, "Life: " + this.life, {
			fontSize: "16px",
			fill: "black",
		})
		this.player.setSize(30, 35) // Make hitbox smaller than the 48x48 sprite
		this.player.setOffset(9, 13) // Adjust offset to center the hitbox
	}
	createPlatform() {
		this.platform = this.physics.add.staticGroup()

		// Start at a reachable height - close enough to jump from ground
		let lastX = 240
		let lastY = 585 // Start at y=550 (ground is at 625, so only 75 pixels above - easily reachable)

		// 9 platforms for level 1 - balanced challenge
		for (let i = 0; i < 7; i++) {
			let randomX
			let randomY
			let validPosition = false
			let attempts = 0

			do {
				// Horizontal spacing: 80-140 pixels (challenging but reachable)
				const minHorizontalDistance = 80
				const maxHorizontalDistance = 140

				// Alternate direction for more variety
				const direction = Math.random() > 0.5 ? 1 : -1
				const horizontalOffset = minHorizontalDistance + Math.random() * (maxHorizontalDistance - minHorizontalDistance)

				randomX = lastX + direction * horizontalOffset

				// Keep within safe bounds (60-420)
				randomX = Math.max(60, Math.min(420, randomX))

				// Vertical spacing: 60-80 pixels going UPWARD (increased gap for fish access)
				const verticalOffset = 70 + Math.floor(Math.random() * 20)
				randomY = lastY - verticalOffset // Subtract to go UP

				// Don't let platforms go too high (keep below y=150)
				randomY = Math.max(randomY, 80)

				// Check for overlaps with existing platforms
				validPosition = true
				const existingPlatforms = this.platform.children.entries

				for (let j = 0; j < existingPlatforms.length; j++) {
					const existing = existingPlatforms[j]
					const horizontalDistance = Math.abs(existing.x - randomX)
					const verticalDistance = Math.abs(existing.y - randomY)

					// Minimum 80px horizontal OR 65px vertical separation for fish clearance
					if (horizontalDistance < 80 && verticalDistance < 75) {
						validPosition = false
						break
					}
				}

				attempts++
			} while (!validPosition && attempts < 20)

			// If we couldn't find a valid position, force one with proper spacing
			if (!validPosition) {
				randomX = lastX < 240 ? lastX + 120 : lastX - 120
				randomX = Math.max(60, Math.min(420, randomX))
				randomY = lastY - 70 // Guaranteed 70 pixel vertical gap upward
				randomY = Math.max(randomY, 50) // Don't go above y=150
			}

			this.platform.create(randomX, randomY, "platform").setScale(0.6, 0.6).refreshBody()

			lastX = randomX
			lastY = randomY
		}
	}

	createFishes() {
		this.fishes = this.physics.add.staticGroup()

		const fishTypes = ["clownfish", "mudfish", "salmon", "solarfish"]

		const platforms = this.platform.children.entries

		platforms.forEach((platform) => {
			const randomFishType = fishTypes[Math.floor(Math.random() * fishTypes.length)]

			const fish = this.fishes.create(platform.x, platform.y - 30, randomFishType)

			fish.setScale(0.4)

			fish.refreshBody()
		})

		this.physics.add.overlap(this.player, this.fishes, this.collectFish, null, this)
	}

	collectFish(player, fish) {
		fish.destroy()
		const pickupSound = this.sound.add("pickupSound", { volume: 0.5 })
		pickupSound.play()
		this.score += 10
		this.scoreText.setText("Score : " + this.score)
	}

	update() {
		const onGround = this.player.body.touching.down || this.player.body.blocked.down

		if (onGround && this.isJumping) {
			this.isJumping = false
			this.player.setScale(1)
			this.player.setRotation(0)
		}

		// Save last Y position
		const currentY = this.player.y

		// Check if on platform (not the bottom ground)
		const onPlatform = onGround && currentY < 550

		if (onPlatform) {
			this.wasOnPlatform = true
		}

		// Fall detection - if player was on a platform then falls beyond 600y
		if (this.wasOnPlatform && !onGround && currentY > 550) {
			this.loseLife()
		}

		if (this.cursors.A.isDown) {
			this.player.setVelocityX(-160)
			this.player.setFlipX(true)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("idle", true)
			}
		} else if (this.cursors.D.isDown) {
			this.player.setVelocityX(160)
			this.player.setFlipX(false)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("walk", true)
			}
		} else {
			this.player.setVelocityX(0)
			if (this.isJumping) {
				this.player.anims.play("jump", true)
			} else {
				this.player.anims.play("idle", true) // Should be "idle", not "walk"
			}
		}

		if (this.cursors.space.isDown && onGround && !this.isJumping) {
			this.player.setVelocityY(-225)
			this.isJumping = true
			this.player.setScale(1.1)
			this.player.anims.play("jump", true)
		}

		this.lifeLabel.setText("Life : " + this.life)

		// Add game over check here instead
		if (this.life <= 0 || this.score == 70) {
			this.scene.start("level-2", {
				score: this.score,
				life: this.life, // Pass remaining life to level 2
			})
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
	getLife() {
		return this.life
	}

	loseLife() {
		// Reduce lives
		this.life--

		// Update display
		this.lifeLabel.setText(`Lives: ${this.life}`)

		// Reset player position
		this.player.setVelocity(0, 0)
		this.player.y = 520

		// Reset fall detection
		this.wasOnPlatform = false

		// Check for game over
		if (this.life <= 0) {
			this.scene.start("over-scene", { score: this.score })
			return
		}

		// Flash the player to indicate damage
		this.tweens.add({
			targets: this.player,
			alpha: 0.5,
			duration: 100,
			yoyo: true,
			repeat: 5,
			onComplete: () => {
				this.player.alpha = 1
			},
		})
	}
}
