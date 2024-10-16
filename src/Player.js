export class Player {
  constructor(scene, x, y, texture, calque_plateformes, platforms) {
    this.scene = scene; // Conserver une référence à la scène
    this.player = this.scene.physics.add.sprite(x, y, texture);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.flipX = false;
    this.isInvincible = false; // Variable pour gérer l'invincibilité temporaire après un coup
    this.blinkTimer = null; // Stocker le timer de clignotement

    this.scene.physics.add.collider(this.player, calque_plateformes);
    this.scene.physics.add.collider(this.player, platforms);

    this.clavier = this.scene.input.keyboard.createCursorKeys();
    this.nbSaut = 0;

    this.space = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyX = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z // Change 'Z' to 'X' for dash
    );

    this.attack = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X // Change 'Z' to 'X' for dash
    );

    this.hasDoubleJump = false;   
    this.canUseDash = false; // Le dash n'est pas disponible au début

    // Variables pour le dash
    this.canAttack = false;
    this.hasDiamondHeart = false;
    this.isDashing = false;
    this.dashSpeed = 500;
    this.dashTime = 150; // Durée du dash en ms
    this.dashCooldown = 500; // Cooldown avant de pouvoir re-dasher
    this.isMoving = false; // Variable pour suivre si le joueur est en mouvement

    this.lifePoints = 5; // Par exemple 5 vies

    // Initialisation des animations
    this.Animations();
  }
//---------------------------------------------------------------------------------
// Fonction pour faire clignoter le joueur et réduire les points de vie
takeDamage() {
  if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
  this.scene.sound.play('hurtSound');
  this.lifePoints--; // Réduit la vie du joueur
  this.isInvincible = true; // Rend le joueur temporairement invincible
  this.scene.updateLifeDisplay(); // Mets à jour l'interface des vies
  if (this.lifePoints <= 0) {
      this.die(); // Appelle une méthode pour gérer la mort du joueur
      return; // Sort de la méthode
  }

  this.blinkRed();

  // Remettre le joueur visible et stopper l'invincibilité après un certain temps
  this.scene.time.delayedCall(1000, () => {
      this.isInvincible = false;
      if (this.player) {
          this.player.clearTint(); // Retirer la teinte rouge
      }
  }, [], this);
}

die() {
    if (this.player) {
        this.player.body.setEnable(false); // Désactiver la physique
        this.player.setVisible(false); // Rendre le joueur invisible
        this.player.destroy(); // Détruit le joueur quand il n'a plus de vie
        this.player = null; // Assurez-vous que this.player est null
        this.scene.scene.get("MapScene").mapMusic.stop();
        this.scene.scene.stop("MapScene");
        this.scene.scene.start("GameOver"); // Rediriger vers le menu
    }
}

blinkRed() {
  if (!this.player) return; // Vérifiez si le joueur existe avant d'appliquer la teinte

  this.player.setTint(0xff0000); // Applique une teinte rouge

  // Utiliser un tween pour gérer le clignotement
  this.scene.tweens.add({
      targets: this.player,
      alpha: 1, // Réduire l'opacité à 0.5 au lieu de 0
      ease: 'Cubic.easeOut',
      duration: 100, // Durée d'une phase de clignotement
      repeat: 5, // Répéter 5 fois
      yoyo: true, // Alterner entre visible et invisible
      onComplete: () => {
          if (this.player) {
              this.player.clearTint(); // Retirer la teinte rouge une fois terminé
          }
      }
  });
}





