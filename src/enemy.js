export class Blob {
  constructor(scene, x, y, texture, calque_plateformes) {
    this.scene = scene;
    this.lifePoints = 3;
    // Initialisation de l'ennemi
    this.enemy = this.scene.physics.add.sprite(x, y, texture);
    this.enemy.setGravityY(300);
    this.enemy.instance = this;

    // Propriétés du comportement
    this.speed = 100;
    this.direction = 1;
    this.shootCooldown = 2000; // Délai entre les tirs (en millisecondes)
    this.lastShotTime = 0; // Dernière fois où l'ennemi a tiré

    // Limites de déplacement
    this.leftLimit = x - 400; // Limite gauche
    this.rightLimit = x + 100; // Limite droite
    this.enemy.body.setSize(32, 32);
    this.enemy.body.setOffset(16, 32);
    this.healthBar = this.scene.add.graphics();

    this.updateHealthBar();
    this.setupAnimations();
  }

  updateHealthBar() {
      this.healthBar.clear(); // Efface l'ancienne barre
      const width = 50; // Largeur de la barre de vie
      const height = 5; // Hauteur de la barre de vie
      const healthPercentage = this.lifePoints / 3; // Supposons que 3 est le maximum de points de vie

      // Dessine le fond de la barre de vie
      this.healthBar.fillStyle(0x000000, 1); // Couleur noire pour le fond
      this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width, height); // Position

      // Dessine la barre de vie
      this.healthBar.fillStyle(0xff0000, 1); // Couleur rouge pour la vie
      this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width * healthPercentage, height); // Position
  }

  setupAnimations() {
    this.scene.anims.create({
      key: "blob_anim",
      frames: this.scene.anims.generateFrameNumbers("enemi", {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.enemy.play("blob_anim"); // Joue l'animation pour aller à droite
  }

  // Gérer la collision avec une plateforme
  handlePlatformCollision() {
    console.log("Collision détectée, changement de direction !");
    this.direction *= -1;
    this.enemy.setVelocityX(this.speed * this.direction); // Mise à jour de la vitesse lors du changement de direction
  }

  // Mettre à jour l'ennemi à chaque frame
  update() {
    this.move();
    this.updateHealthBar(); // Mettre à jour la barre de vie à chaque frame
    if (!this.scene.player.player) return;
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.enemy.x,
      this.enemy.y,
      this.scene.player.player.x,
      this.scene.player.player.y
    ); // Accès à la position du joueur

    // Vérifier si le joueur est à portée et si le délai entre les tirs est respecté
    if (
      distanceToPlayer < 300 &&
      this.scene.time.now > this.lastShotTime + this.shootCooldown
    ) {
      this.shoot();
      this.lastShotTime = this.scene.time.now; // Mettre à jour le temps du dernier tir
    }
  }

  // Déplacement de l'ennemi
  move() {
    // Vérifie si l'ennemi atteint la limite gauche ou droite
    if (this.enemy.x <= this.leftLimit) {
      this.direction = 1; // Change la direction à droite
    } else if (this.enemy.x >= this.rightLimit) {
      this.direction = -1; // Change la direction à gauche
    }

    // Crée des capteurs juste sous le côté gauche et le côté droit de l'ennemi
    const leftSensorX = this.enemy.x - 10; // Capteur côté gauche
    const rightSensorX = this.enemy.x + 10; // Capteur côté droit
    const sensorY = this.enemy.y + this.enemy.height / 2 + 5; // Légèrement sous l'ennemi

    // Vérifie s'il y a une plateforme sous les capteurs
    const tileLeft = this.scene.calque_plateformes.getTileAtWorldXY(
      leftSensorX,
      sensorY
    );
    const tileRight = this.scene.calque_plateformes.getTileAtWorldXY(
      rightSensorX,
      sensorY
    );

    // Si l'ennemi est en train de se déplacer vers la gauche et qu'il n'y a pas de plateforme à gauche
    if (this.direction === -1 && !tileLeft) {
      this.direction = 1; // Change la direction à droite
    }

    // Si l'ennemi est en train de se déplacer vers la droite et qu'il n'y a pas de plateforme à droite
    if (this.direction === 1 && !tileRight) {
      this.direction = -1; // Change la direction à gauche
    }

    // Déplacement de l'ennemi
    this.enemy.setVelocityX(this.speed * this.direction);
    // Animation et inversion de l'échelle selon la direction
    if (this.direction === 1) {
      this.enemy.setFlipX(true); // Remet à l'échelle normale pour aller à droite
    } else {
      this.enemy.setFlipX(false); // Inverse l'échelle pour tourner l'ennemi vers la gauche
    }
  }

  // Vérifie si le joueur est proche et tire
  checkForPlayerAndShoot(time) {
    const distance = Phaser.Math.Distance.Between(
      this.enemy.x,
      this.enemy.y,
      this.player.x,
      this.player.y
    );

    // Si le joueur est à moins de 200 pixels et que l'ennemi peut tirer
    if (distance < 200 && time > this.lastShotTime + this.shootCooldown) {
      this.shoot();
      this.lastShotTime = time;
    }
  }
  // Fonction pour faire tirer l'ennemi
  shoot() {
    this.scene.sound.play("poisonSound"); // Jouer le son de saut
    // Créer la balle à la position de l'ennemi
    const bullet = this.scene.physics.add.sprite(
      this.enemy.x,
      this.enemy.y,
      "bullet"
    );

    // Calculer le vecteur directionnel vers le joueur
    const playerX = this.scene.player.player.x;
    const playerY = this.scene.player.player.y;

    const directionX = playerX - this.enemy.x;
    const directionY = playerY - this.enemy.y;

    // Normaliser le vecteur directionnel pour garder une vitesse constante
    const magnitude = Math.sqrt(
      directionX * directionX + directionY * directionY
    );
    const normalizedX = (directionX / magnitude) * 300; // 300 est la vitesse de la balle
    const normalizedY = (directionY / magnitude) * 300;

    // Appliquer la vélocité calculée à la balle
    bullet.setVelocity(normalizedX, normalizedY);

    // Gérer la collision entre la balle et le joueur
    this.scene.physics.add.collider(bullet, this.scene.player.player, () => {
      console.log("Le joueur est touché !");
      bullet.destroy(); // Détruit la balle lorsqu'elle touche le joueur
      // Ajoute ici la logique pour réduire les points de vie du joueur si nécessaire
      this.scene.player.takeDamage(); // Appelle la fonction pour réduire les vies et clignoter
    });
    this.scene.physics.add.collider(
      bullet,
      this.scene.calque_plateformes,
      () => {
        bullet.destroy(); // Détruit la balle lorsqu'elle touche une plateforme
      }
    );
  }

  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play('hurtSound');
    this.lifePoints--; // Réduit la vie du joueur
    this.isInvincible = true; // Rend le joueur temporairement invincible
    this.updateHealthBar(); // Met à jour la barre de vie après avoir pris des dégâts
    if (this.lifePoints <= 0) {
        this.enemy.destroy(); // Appelle une méthode pour gérer la mort du joueur
        this.healthBar.destroy();
        return; // Sort de la méthode
    }
  
    this.blinkRed();
  
    // Remettre le joueur visible et stopper l'invincibilité après un certain temps
    this.scene.time.delayedCall(500, () => {
        this.isInvincible = false;
        if (this.enemy) {
            this.enemy.clearTint(); // Retirer la teinte rouge
        }
    }, [], this);
  }

  blinkRed() {
    if (!this.enemy) return; // Vérifiez si le joueur existe avant d'appliquer la teinte
  
    this.enemy.setTint(0xff0000); // Applique une teinte rouge
  
    // Utiliser un tween pour gérer le clignotement
    this.scene.tweens.add({
        targets: this.enemy,
        alpha: 1, // Réduire l'opacité à 0.5 au lieu de 0
        ease: 'Cubic.easeOut',
        duration: 100, // Durée d'une phase de clignotement
        repeat: 5, // Répéter 5 fois
        yoyo: true, // Alterner entre visible et invisible
        onComplete: () => {
            if (this.enemy) {
                this.enemy.clearTint(); // Retirer la teinte rouge une fois terminé
            }
        }
    });
  }
}

export class CarnivorousPlant {
  constructor(scene, x, y, player) {
    this.scene = scene;
    this.player = player;
    this.isAttacking = false;
    this.lifePoints = 4;

    // Ajouter le sprite de la plante
    this.enemy = this.scene.physics.add.sprite(x, y, "carnivorous_plant_idle");
    this.enemy.setImmovable(true);
    this.enemy.body.allowGravity = false;

    // Créer un capteur circulaire autour de la plante
    this.attackRadius = 80; // Rayon du capteur
    this.attackSensor = this.scene.add
      .zone(x, y)
      .setSize(this.attackRadius * 2, this.attackRadius * 2);
    this.attackSensor.setOrigin(0.5, 0.5);

    // Activer la physique sur le capteur
    this.scene.physics.world.enable(this.attackSensor);
    this.attackSensor.body.setAllowGravity(false);
    this.attackSensor.body.setImmovable(true);

    this.healthBar = this.scene.add.graphics();

    this.updateHealthBar();
    this.setupAnimations();

    // Vérifier les collisions entre le capteur et le joueur
    this.scene.physics.add.collider(
      this.attackSensor,
      this.player,
      this.startAttack.bind(this),
      null,
      this
    );
    console.log("Capteur d'attaque configuré.");
  }

  updateHealthBar() {
    this.healthBar.clear(); // Efface l'ancienne barre
    const width = 50; // Largeur de la barre de vie
    const height = 5; // Hauteur de la barre de vie
    const healthPercentage = this.lifePoints / 4; // Supposons que 3 est le maximum de points de vie

    // Dessine le fond de la barre de vie
    this.healthBar.fillStyle(0x000000, 1); // Couleur noire pour le fond
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width, height); // Position

    // Dessine la barre de vie
    this.healthBar.fillStyle(0xff0000, 1); // Couleur rouge pour la vie
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width * healthPercentage, height); // Position
  }

  setupAnimations() {
    // Animation idle
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("carnivorous_plant_idle", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1, // L'animation se répète en boucle
    });

    // Animation d'attaque
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers(
        "carnivorous_plant_attack",
        {
          start: 0,
          end: 7,
        }
      ),
      frameRate: 10,
      repeat: 0, // L'animation ne se joue qu'une seule fois
    });

    // Lancer l'animation "idle" par défaut
    this.enemy.play("idle");
    console.log("Animation 'idle' lancée.");
  }

  startAttack() {
    if (this.isAttacking) return; // Si déjà en attaque, ne rien faire

    this.isAttacking = true; // Indiquer que l'attaque commence

    console.log("L'attaque commence. Animation 'attack' lancée.");
    // Lancer l'animation d'attaque
    this.enemy.play("attack");

    // Infliger des dégâts au joueur
    this.player.takeDamage(1);
    console.log("Le joueur subit 1 point de dégâts.");

    // Revenir à l'état "idle" après l'attaque (1 seconde après)
    this.scene.time.delayedCall(1000, this.stopAttack, [], this);
  }

  stopAttack() {
    this.isAttacking = false; // Attaque terminée
    this.enemy.play("idle"); // Revenir à l'animation idle
    console.log("Attaque terminée. Retour à l'animation 'idle'.");
  }

  update() {
    // Aucune vérification manuelle ici, car l'overlap est géré par Phaser
  }

  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play('hurtSound');
    this.lifePoints--; // Réduit la vie du joueur
    this.isInvincible = true; // Rend le joueur temporairement invincible
    this.updateHealthBar(); // Met à jour la barre de vie après avoir pris des dégâts
    if (this.lifePoints <= 0) {
        this.enemy.destroy(); // Appelle une méthode pour gérer la mort du joueur
        this.healthBar.destroy();
        return; // Sort de la méthode
    }
  
    this.blinkRed();
  
    // Remettre le joueur visible et stopper l'invincibilité après un certain temps
    this.scene.time.delayedCall(500, () => {
        this.isInvincible = false;
        if (this.enemy) {
            this.enemy.clearTint(); // Retirer la teinte rouge
        }
    }, [], this);
  }

  blinkRed() {
    if (!this.enemy) return; // Vérifiez si le joueur existe avant d'appliquer la teinte
  
    this.enemy.setTint(0xff0000); // Applique une teinte rouge
  
    // Utiliser un tween pour gérer le clignotement
    this.scene.tweens.add({
        targets: this.enemy,
        alpha: 1, // Réduire l'opacité à 0.5 au lieu de 0
        ease: 'Cubic.easeOut',
        duration: 100, // Durée d'une phase de clignotement
        repeat: 5, // Répéter 5 fois
        yoyo: true, // Alterner entre visible et invisible
        onComplete: () => {
            if (this.enemy) {
                this.enemy.clearTint(); // Retirer la teinte rouge une fois terminé
            }
        }
    });
  }
}

