export class Enemy {
  constructor(scene, x, y, texture, player, calque_plateformes, platforms) {
    this.scene = scene;
    this.player = player;

    // Initialisation de l'ennemi
    this.enemy = this.scene.physics.add.sprite(x, y, texture);
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setBounce(0.2);
    this.enemy.setGravityY(300);

    // Collision avec le calque de plateformes
    this.scene.physics.add.collider(
      this.enemy,
      calque_plateformes,
      this.handlePlatformCollision,
      null,
      this
    );
    this.scene.physics.add.collider(this.player, platforms);

    // Propriétés du comportement
    this.speed = 100;
    this.direction = 1;
    this.isShooting = false;
    this.invincible = false;

    // Gestion des points de vie
    this.lifePoints = 3;

    // Initialisation du comportement de tir
    this.initShooting();

    // Si tu veux ajouter des comportements basés sur le type d'ennemi, tu peux ajouter une condition ici
    // Exemple : if (this.type === 2) { ... }
  }

  // Initialisation du comportement de tir
  initShooting() {
    this.shootTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });
  }

  // Fonction de tir
  shoot() {
    // Vérifier si le joueur est à portée
    if (
      Phaser.Math.Distance.Between(
        this.enemy.x,
        this.enemy.y,
        this.player.x,
        this.player.y
      ) < 300
    ) {
      // Créer une balle et tirer vers le joueur
      const bullet = this.scene.physics.add.sprite(
        this.enemy.x,
        this.enemy.y,
        "bullet"
      );
      this.scene.physics.moveToObject(bullet, this.player, 400);

      // Ajouter une collision avec le joueur
      this.scene.physics.add.overlap(bullet, this.player, () => {
        bullet.destroy(); // Détruire la balle au contact
      });

      // Détruire la balle après un certain délai
      this.scene.time.delayedCall(1200, () => bullet.destroy(), [], this);
    }
  }

  // Gérer la collision avec une plateforme
  handlePlatformCollision() {}
  deplacement() {
    if (this.enemy.handlePlatformCollision) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }
  }

  // Mettre à jour l'ennemi à chaque frame
  update() {
    this.move();
  }

  // Déplacement de l'ennemi
  move() {
    this.enemy.setVelocityX(this.speed * this.direction);
  }
  // à implenter
  // Diminuer les points de vie de l'ennemi
  decreaseHealthPoints() {
    this.lifePoints--;
    if (this.lifePoints <= 0) {
      this.shootTimer.remove(); // Arrêter le comportement de tir
      this.enemy.destroy(); // Détruire l'ennemi lorsqu'il est mort
    }
  }

  // Rendre l'ennemi invincible pour une courte période
  setInvincible() {
    this.invincible = true;
    this.enemy.setTint(0x00ff00); // Change la couleur de l'ennemi

    // Animation de clignotement
    this.blinkAnimation = this.scene.tweens.add({
      targets: this.enemy,
      alpha: 0.3,
      duration: 150,
      yoyo: true,
      repeat: -1,
    });

    // Retirer l'invincibilité après 1.5 secondes
    this.scene.time.delayedCall(1500, () => {
      this.invincible = false;
      this.enemy.clearTint();
      this.enemy.alpha = 1;
      this.blinkAnimation.stop();
    });
  }

  // Vérifier si l'ennemi est invincible
  isInvincible() {
    return this.invincible;
  }

  // Vérifier si l'ennemi est mort
  isDead() {
    return this.lifePoints <= 0;
  }
  //
}
