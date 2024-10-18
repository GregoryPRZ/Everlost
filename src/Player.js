export class Player {
  constructor(scene, x, y, texture, calque_plateformes, platforms) {
    this.scene = scene; // Conserver une référence à la scène
    this.player = this.scene.physics.add.sprite(x, y, texture);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.flipX = false;
    this.isInvincible = false; // Variable pour gérer l'invincibilité temporaire après un coup
    this.blinkTimer = null; // Stocker le timer de clignotement
    this.shootCooldown = 200; // Délai entre les tirs en millisecondes
    this.lastShootTime = 0; // Dernier tir du joueur

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

    this.hasTripleJump = false;
    this.canUseDash = false; // Le dash n'est pas disponible au début

    // Variables pour le dash
    this.canShoot = false;
    this.canAttack = false;
    this.canAttackAgain = true;
    this.hasDiamondHeart = false;
    this.isDashing = false;
    this.dashSpeed = 500;
    this.dashTime = 150; // Durée du dash en ms
    this.dashCooldown = 500; // Cooldown avant de pouvoir re-dasher
    this.isMoving = false; // Variable pour suivre si le joueur est en mouvement

    // Créer la barre de progression
    this.cooldownBar = this.scene.add.graphics();
    this.cooldownBar.setDepth(10); // S'assurer que la barre soit visible au-dessus des autres éléments

    this.barWidth = 50; // Largeur de la barre
    this.barHeight = 5; // Hauteur de la barre
    this.cooldownPercentage = 0; // Initialement, la barre est vide

    this.lifePoints = 5; // Par exemple 5 vies

    // Initialisation des animations
    this.Animations();
  }
  //---------------------------------------------------------------------------------
  // Fonction pour faire clignoter le joueur et réduire les points de vie
  takeDamage() {
    if (this.isInvincible) return; // Évite que le joueur prenne plusieurs coups rapidement
    this.scene.sound.play("hurtSound");
    this.lifePoints--; // Réduit la vie du joueur
    this.isInvincible = true; // Rend le joueur temporairement invincible
    this.scene.updateLifeDisplay(); // Mets à jour l'interface des vies
    if (this.lifePoints <= 0) {
      this.die(); // Appelle une méthode pour gérer la mort du joueur
      return; // Sort de la méthode
    }

    this.blinkRed();

    // Remettre le joueur visible et stopper l'invincibilité après un certain temps
    this.scene.time.delayedCall(
      1000,
      () => {
        this.isInvincible = false;
        if (this.player) {
          this.player.clearTint(); // Retirer la teinte rouge
        }
      },
      [],
      this
    );
  }

  die() {
    if (this.player) {
      // Arrêter l'intervalle si le joueur meurt
      if (this.timerInterval) {
        clearInterval(this.timerInterval); // Arrête le timer
      }
      this.player.body.setEnable(false); // Désactiver la physique
      this.player.setVisible(false); // Rendre le joueur invisible
      this.player.body.destroy(); // Détruit le joueur quand il n'a plus de vie
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
      ease: "Cubic.easeOut",
      duration: 100, // Durée d'une phase de clignotement
      repeat: 5, // Répéter 5 fois
      yoyo: true, // Alterner entre visible et invisible
      onComplete: () => {
        if (this.player) {
          this.player.clearTint(); // Retirer la teinte rouge une fois terminé
        }
      },
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
      frameRate: 30,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "player_bullet_animation",
      frames: this.scene.anims.generateFrameNumbers("player_bullet", {
        start: 0,
        end: 3,
      }), // Ajuste le start et end selon tes frames
      frameRate: 10,
      repeat: -1, // Boucle indéfiniment
    });
  }

  update() {
    if (!this.player) return;

    if (
      !this.player.anims.currentAnim ||
      this.player.anims.currentAnim.key !== "anim_attaque"
    ) {
      this.player.body.setSize(34, 60);
      this.player.body.setOffset(16, 0);
    }

    // Appeler les fonctions pour gérer le mouvement et les actions
    this.AnimMouvement();
    this.Saut();
    this.AnimDash();
    this.AnimAttaque(); // Gérer l'attaque ici
  }

  collectSword() {
    this.scene.sound.play("objectSound");
    this.canAttack = true;
    this.scene.updateSwordUI(); // Met à jour l'affichage des bottes
    this.scene.showNotification(
      "Vous avez trouvé une épée ! Appuyez sur X pour attaquer les ennemis."
    );
  }

  collectDreamSword() {
    this.scene.sound.play("objectSound");
    this.canShoot = true;
    this.scene.updateDreamSwordUI(); // Met à jour l'affichage des bottes
    this.scene.showNotification(
      "Vous avez trouvé l'épée des rêves ! Appuyez sur X pour tirer sur les ennemis et drainer leur vie."
    );
  }

  AnimAttaque() {
    if (
      Phaser.Input.Keyboard.JustDown(this.attack) &&
      this.canAttack &&
      this.canAttackAgain
    ) {
      this.canAttackAgain = false;
      this.cooldownBar.visible = true; // Rendre la barre visible quand l'attaque est déclenchée
      this.player.body.setSize(46, 60); // Taille de la hitbox d'attaque
      this.player.body.setOffset(16, 0); // Ajuster l'offset si nécessaire
      if (
        this.canShoot &&
        this.scene.time.now > this.lastShootTime + this.shootCooldown
      ) {
        this.shoot(); // Appelle la méthode de tir
        this.canAttackAgain = true;
        this.lastShootTime = this.scene.time.now; // Mettre à jour le temps du dernier tir
      } else {
        this.player.anims.play("anim_attaque", true);
        this.scene.sound.play("attackSound"); // Jouer le son d'attaque

        let hitbox = this.scene.add.rectangle(
          this.player.x + (this.player.flipX ? -50 : 50), // Ajuste la position selon la direction du joueur
          this.player.y,
          100, // Largeur de la hitbox
          40, // Hauteur de la hitbox
          0xff0000, // Couleur rouge pour visualiser la hitbox
          0 // Opacité de 0 (invisible)
        );

        // Activer la physique sur la hitbox
        this.scene.physics.add.existing(hitbox);
        hitbox.body.setAllowGravity(false); // La hitbox ne doit pas être affectée par la gravité

        // Ajouter l'overlap entre la hitbox et les balles des ennemis
        this.scene.physics.add.overlap(
          hitbox,
          this.scene.enemyBullets,
          (hitbox, bullet) => {
            bullet.destroy(); // Détruire la balle si elle touche la hitbox d'attaque
          }
        );

        // Détection des collisions avec les ennemis
        this.scene.physics.add.overlap(
          hitbox,
          this.scene.enemies,
          (hitbox, enemySprite) => {
            if (enemySprite.instance) {
              enemySprite.instance.takeDamage(); // Appelle la méthode de l'instance complète
            } else {
              console.warn(
                "L'ennemi n'a pas d'instance associée :",
                enemySprite
              );
            }
          }
        );

        // Gérer les **collisions** avec les plateformes pour empêcher la hitbox de traverser
        this.scene.physics.add.collider(
          hitbox,
          this.scene.platforms,
          (hitbox, platforms) => {
            console.log("Hitbox en collision avec une plateforme");
            // Logique à implémenter si nécessaire (comme des effets ou rebonds)
          }
        );

        // Gérer les **collisions** avec le calque de plateformes (si c'est un TilemapLayer)
        this.scene.physics.add.collider(
          hitbox,
          this.scene.calque_plateformes,
          (hitbox, calque_plateformes) => {
            console.log(
              "Hitbox en collision avec une tuile du calque plateformes"
            );
            // Logique supplémentaire si nécessaire
          }
        );

        // Détruire la hitbox après un court délai pour simuler un coup rapide
        this.scene.time.delayedCall(250, () => {
          hitbox.destroy(); // Supprimer la hitbox après l'attaque
        });

        // Activer le cooldown de l'attaque avec une barre de progression
        let cooldownDuration = 250; // Durée totale du cooldown
        let elapsed = 0;


        // Gestion du cooldown via un événement répété
        const cooldownEvent = this.scene.time.addEvent({
          delay: 50,
          repeat: cooldownDuration / 50 - 1, // Répéter le nombre de fois requis pour la durée complète
          callback: () => {
            elapsed += 50;
            let percentage = elapsed / cooldownDuration;
            this.updateCooldownBar(percentage);
          
            if (percentage >= 1) {
              this.canAttackAgain = true;
              this.updateCooldownBar(0); // Réinitialiser la barre de progression
              this.cooldownBar.visible = false; // Cacher la barre après le cooldown
              cooldownEvent.remove(); // Stopper l'événement pour éviter des appels répétés
            }
          },
        });
      }
    }
  }

  shoot() {
    if (!this.canShoot) return; // Vérifier si le joueur peut tirer (après avoir collecté l'épée)
    this.cooldownBar.visible = false; // Cacher la barre après le cooldown
    this.scene.sound.play("shootSound"); // Jouer le son d'attaque
    this.player.anims.play("anim_attaque", true);

    // Créer une balle à la position actuelle du joueur
    const bullet = this.scene.physics.add.sprite(
      this.player.x,
      this.player.y,
      "player_bullet"
    );

    bullet.anims.play("player_bullet_animation");

    // Vérifier la direction du joueur et ajuster la vitesse de la balle
    const direction = this.player.flipX ? -1 : 1; // Si le joueur est orienté à gauche, la balle va à gauche

    bullet.startX = this.player.x;
    const maxDistance = 500; // Distance maximale que la balle peut parcourir (ajuster selon besoin)

    // Diminuer la vitesse de la balle (ex : 400 au lieu de 600)
    bullet.setVelocityX(400 * direction); // Vitesse de la balle ajustée

    // Assurer que la balle ne soit pas affectée par la gravité
    bullet.body.setAllowGravity(false);

    // Détruire la balle lorsqu'elle sort des limites du monde
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
    bullet.body.world.on("worldbounds", () => {
      bullet.destroy(); // Supprimer la balle lorsqu'elle sort du cadre
    });

    // Ajouter une fonction de mise à jour pour vérifier la distance parcourue
    bullet.update = () => {
      const distanceTravelled = Math.abs(bullet.x - bullet.startX);
      if (distanceTravelled > maxDistance) {
        bullet.destroy(); // Détruire la balle si elle dépasse la distance maximale
      }
    };

    this.scene.physics.world.on("worldstep", () => {
      if (bullet.active) {
        bullet.update();
      }
    });

    // Gérer la collision entre la balle et les ennemis, mais sans les repousser
    this.scene.physics.add.overlap(
      bullet,
      this.scene.enemies,
      (bullet, enemySprite) => {
        if (enemySprite.instance) {
          enemySprite.instance.takeDamage(); // L'ennemi subit des dégâts
          bullet.destroy(); // Détruire la balle après l'impact
          this.gainLife();
        }
      }
    );

    // Détecter la collision entre la balle et le calque des plateformes
    this.scene.physics.add.collider(
      bullet,
      this.scene.calque_plateformes,
      () => {
        bullet.destroy(); // Détruire la balle lorsqu'elle touche une plateforme
      }
    );

    // Désactiver toute interaction physique (poussée) entre la balle et l'ennemi
    bullet.body.setImmovable(true); // La balle ne bouge pas lorsqu'elle touche un ennemi

    // Désactiver le tir pendant 3 secondes
    this.canShoot = false; // Désactiver le tir
    this.scene.time.delayedCall(1500, () => {
      this.canShoot = true; // Réactiver le tir après 3 secondes
    });
  }

  gainLife() {
    // Limiter le nombre de points de vie à un maximum de 5 (ou autre limite)
    if (this.lifePoints < 5) {
      this.lifePoints++;
      this.scene.updateLifeDisplay(); // Mettre à jour l'affichage des points de vie
    }
  }

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
      // Vérifier s'il y a une plateforme juste au-dessus du joueur
      const headTile = this.scene.calque_plateformes.getTileAtWorldXY(
        this.player.x, // Position du joueur
        this.player.y - this.player.height / 2 // Vérifier juste au-dessus de la tête du joueur
      );

      // Ne permettre au joueur de se relever que s'il n'y a pas de plateforme solide au-dessus
      if (
        !this.clavier.down.isDown &&
        (!headTile || !headTile.properties.estSolide)
      ) {
        this.player.body.setSize(34, 60); // Taille normale debout
        this.player.body.setOffset(16, 0);
      }

      // Ne relever le joueur que s'il n'y a pas de tuile solide au-dessus
      if (!headTile) {
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
  }

  playFootstepSound() {
    if (
      this.player.body.blocked.down &&
      !this.isMoving &&
      (this.clavier.left.isDown || this.clavier.right.isDown)
    ) {
      this.isMoving = true; // Le joueur est maintenant en mouvement
      this.scene.sound.play("stepSound"); // Jouer le son de pas

      // Arrêter le son après un court délai pour éviter les répétitions
      this.scene.time.delayedCall(700, () => {
        this.isMoving = false; // Le joueur n'est plus en mouvement après un court délai
      });
    } else if (!this.clavier.left.isDown && !this.clavier.right.isDown) {
      this.isMoving = false; // Le joueur n'est plus en mouvement
    }
  }

  collectBoots() {
    this.scene.sound.play("objectSound");
    this.hasTripleJump = true; // Active le double saut
    this.scene.updateBootsUI(); // Met à jour l'affichage des bottes
    this.scene.showNotification(
      "Vous avez trouvé les bottes dorées ! Appuyez trois fois sur ESPACE pour effectuer un triple saut."
    );
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
        this.scene.sound.play("jumpSound"); // Jouer le son de saut
      } else if (this.nbSaut === 1 && this.hasTripleJump) {
        // Double saut
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.player.anims.play("anim_saut", true); // Jouer l'animation de saut
        this.player.anims.play("anim_saut", true);
        this.scene.sound.play("jumpSound"); // Jouer le son de saut
      } else if (this.nbSaut === 2 && this.hasTripleJump) {
        // Double saut
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.player.anims.play("anim_saut", true); // Jouer l'animation de saut
        this.tripleSaut = false;
        this.player.anims.play("anim_saut", true);
        this.scene.sound.play("jumpSound"); // Jouer le son de saut
      }
    }
  }

  collectDash() {
    this.scene.sound.play("objectSound");
    this.canUseDash = true; // Active le dash
    this.scene.updateDashUI(); // Met à jour l'affichage des bottes
    this.scene.showNotification(
      "Vous avez trouvé le badge d'accélération ! Appuyez sur Z pour effectuer une ruée."
    );
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
      this.canUseDash = false;
      this.isDashing = true;
      this.cooldownBar.visible = true; // Rendre la barre visible quand l'attaque est déclenchée
      this.scene.sound.play("dashSound"); // Jouer le son de saut

      // Activer le cooldown du dash avec une barre de progression
      let cooldownDuration = this.dashCooldown;
      let elapsed = 0;

    // Gestion du cooldown via un événement répété
    const cooldownEvent = this.scene.time.addEvent({
      delay: 50,
      repeat: cooldownDuration / 50 - 1, // Répéter le nombre de fois requis pour la durée complète
      callback: () => {
        elapsed += 50;
        let percentage = elapsed / cooldownDuration;
        this.updateCooldownBar(percentage);

        if (percentage >= 1) {
          this.canUseDash = true;
          this.updateCooldownBar(0); // Réinitialiser la barre de progression
          this.cooldownBar.visible = false; // Cacher la barre après le cooldown
          cooldownEvent.remove(); // Stopper l'événement pour éviter des appels répétés
        }
      },
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
    this.scene.sound.play("objectSound");
    if (this.lifePoints < 5) {
      this.lifePoints++;
      this.scene.updateLifeDisplay(); // Mettre à jour l'affichage des points de vie
    }
  }

  collectDiamondHeart() {
    this.hasDiamondHeart = true;
    this.scene.sound.play("objectSound");
    if (this.lifePoints < 5) {
      this.lifePoints++;
      this.scene.updateLifeDisplay(); // Mettre à jour l'affichage des points de vie
    }
    this.scene.updateDiamondHeartUI(); // Met à jour l'affichage des bottes
    this.scene.showNotification(
      "Vous avez trouvé le coeur de diamant ! Vous ressentez comme une sensation étrange..."
    );

    // Arrêter le timer et masquer le texte
    if (this.scene.timerInterval) {
      clearInterval(this.scene.timerInterval); // Arrêter le timer
    }
    this.scene.timerText.setText(''); // Effacer le texte du timer
  }

  updateCooldownBar(percentage) {
    this.cooldownBar.clear(); // Efface l'ancienne barre

    // Position de la barre par rapport au joueur (au-dessus de sa tête)
    const barX = this.player.x - this.barWidth / 2;
    const barY = this.player.y - this.player.height / 2 - 10;

    // Fond de la barre (noir)
    this.cooldownBar.fillStyle(0x000000, 1);
    this.cooldownBar.fillRect(barX, barY, this.barWidth, this.barHeight);

    // Remplissage de la barre (rouge)
    this.cooldownBar.fillStyle(0x00ff00, 1);
    this.cooldownBar.fillRect(barX, barY, this.barWidth * percentage, this.barHeight);

    // Masquer la barre une fois pleine
    if (percentage >= 1) {
      this.cooldownBar.visible = false; // Rendre la barre invisible
    }
  }
}
