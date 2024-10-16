export class Boots {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
  
      // Initialisation de l'objet Boots
      this.boots = this.scene.physics.add.sprite(x, y, 'boots');
      this.boots.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.boots.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.boots, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.boots, () => {
        player.collectBoots(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'boots_anim',
        frames: this.scene.anims.generateFrameNumbers('boots', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.boots.play('boots_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.boots) {
        this.boots.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }
  

  export class Dash {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
  
      // Initialisation de l'objet Boots
      this.dash = this.scene.physics.add.sprite(x, y, 'dash');
      this.dash.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.dash.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.dash, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.dash, () => {
        player.collectDash(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'dash_anim',
        frames: this.scene.anims.generateFrameNumbers('dash', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.dash.play('dash_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.dash) {
        this.dash.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }

  export class Heart {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
  
      // Initialisation de l'objet Boots
      this.heart = this.scene.physics.add.sprite(x, y, 'heart');
      this.heart.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.heart.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.heart, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.heart, () => {
        player.collectHeart(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'heart_anim',
        frames: this.scene.anims.generateFrameNumbers('heart', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.heart.play('heart_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.heart) {
        this.heart.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }

  export class DiamondHeart {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
  
      // Initialisation de l'objet Boots
      this.heart = this.scene.physics.add.sprite(x, y, 'diamond_heart');
      this.heart.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.heart.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.heart, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.heart, () => {
        player.collectDiamondHeart(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'diamond_heart_anim',
        frames: this.scene.anims.generateFrameNumbers('diamond_heart', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.heart.play('diamond_heart_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.heart) {
        this.heart.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }

  export class Sword {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
      this.sword = this.scene.physics.add.sprite(x, y, 'everlost_sword');
      this.sword.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.sword.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.sword, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.sword, () => {
        player.collectSword(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'sword_anim',
        frames: this.scene.anims.generateFrameNumbers('sword', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.sword.play('sword_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.sword) {
        this.sword.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }

  export class DreamSword {
    constructor(scene, x, y, calque_plateformes, player) {
      this.scene = scene;
      this.sword = this.scene.physics.add.sprite(x, y, 'upgraded_sword');
      this.sword.setGravityY(0); // Les bottes ne subissent pas la gravité
      this.sword.body.setAllowGravity(false); // Les bottes ne subissent pas la gravité
  
      // Ajout d'une collision avec les plateformes
      this.scene.physics.add.collider(this.sword, calque_plateformes);
  
      // Ajouter la détection de chevauchement entre les bottes et le joueur
      this.scene.physics.add.overlap(player.player, this.sword, () => {
        player.collectSword(); // Appliquer l'effet des bottes au joueur
        this.destroy(); // Supprimer les bottes après la collecte
      });
  
      // Setup d'animations si nécessaire
      this.setupAnimations();
    }
  
    setupAnimations() {
      // Si vous avez une animation pour les bottes
      this.scene.anims.create({
        key: 'upgraded_sword_anim',
        frames: this.scene.anims.generateFrameNumbers('upgraded_sword', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
      });
  
      this.sword.play('upgraded_sword_anim');
    }
  
    // Détruire les bottes
    destroy() {
      if (this.sword) {
        this.sword.destroy(); // Supprimer l'objet des bottes
      }
    }
  
    // Mettre à jour si nécessaire
    update() {
      // Les bottes ne bougent pas, mais cette fonction est là si vous avez besoin de la mettre à jour
    }
  }