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

    // Initialisation des animations
    this.Animations();
    this.Saut();
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
      frameRate: 10,
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
  }

  update() {
    // Logique de mouvement
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false; // Afficher le sprite normalement
      this.player.anims.play("anim_tourne_droite", true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true; // Afficher le sprite en miroir
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown && !this.player.body.blocked.down) {
      this.player.setVelocityX(160);
      this.player.flipX = false; // Afficher le sprite normalement
      this.player.anims.play("anim_saut", true);
    } else if (this.clavier.left.isDown && !this.player.body.blocked.down) {
      this.player.setVelocityX(-160);
      this.player.flipX = true; // Afficher le sprite en miroir
      this.player.anims.play("anim_saut", true);
    } else {
      this.player.setVelocityX(0);
      // Jouer l'animation de debout uniquement si le joueur est au sol et n'est pas en train de sauter
      if (this.player.body.blocked.down) {
        this.player.anims.play("anim_face", true);
      }
    }

    // Appel de la méthode Saut pour gérer le saut
    this.Saut();

    // Vérifier si le joueur est au sol pour gérer les animations de saut
    if (!this.player.body.blocked.down) {
      // Si le joueur n'est pas au sol, jouer l'animation de saut
      this.player.anims.play("anim_saut", true);
    }

    this.player.body.setSize(38, 64);
  }

  Saut() {
    // Vérifie si le joueur est au sol pour réinitialiser les sauts
    if (this.player.body.blocked.down) {
      this.nbSaut = 0; // Réinitialiser le compteur de saut
      this.doubleSaut = true; // Réactiver le double saut
    }

    // Gérer le saut avec un seul appui détecté
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
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
      }
    }
  }
}
