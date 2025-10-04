import Phaser from "phaser"
export default class Level2 extends Phaser.Scene {
    constructor() {
        super("level-2")
    }

    init(data) {
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
        // Get score from previous scene, or start at 70
        this.score = data && data.score ? data.score : 70
        this.scoreLabel = undefined
        this.startGame = undefined
        this.lifeLabel = undefined
        this.life = 3
        this.ground = undefined
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
        
        // REMOVE these lines - they cause the error!
        // this.physics.add.collider(this.player, this.ground)
        // this.physics.add.collider(this.player, this.platform)
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
        
        // Add colliders here in create() - AFTER objects are created
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.player, this.platform)

        let cords = 30
        for (let i = 0; i < 16; i++) {
            this.ground.create(cords, 625, "log")
            cords += 30
        }
        
        // Display score from previous level
        this.scoreText = this.add.text(16, 16, "Score: " + this.score, {
            fontSize: "32px",
            color: "#030000ff",
        })

        this.lifeLabel = this.add.text(10, 50, "Life: " + this.life, {
            fontSize: "16px",
            fill: "black",
        })
    }

    createPlatform() {
        this.platform = this.physics.add.staticGroup()

        // Start at a reachable height for level 2
        let lastX = 240
        let lastY = 585 // Start at y=540 (ground is at 625, so 85 pixels above - reachable but requires a good jump)

        // 11 platforms for level 2 - more challenging
        for (let i = 0; i < 7; i++) {
            let randomX
            let randomY
            let validPosition = false
            let attempts = 0
            
            do {
                // Horizontal spacing: 90-150 pixels (more challenging than level 1)
                const minHorizontalDistance = 90
                const maxHorizontalDistance = 150
                
                // More varied movement pattern
                let direction
                if (i % 3 === 0) {
                    direction = 1 // Go right
                } else if (i % 3 === 1) {
                    direction = -1 // Go left
                } else {
                    direction = Math.random() > 0.5 ? 1 : -1 // Random
                }
                
                const horizontalOffset = minHorizontalDistance + Math.random() * (maxHorizontalDistance - minHorizontalDistance)
                randomX = lastX + direction * horizontalOffset
                
                // Keep within safe bounds (60-420)
                randomX = Math.max(60, Math.min(420, randomX))
                
                // Vertical spacing: 80-100 pixels going UPWARD (increased for fish clearance)
                const verticalOffset = 80 + Math.floor(Math.random() * 20)
                randomY = lastY - verticalOffset // Subtract to go UP
                
                // Don't let platforms go too high (keep below y=120)
                randomY = Math.max(randomY, 120)
                
                // Check for overlaps with existing platforms
                validPosition = true
                const existingPlatforms = this.platform.children.entries
                
                for (let j = 0; j < existingPlatforms.length; j++) {
                    const existing = existingPlatforms[j]
                    const horizontalDistance = Math.abs(existing.x - randomX)
                    const verticalDistance = Math.abs(existing.y - randomY)
                    
                    // Minimum 85px horizontal OR 70px vertical separation for fish clearance
                    if (horizontalDistance < 85 && verticalDistance < 70) {
                        validPosition = false
                        break
                    }
                }
                
                attempts++
            } while (!validPosition && attempts < 20)
            
            // If we couldn't find a valid position, force one with proper spacing
            if (!validPosition) {
                randomX = lastX < 240 ? lastX + 130 : lastX - 130
                randomX = Math.max(60, Math.min(420, randomX))
                randomY = lastY - 75 // Guaranteed 75 pixel vertical gap upward
                randomY = Math.max(randomY, 120) // Don't go above y=120
            }
            
            // Variable platform size for level 2
            const scale = 0.55 + Math.random() * 0.1 // Between 0.55 and 0.65
            this.platform.create(randomX, randomY, "platform").setScale(scale, scale).refreshBody()
            
            lastX = randomX
            lastY = randomY
        }
    }

    collectFish(player, fish) {
        fish.destroy()
        this.score += 10
        this.scoreText.setText("Score : " + this.score)
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
        if (this.life <= 0 || this.score == 140) {
            this.scene.start("over-scene", {
                score: this.score,
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
    getlife() {
        return this.life
    }

    loselife() {
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
