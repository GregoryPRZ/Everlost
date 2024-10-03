export class Player {
  constructor(scene, x, y, texture, calque_plateformes, platforms) {
    this.scene = scene;
    this.player = this.scene.physics.add.sprite(x, y, texture);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);
    this.scene.physics.add.collider(this.player, calque_plateformes);
    this.scene.physics.add.collider(this.player, platforms);

    this.clavier = this.scene.input.keyboard.createCursorKeys();
    this.nbSaut = 0;
    this.doubleSaut = true;

    // Initialisation des animations
    this.Animations();
    this.Saut();
  }

  Animations() {
    this.scene.anims.create({
      key: "anim_tourne_gauche",
      frames: this.scene.anims.generateFrameNumbers("img_perso", {
        start: 0,
        end: 3,
      }),
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1,
    });

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
      frames: [{ key: "img_perso", frame: 6 }], // a modif apres num
      frameRate: 10,
    });
  }

  update() {
    // Logique de mouvement et de saut
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face", true);
    }

    this.Saut();
  }
  Saut() {
    // Logique de saut
    if (this.player.body.blocked.down) {
      this.nbSaut = 0; // Réinitialiser le compteur de saut
      this.doubleSaut = true; // Activer le double saut
    }

    // Gérer le saut avec un seul appui détecté
    if (Phaser.Input.Keyboard.JustDown(this.clavier.up)) {
      if (this.nbSaut < 1) {
        // Premier saut
        this.player.setVelocityY(-330);
        this.nbSaut++;
      } else if (this.nbSaut === 1 && this.doubleSaut) {
        // Double saut
        this.player.setVelocityY(-330);
        this.nbSaut++; // Le joueur ne peut plus sauter jusqu'à ce qu'il touche le sol
        this.doubleSaut = false; // Désactiver le double saut
      }
    }
  }
}