//---------------------------------------------------------------------------------

  Animations() {
    // Animation droite
    this.scene.anims.create({
      key: "anim_tourne_droite",
      frames: this.scene.anims.generateFrameNumbers("player_marche", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation gauche
    this.scene.anims.create({
      key: "anim_tourne_gauche",
      frames: this.scene.anims.generateFrameNumbers("player_marche", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation face
    this.scene.anims.create({
      key: "anim_face",
      frames: this.scene.anims.generateFrameNumbers("player_debout", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation pour se baisser
    this.scene.anims.create({
      key: "anim_baisser",
      frames: this.scene.anims.generateFrameNumbers("player_crouch", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation saut
    this.scene.anims.create({
      key: "anim_saut",
      frames: this.scene.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation dash
    this.scene.anims.create({
      key: "anim_dash",
      frames: this.scene.anims.generateFrameNumbers("player_dash", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Animation dash
    this.scene.anims.create({
      key: "anim_attaque",
      frames: this.scene.anims.generateFrameNumbers("player_attack", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  update() {
    if (!this.player) return;
    
    // Réinitialiser la taille et l'offset de la hitbox à chaque mise à jour
    this.player.body.setSize(34, 60);
    this.player.body.setOffset(16, 0);
  
    // Appeler les fonctions pour gérer le mouvement et les actions
    this.AnimMouvement();
    this.Saut();
    this.AnimDash();
    this.AnimAttaque(); // Gérer l'attaque ici
  }

  collectSword() {
    this.scene.sound.play('objectSound');
    this.canAttack = true;
  }

  AnimAttaque() {
    if (Phaser.Input.Keyboard.JustDown(this.attack)) {
      // Lancer l'animation d'attaque
      this.player.anims.play("anim_attaque", true);
      this.scene.sound.play('attackSound'); // Jouer le son d'attaque
  
    // Créer une hitbox temporaire pour l'attaque
    let hitbox = this.scene.add.rectangle(
      this.player.x + (this.player.flipX ? -30 : 30), // Position ajustée selon la direction du joueur
      this.player.y,
      50, // Largeur de la hitbox
      50, // Hauteur de la hitbox
      0xff0000, // Couleur rouge pour visualiser la hitbox (peut être caché plus tard)
      0 // Opacité de 0 (invisible)
    );
    
    // Activer la physique sur la hitbox
    this.scene.physics.add.existing(hitbox);
    hitbox.body.setAllowGravity(false); // La hitbox ne doit pas être affectée par la gravité

    // Détection des collisions avec les ennemis
    this.scene.physics.add.overlap(hitbox, this.scene.enemies, (hitbox, enemySprite) => {
      if (enemySprite.instance) {
        enemySprite.instance.takeDamage(); // Appelle la méthode de l'instance complète
      } else {
        console.warn("L'ennemi n'a pas d'instance associée :", enemySprite);
      }
    });

    // Détruire la hitbox après un court délai pour simuler un coup rapide
    this.scene.time.delayedCall(200, () => {
      hitbox.destroy(); // Supprimer la hitbox après l'attaque
    });
    }
  }

// Ajoutez cette variable dans le constructeur

AnimMouvement() {
  if (
    this.player.anims.currentAnim &&
    this.player.anims.currentAnim.key === "anim_attaque" &&
    this.player.anims.isPlaying
  ) {
    return; // On sort de la fonction si l'attaque est en cours
  }

  // Gérer le mouvement du joueur sur l'axe horizontal
  if (this.clavier.down.isDown && this.player.body.blocked.down) {
    // Si la flèche du bas est enfoncée et que le joueur est au sol
    this.player.body.setSize(34, 30);
    this.player.body.setOffset(16, 30);

    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-80); // Déplacement vers la gauche, vitesse réduite
      this.player.flipX = true; // Miroir du sprite vers la gauche
      this.player.anims.play("anim_baisser", true); // Jouer l'animation de se baisser
      this.playFootstepSound(); // Jouer le son de pas
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(80); // Déplacement vers la droite, vitesse réduite
      this.player.flipX = false; // Normal (pas de miroir)
      this.player.anims.play("anim_baisser", true); // Jouer l'animation de se baisser
      this.playFootstepSound(); // Jouer le son de pas
    } else {
      this.player.setVelocityX(0); // Si seulement la flèche du bas est enfoncée, on reste immobile
      this.player.anims.play("anim_baisser", true); // Jouer l'animation de se baisser
    }
  } else {
    // Gestion normale du mouvement si la flèche du bas n'est pas enfoncée

    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160); // Vitesse vers la gauche
      this.player.flipX = true; // Miroir du sprite vers la gauche

      // Si le joueur est en l'air, jouer l'animation de saut
      if (!this.player.body.blocked.down) {
        this.player.anims.play("anim_saut", true);
      } else {
        this.player.anims.play("anim_tourne_gauche", true); // Jouer l'animation de marche gauche
      }
      this.playFootstepSound(); // Jouer le son de pas
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160); // Vitesse vers la droite
      this.player.flipX = false; // Normal

      // Si le joueur est en l'air, jouer l'animation de saut
      if (!this.player.body.blocked.down) {
        this.player.anims.play("anim_saut", true);
      } else {
        this.player.anims.play("anim_tourne_droite", true); // Jouer l'animation de marche droite
      }
      this.playFootstepSound(); // Jouer le son de pas
    } else {
      this.player.setVelocityX(0); // Arrêter le mouvement

      // Si le joueur est au sol, jouer l'animation de face, sinon jouer l'animation de saut
      if (this.player.body.blocked.down) {
        this.player.anims.play("anim_face", true); // Jouer l'animation face
      } else {
        this.player.anims.play("anim_saut", true); // Jouer l'animation de saut
      }
    }
  }
}

playFootstepSound() {
  if (this.player.body.blocked.down && !this.isMoving && (this.clavier.left.isDown || this.clavier.right.isDown)) {
    this.isMoving = true; // Le joueur est maintenant en mouvement
    this.scene.sound.play('stepSound'); // Jouer le son de pas

    // Arrêter le son après un court délai pour éviter les répétitions
    this.scene.time.delayedCall(700, () => {
      this.isMoving = false; // Le joueur n'est plus en mouvement après un court délai
    });
  } else if (!this.clavier.left.isDown && !this.clavier.right.isDown) {
    this.isMoving = false; // Le joueur n'est plus en mouvement
  }
}

collectBoots() {
  this.scene.sound.play('objectSound');
  this.hasDoubleJump = true; // Active le double saut
}


  Saut() {
    // Vérifie si le joueur est au sol pour réinitialiser les sauts
    if (this.player.body.blocked.down) {
      this.nbSaut = 0; // Réinitialiser le compteur de saut
    }

    // Gérer le saut avec un seul appui détecté
    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      // Assurez-vous que le joueur est au sol ou qu'il a encore un double saut
      if (this.nbSaut < 1) {
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.player.anims.play("anim_saut", true);
        this.scene.sound.play('jumpSound'); // Jouer le son de saut
      } else if (this.nbSaut === 1 && this.hasDoubleJump) {
        // Double saut
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.doubleSaut = false; // Désactiver le double saut
        this.player.anims.play("anim_saut", true); // Jouer l'animation de saut
        this.doubleSaut = false;
        this.player.anims.play("anim_saut", true);
        this.scene.sound.play('jumpSound'); // Jouer le son de saut
      }
    }
  }

  collectDash() {
    this.scene.sound.play('objectSound');
    this.canUseDash = true; // Active le dash
  }

  AnimDash() {
    if (this.isDashing) {
      this.player.setVelocityX(this.dashSpeed * (this.player.flipX ? -1 : 1)); // Vitesse de dash
      this.player.anims.play("anim_dash", true); // Jouer animation dash
      this.scene.time.delayedCall(this.dashTime, () => {
        this.isDashing = false;
        this.player.setVelocityX(0); // Arrêter le dash
      });
    } else if (this.keyX.isDown && this.canUseDash) {
      this.isDashing = true;
      this.scene.sound.play('dashSound'); // Jouer le son de saut
      this.canUseDash = false;
      this.scene.time.delayedCall(this.dashCooldown, () => {
        this.canUseDash = true; // Réactiver le dash après le cooldown
      });
    }
  }

  onScaleOverlap(calque_echelle) {
    // Obtenir la tuile en dessous du joueur
    const tile = calque_echelle.getTileAtWorldXY(this.player.x, this.player.y);
  
    // Vérifier si la tuile a la propriété "estEchelle"
    if (tile && tile.properties.estEchelle) {
      // Si la tuile est une échelle, autoriser le mouvement vertical
      if (this.clavier.up.isDown) {
        this.player.setVelocityY(-150); // Monter
      } else if (this.clavier.down.isDown) {
        this.player.setVelocityY(150); // Descendre
      } else {
        this.player.setVelocityY(0); // Arrêter le mouvement vertical
      }
    } else {
    }
  }

  collectHeart() {
    this.scene.sound.play('objectSound');
    this.lifePoints++;
    this.scene.updateLifeDisplay(); // Mets à jour l'interface des vies
  }

  collectDiamondHeart() {
    this.hasDiamondHeart = true;
    this.scene.sound.play('objectSound');
    this.lifePoints = 10;
    this.scene.updateLifeDisplay(); // Mets à jour l'interface des vies
  }
}
