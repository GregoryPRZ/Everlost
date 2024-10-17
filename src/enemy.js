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

  // Crée un capteur juste devant le Blob pour détecter un mur
  const sensorX = this.enemy.x + (this.direction * 20); // 20 pixels devant l'ennemi
  const sensorY = this.enemy.y; // À la même hauteur que l'ennemi

  // Vérifie s'il y a un mur devant le Blob
  const tileAtFront = this.scene.calque_plateformes.getTileAtWorldXY(sensorX, sensorY);

  // Si un mur est détecté devant, changer de direction
  if (tileAtFront) {
      console.log("Mur détecté, changement de direction !");
      this.direction *= -1; // Change la direction
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
    this.scene.enemyBullets.add(bullet); // Ajouter la balle au groupe enemyBullets

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

    this.healthBar = this.scene.add.graphics();
  
    // Propriétés pour le tir
    this.shootCooldown = 2000; // Délai entre les tirs en millisecondes
    this.lastShotTime = 0; // Dernière fois où la plante a tiré

    this.updateHealthBar();
    this.setupAnimations();
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
      frameRate: 30,
      repeat: 0, // L'animation ne se joue qu'une seule fois
    });

    // Lancer l'animation "idle" par défaut
    this.enemy.play("idle");
  }

  update() {
    if (!this.scene.player.player) return; // Assurez-vous que le joueur existe
    this.enemy.flipX = this.scene.player.player.x > this.enemy.x; // Si le joueur est à gauche, flipX = true

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

  shoot() {
    this.scene.sound.play('poisonSound'); // Jouer le son d'attaque
    this.enemy.play("attack", true);
    // Créer une balle à la position actuelle du joueur
    const bullet = this.scene.physics.add.sprite(this.enemy.x, this.enemy.y - 10, 'bullet');
    this.scene.enemyBullets.add(bullet); // Ajouter la balle au groupe enemyBullets

  // Vérifier la direction du joueur et ajuster la vitesse de la balle
  const direction = this.enemy.flipX ? 1 : -1; // Si le joueur est orienté à gauche, la balle va à gauche

  bullet.startX = this.enemy.x;
  const maxDistance = 300; // Distance maximale que la balle peut parcourir (ajuster selon besoin)

  bullet.setVelocityX(200 * direction); // Vitesse de la balle (600 peut être ajusté)
  
  // Assurer que la balle ne soit pas affectée par la gravité
  bullet.body.setAllowGravity(false);

  // Détruire la balle lorsqu'elle sort des limites du monde
  bullet.setCollideWorldBounds(true);
  bullet.body.onWorldBounds = true;
  bullet.body.world.on('worldbounds', () => {
    bullet.destroy(); // Supprimer la balle lorsqu'elle sort du cadre
  });

  // Ajouter une fonction de mise à jour pour vérifier la distance parcourue
  bullet.update = () => {
    const distanceTravelled = Math.abs(bullet.x - bullet.startX);
    if (distanceTravelled > maxDistance) {
      bullet.destroy(); // Détruire la balle si elle dépasse la distance maximale
    }
  };

  this.scene.physics.world.on('worldstep', () => {
    if (bullet.active) {
      bullet.update();
    }
  });


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

  // Désactiver toute interaction physique (poussée) entre la balle et l'ennemi
  bullet.body.setImmovable(true); // La balle ne bouge pas lorsqu'elle touche un ennemi
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
    this.enemy.setImmovable(true);
    this.enemy.body.setSize(32, 32);
    this.enemy.body.setOffset(12, 20);
    this.enemy.body.allowGravity = false; // Pas de gravité
    console.log("Gravité activée : ", this.enemy.body.allowGravity);

    this.speed = 200; // Vitesse de déplacement horizontal
    this.initialX = x;
    this.initialY = y; // Position Y initiale
    this.direction = 1; // Le corbeau commence en allant vers la droite
    this.enemy.setFlipX(false); // Orientation initiale

    this.healthBar = this.scene.add.graphics();
    this.updateHealthBar();
    this.setupAnimations();

    this.leftLimit = x - 250; // Limite gauche
    this.rightLimit = x + 250; // Limite droite
  }

  updateHealthBar() {
    this.healthBar.clear(); // Efface l'ancienne barre
    const width = 50; // Largeur de la barre de vie
    const height = 5; // Hauteur de la barre de vie
    const healthPercentage = this.lifePoints / 2; // Supposons que 2 est le maximum de points de vie

    // Dessine le fond de la barre de vie
    this.healthBar.fillStyle(0x000000, 1); // Couleur noire pour le fond
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width, height);

    // Dessine la barre de vie
    this.healthBar.fillStyle(0xff0000, 1); // Couleur rouge pour la vie
    this.healthBar.fillRect(this.enemy.x - width / 2, this.enemy.y - 20, width * healthPercentage, height);
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
    this.enemy.play("fly");
  }


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
        this.enemy.setFlipX(false); // Remet à l'échelle normale pour aller à droite
    } else {
        this.enemy.setFlipX(true); // Inverse l'échelle pour tourner l'ennemi vers la gauche
    }
  }

  update() {
    this.move();
    this.updateHealthBar(); // Mettre à jour la barre de vie à chaque frame

    // Crée un capteur juste devant le Blob pour détecter un mur
    const sensorX = this.enemy.x + (this.direction * 20); // 20 pixels devant l'ennemi
    const sensorY = this.enemy.y; // À la même hauteur que l'ennemi

    // Vérifie s'il y a un mur devant le Blob
    const tileAtFront = this.scene.calque_plateformes.getTileAtWorldXY(sensorX, sensorY);

    // Si un mur est détecté devant, changer de direction
    if (tileAtFront) {
        console.log("Mur détecté, changement de direction !");
        this.direction *= -1; // Change la direction
    }

    this.enemy.y = this.initialY;
    this.enemy.setVelocityY(0); // Empêche tout mouvement vertical
  }

  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play('hurtSound');
    this.lifePoints--; // Réduit la vie du corbeau
    this.isInvincible = true; // Rend le corbeau temporairement invincible
    this.updateHealthBar(); // Met à jour la barre de vie après avoir pris des dégâts
    if (this.lifePoints <= 0) {
      this.enemy.destroy(); // Supprime le corbeau lorsqu'il meurt
      this.healthBar.destroy();
      return;
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
    if (!this.enemy) return; // Vérifiez que le corbeau existe

    this.enemy.setTint(0xff0000); // Applique une teinte rouge

    // Utilise un tween pour gérer le clignotement
    this.scene.tweens.add({
      targets: this.enemy,
      alpha: 1,
      ease: 'Cubic.easeOut',
      duration: 100,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        if (this.enemy) {
          this.enemy.clearTint(); // Retirer la teinte rouge une fois terminé
        }
      }
    });
  }
}
