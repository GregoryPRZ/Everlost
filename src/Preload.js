// preload.js
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    //Images
    this.load.image("accueil", "src/assets/accueil.png");
    this.load.image("controle", "src/assets/controles.png");
    this.load.image("controls", "src/assets/controls.png");
    this.load.image("credits", "src/assets/credits.png");
    this.load.image("scenario", "src/assets/scenario.png");
    this.load.image("start", "src/assets/Start.png");
    this.load.image("retour", "src/assets/retour.png");

    this.load.image("tuilesJeu", "src/assets/tuilesJeu.png");
    this.load.image("bullet", "src/assets/bullet.png");
    this.load.image("fond", "src/assets/images/background.png");

    this.load.image("full", "src/assets/hpbarfull.png");
    this.load.image("4hit", "src/assets/hpbar4hit.png");
    this.load.image("3hit", "src/assets/hpbar3hit.png");
    this.load.image("2hit", "src/assets/hpbar2hit.png");
    this.load.image("1hit", "src/assets/hpbar1hit.png");



    this.load.tilemapTiledJSON("carte", "src/assets/map.json");

    // Spritesheets enemmis + players
    this.load.spritesheet("enemi", "src/assets/enemi.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    //lianes
    console.log("Début du chargement de la vigne");
    this.load.spritesheet("vine", "src/assets/ground_vine.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    console.log("Image de la vigne chargée");

    

    this.load.spritesheet("player_marche", "src/assets/player_walking.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_debout", "src/assets/player_idle.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_crouch", "src/assets/player_crouch.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_jump", "src/assets/player_jump.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_attack", "src/assets/player_attack.png", {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.spritesheet("player_dash", "src/assets/player_dash.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

  //----------------------------------------------------------------------------
  // Charger l'image pour la plante en mode statique
 // Charger la spritesheet pour la plante en mode statique
 this.load.spritesheet('carnivorous_plant_idle', 'src/assets/carnivorous_plant.png', {
  frameWidth: 32,
  frameHeight: 64
});

// Charger la spritesheet pour la plante en mode attaque
this.load.spritesheet('carnivorous_plant_attack', 'src/assets/carnivorous_plant_attack.png', {
  frameWidth: 32,
  frameHeight: 64,
});

  }

  create() {
    this.scene.start("SceneMenu");
    //---------------------------------------
    this.anims.create({
      key: "enemy_gauche",
      frames: this.anims.generateFrameNumbers("enemi", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    
    this.anims.create({
      key: "enemy_droite",
      frames: this.anims.generateFrameNumbers("enemi", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
