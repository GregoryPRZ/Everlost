export class Player {
  constructor(scene, x, y, texture, calque_plateformes, platforms) {
    this.scene = scene;
    this.player = this.scene.physics.add.sprite(x, y, texture);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.scene.physics.add.collider(this.player, calque_plateformes);
    this.scene.physics.add.collider(this.player, platforms);

    this.clavier = this.scene.input.keyboard.createCursorKeys();
    this.nbSaut = 0;
    this.doubleSaut = true;
    this.space = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.keyX = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
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
    //anim droite
    this.scene.anims.create({
      key: "anim_tourne_droite",
      frames: this.scene.anims.generateFrameNumbers("player_marche", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //anim gauche
    this.scene.anims.create({
      key: "anim_tourne_gauche",
      frames: this.scene.anims.generateFrameNumbers("player_marche", {
        start: 0,
        end: 6,
      }),
      frameRate: 10,
      repeat: -1,
    });

    //anim face
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
      frameRate: 5,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "anim_saut",
      frames: this.scene.anims.generateFrameNumbers("player_jump", {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "anim_dash",
      frames: this.scene.anims.generateFrameNumbers("player_dash", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update() {
    // Réinitialiser la taille et l'offset de la hitbox à chaque mise à jour
    this.player.body.setSize(34, 60);
    this.player.body.setOffset(16, 0);

    // Appeler les fonctions pour gérer le mouvement, le dash et le saut
    this.AnimMouvement();
    this.AnimDash();
    this.AnimJump();
  }

  AnimMouvement() {
    if (!this.isDashing) {
      if (this.clavier.down.isDown && this.player.body.blocked.down) {
        // Si le joueur se baisse
        this.player.body.setSize(34, 32); // Nouvelle taille plus petite
        this.player.body.setOffset(16, 32); // Ajuster l'offset pour que la hitbox soit correctement positionnée

        if (this.clavier.left.isDown) {
          this.player.setVelocityX(-80);
          this.player.flipX = true;
          this.player.anims.play("anim_baisser", true);
        } else if (this.clavier.right.isDown) {
          this.player.setVelocityX(80);
          this.player.flipX = false;
          this.player.anims.play("anim_baisser", true);
        } else {
          this.player.setVelocityX(0);
          this.player.anims.play("anim_baisser", true);
        }
      } else {
        // Rétablir la hitbox originale lorsque le joueur ne se baisse pas
        this.player.body.setSize(34, 60);
        this.player.body.setOffset(16, 0);

        if (this.clavier.right.isDown) {
          this.player.setVelocityX(160);
          this.player.anims.play("anim_tourne_droite", true);
          this.player.flipX = false;
        } else if (this.clavier.left.isDown) {
          this.player.setVelocityX(-160);
          this.player.flipX = true;
          this.player.anims.play("anim_tourne_droite", true);
        } else {
          this.player.setVelocityX(0);
          if (this.player.body.blocked.down) {
            this.player.anims.play("anim_face", true);
          }
        }
      }
    }
  }

  AnimDash() {
    if (this.keyX.isDown && this.canDash) {
      this.startDash();
    }

    if (this.isDashing) {
      this.player.anims.play("anim_dash", true);
    }
  }

  startDash() {
    this.isDashing = true;
    this.canDash = false;

    // Détermine la direction du dash
    const dashDirection = this.player.flipX ? -1 : 1;
    this.player.setVelocityX(this.dashSpeed * dashDirection);

    // Arrêter le dash après la durée définie
    this.scene.time.delayedCall(this.dashTime, () => {
      this.stopDash();
    });

    // Réactiver le dash après le cooldown
    this.scene.time.delayedCall(this.dashCooldown, () => {
      this.canDash = true;
    });
  }

  stopDash() {
    this.isDashing = false;
    this.player.setVelocityX(0);
  }

  AnimJump() {
    if (!this.player.body.blocked.down) {
      this.player.anims.play("anim_saut", true);
    }

    this.Saut();
  }

  Saut() {
    if (this.player.body.blocked.down) {
      this.nbSaut = 0;
      this.doubleSaut = true;
    }

    if (Phaser.Input.Keyboard.JustDown(this.space)) {
      if (this.nbSaut < 1) {
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.player.anims.play("anim_saut", true);
      } else if (this.nbSaut === 1 && this.doubleSaut) {
        this.player.setVelocityY(-330);
        this.nbSaut++;
        this.doubleSaut = false;
        this.player.anims.play("anim_saut", true);
      }
    }
  }
}