export class Vine {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.enemy = this.scene.physics.add.sprite(x, y, texture);
    this.enemy.body.setAllowGravity(false);
    this.lifePoints = 1;
    this.enemy.instance = this;

    this.healthBar = this.scene.add.graphics();

    this.updateHealthBar();

    this.setupAnimations();
  }

  updateHealthBar() {
    this.healthBar.clear(); // Efface l'ancienne barre
    const width = 50; // Largeur de la barre de vie
    const height = 5; // Hauteur de la barre de vie
    const healthPercentage = this.lifePoints / 1; // Supposons que 3 est le maximum de points de vie

    // Dessine le fond de la barre de vie
    this.healthBar.fillStyle(0x000000, 1); // Couleur noire pour le fond
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width, height); // Position

    // Dessine la barre de vie
    this.healthBar.fillStyle(0xff0000, 1); // Couleur rouge pour la vie
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width * healthPercentage, height); // Position
  }

  setupAnimations() {
    this.scene.anims.create({
      key: "swaying_vine",
      frames: this.scene.anims.generateFrameNumbers("vine", {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.enemy.play("swaying_vine");
  }

  update() {}

  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play('hurtSound');
    this.lifePoints--; // Réduit la vie du joueur
    this.isInvincible = true; // Rend le joueur temporairement invincible
    this.updateHealthBar(); // Met à jour la barre de vie après avoir pris des dégâts
    if (this.lifePoints <= 0) {
        this.enemy.destroy(); // Appelle une méthode pour gérer la mort du joueur
        this.healthBar.destroy();
        return; // Sort de la méthode
    }
  }
}

export class Crow {
  constructor(scene, x, y, player) {
    this.scene = scene;
    this.player = player;
    this.lifePoints = 2;

    // Ajouter le sprite du corbeau avec l'animation de vol par défaut
    this.enemy = this.scene.physics.add.sprite(x, y, "crow_fly");
    this.enemy.setImmovable(false);
    this.enemy.body.setSize(32, 32);
    this.enemy.body.setOffset(12, 20);
    this.enemy.body.allowGravity = false;

    this.health = 1;
    this.speed = 100;
    this.initialX = x;
    this.initialY = y;
    this.direction = -1; // Le corbeau commence en allant vers la gauche
    this.enemy.setFlipX(true);
    this.healthBar = this.scene.add.graphics();

    this.updateHealthBar();
    this.setupAnimations();

    this.isDiving = false;
    this.distanceTraveled = 0; // Nouvelle propriété pour suivre la distance parcourue
  }

  updateHealthBar() {
    this.healthBar.clear(); // Efface l'ancienne barre
    const width = 50; // Largeur de la barre de vie
    const height = 5; // Hauteur de la barre de vie
    const healthPercentage = this.lifePoints / 2; // Supposons que 3 est le maximum de points de vie

    // Dessine le fond de la barre de vie
    this.healthBar.fillStyle(0x000000, 1); // Couleur noire pour le fond
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width, height); // Position

    // Dessine la barre de vie
    this.healthBar.fillStyle(0xff0000, 1); // Couleur rouge pour la vie
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width * healthPercentage, height); // Position
  }

  setupAnimations() {
    this.scene.anims.create({
      key: "fly",
      frames: this.scene.anims.generateFrameNumbers("crow_fly", {
        start: 0,
        end: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "dive",
      frames: this.scene.anims.generateFrameNumbers("crow_dive", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: 0,
    });
    this.enemy.play("fly");
  }

  update() {
    if (this.isDiving) {
      return;
    }

    const displacement =
      (this.speed * this.direction * this.scene.game.loop.delta) / 1000;

    // Mise à jour de la position du corbeau
    this.enemy.x += displacement;

    this.distanceTraveled += Math.abs(displacement);

    if (this.distanceTraveled >= 150) {
      this.direction *= -1;
      this.enemy.setFlipX(this.direction === 1);
      this.distanceTraveled = 0;
    } else {
      this.enemy.setFlipX(this.direction === -1);
    }

    // Stockez l'ancienne position y pour la hitbox
    const hitboxY = this.initialY;

    // Réinitialiser la position y de la hitbox à sa position originale
    this.enemy.body.position.y = hitboxY;

    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.enemy.x,
      this.enemy.y,
      this.player.x,
      this.player.y
    );

    if (distanceToPlayer < 200 && this.health > 0 && !this.isDiving) {
      this.startDiveAttack();
    }
  }

  startDiveAttack() {
    console.log("Start dive attack triggered");

    this.isDiving = true;
    this.enemy.play("dive");
    console.log("Diving animation started");

    // Calculer l'angle vers le joueur
    const angle = Phaser.Math.Angle.Between(
      this.enemy.x,
      this.enemy.y,
      this.player.x,
      this.player.y
    );
    console.log(`Angle towards player: ${angle}`);

    // Ajuster l'orientation du corbeau en fonction de la direction de l'attaque
    this.enemy.setFlipX(Math.cos(angle) > 0);
    console.log(`Crow flipX set to: ${Math.cos(angle) > 0}`);

    // Lancer le mouvement de plongée vers le joueur
    console.log("Crow velocity before dive: ", this.enemy.body.velocity);
    this.scene.physics.velocityFromRotation(
      angle,
      200,
      this.enemy.body.velocity
    );
    console.log(
      "Crow is diving towards player with velocity:",
      this.enemy.body.velocity
    );

    // Lorsque l'attaque est terminée (après un délai ou une collision)
    this.scene.time.delayedCall(1000, () => {
      console.log("Dive attack finished, returning to initial position");

      // Retourner à la position initiale
      this.isDiving = false;
      this.enemy.play("fly");
      console.log("Flying animation restarted");

      this.scene.physics.moveTo(this.enemy, this.initialX, this.initialY, 100);
      console.log(
        "Crow moving back to initial position:",
        this.initialX,
        this.initialY
      );
    });
  }

  endDiveAttack() {
    console.log("End dive attack triggered");

    this.isDiving = false;
    this.enemy.play("fly");
    console.log("Flying animation restarted");

    this.enemy.setVelocity(0);
    console.log("Crow velocity reset to 0");

    this.initialY = this.enemy.y;
    console.log("Crow's initialY updated to:", this.initialY);

    this.distanceTraveled = 0; // Réinitialiser la distance parcourue
    console.log("Distance traveled reset to 0");
  }

  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play('hurtSound');
    this.lifePoints--; // Réduit la vie du joueur
    this.isInvincible = true; // Rend le joueur temporairement invincible
    this.updateHealthBar(); // Met à jour la barre de vie après avoir pris des dégâts
    if (this.lifePoints <= 0) {
        this.enemy.destroy(); // Appelle une méthode pour gérer la mort du joueur
        this.healthBar.destroy();
        return; // Sort de la méthode
    }
  
    this.blinkRed();
  
    // Remettre le joueur visible et stopper l'invincibilité après un certain temps
    this.scene.time.delayedCall(500, () => {
        this.isInvincible = false;
        if (this.enemy) {
            this.enemy.clearTint(); // Retirer la teinte rouge
        }
    }, [], this);
  }

  blinkRed() {
    if (!this.enemy) return; // Vérifiez si le joueur existe avant d'appliquer la teinte
  
    this.enemy.setTint(0xff0000); // Applique une teinte rouge
  
    // Utiliser un tween pour gérer le clignotement
    this.scene.tweens.add({
        targets: this.enemy,
        alpha: 1, // Réduire l'opacité à 0.5 au lieu de 0
        ease: 'Cubic.easeOut',
        duration: 100, // Durée d'une phase de clignotement
        repeat: 5, // Répéter 5 fois
        yoyo: true, // Alterner entre visible et invisible
        onComplete: () => {
            if (this.enemy) {
                this.enemy.clearTint(); // Retirer la teinte rouge une fois terminé
            }
        }
    });
  }
}
