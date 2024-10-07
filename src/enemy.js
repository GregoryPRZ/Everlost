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

    // Limites de déplacement
    this.leftLimit = x - 200; // Limite gauche
    this.rightLimit = x + 200; // Limite droite

    // Gestion des points de vie
    this.lifePoints = 3;

    // Initialisation du comportement de tir
    this.initShooting();
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

  // Mettre à jour l'ennemi à chaque frame
  update() {
    this.move();
  }

  // Déplacement de l'ennemi
  move() {
    // Vérifie si l'ennemi atteint la limite gauche ou droite
    if (this.enemy.x <= this.leftLimit) {
      this.direction = 1; // Change la direction à droite
    } else if (this.enemy.x >= this.rightLimit) {
      this.direction = -1; // Change la direction à gauche
    }

    // Déplacement de l'ennemi
    this.enemy.setVelocityX(this.speed * this.direction);

    // Animation et inversion de l'échelle selon la direction
    if (this.direction === 1) {
      this.enemy.play("enemy_droite", true); // Joue l'animation pour aller à droite
      this.enemy.setFlipX(false); // Remet à l'échelle normale pour aller à droite
    } else {
      this.enemy.play("enemy_gauche", true); //
      this.enemy.setFlipX(false); // Inverse l'échelle pour tourner l'ennemi vers la gauche
    }
  }

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
}
