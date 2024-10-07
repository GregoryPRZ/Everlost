export class Player {
  constructor(scene, x, y, texture, calque_plateformes, platforms) {
    this.scene = scene; // Conserver une référence à la scène
    this.player = this.scene.physics.add.sprite(x, y, texture);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.flipX = false;

    this.scene.physics.add.collider(this.player, calque_plateformes);
    this.scene.physics.add.collider(this.player, platforms);

    this.clavier = this.scene.input.keyboard.createCursorKeys();
    this.nbSaut = 0;
    this.doubleSaut = true;

    this.space = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyX = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z // Change 'Z' to 'X' for dash
    );

    this.attack = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X // Change 'Z' to 'X' for dash
    );

    // Variables pour le dash
    this.isDashing = false;
    this.dashSpeed = 500;
    this.dashTime = 150; // Durée du dash en ms
    this.dashCooldown = 500; // Cooldown avant de pouvoir re-dasher
    this.canDash = true; // Contrôle du dash

    // Initialisation des animations
    this.Animations();
  }

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
        end: 6,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  update() {
    // Réinitialiser la taille et l'offset de la hitbox à chaque mise à jour
    this.player.body.setSize(34, 60);
    this.player.body.setOffset(16, 0);

    // Appeler les fonctions pour gérer le mouvement, le dash et le saut
    this.AnimMouvement();
    this.AnimDash();
    this.Saut();
    this.AnimAttaque();
  }

  AnimAttaque() {
    if (Phaser.Input.Keyboard.JustDown(this.attack)) {
      // Lancer l'animation d'attaque
      this.player.anims.play("anim_attaque", true);

      // Vérifier dans quelle direction le joueur est orienté (gauche ou droite)
      if (this.player.flipX) {
        this.player.setVelocityX(-200);
      } else {
        this.player.setVelocityX(200);
      }
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
      } else if (this.clavier.right.isDown) {
        this.player.setVelocityX(80); // Déplacement vers la droite, vitesse réduite
        this.player.flipX = false; // Normal (pas de miroir)
        this.player.anims.play("anim_baisser", true); // Jouer l'animation de se baisser
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
      } else if (this.clavier.right.isDown) {
        this.player.setVelocityX(160); // Vitesse vers la droite
        this.player.flipX = false; // Normal

        // Si le joueur est en l'air, jouer l'animation de saut
        if (!this.player.body.blocked.down) {
          this.player.anims.play("anim_saut", true);
        } else {
          this.player.anims.play("anim_tourne_droite", true); // Jouer l'animation de marche droite
        }
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

  Saut() {
    // Vérifie si le joueur est au sol pour réinitialiser les sauts
    if (this.player.body.blocked.down) {
      this.nbSaut = 0; // Réinitialiser le compteur de saut
      this.doubleSaut = true; // Réactiver le double saut
      this.nbSaut = 0;
      this.doubleSaut = true;
    }

    // Gérer le saut avec un seul appui détecté
    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      // Assurez-vous que le joueur est au sol ou qu'il a encore un double saut
      if (this.nbSaut < 1) {
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.player.anims.play("anim_saut", true);
      } else if (this.nbSaut === 1 && this.doubleSaut) {
        // Double saut
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.doubleSaut = false; // Désactiver le double saut
        this.player.anims.play("anim_saut", true); // Jouer l'animation de saut
        this.doubleSaut = false;
        this.player.anims.play("anim_saut", true);
      }
    }
  }

  AnimDash() {
    if (this.isDashing) {
      this.player.setVelocityX(this.dashSpeed * (this.player.flipX ? -1 : 1)); // Vitesse de dash
      this.player.anims.play("anim_dash", true); // Jouer animation dash
      this.scene.time.delayedCall(this.dashTime, () => {
        this.isDashing = false;
        this.player.setVelocityX(0); // Arrêter le dash
      });
    } else if (this.keyX.isDown && this.canDash) {
      this.isDashing = true;
      this.canDash = false;
      this.scene.time.delayedCall(this.dashCooldown, () => {
        this.canDash = true; // Réactiver le dash après le cooldown
      });
    }
  }
}
