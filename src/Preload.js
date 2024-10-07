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

    this.load.image("bloc1", "src/assets/bloc1.png");
    this.load.image("bloc2", "src/assets/bloc2.png");
    this.load.image("bloc3", "src/assets/bloc3.png");
    this.load.image("bloc4", "src/assets/bloc4.png");
    this.load.image("bloc5", "src/assets/bloc5.png");

    // Fichier JSON de la carte
    this.load.tilemapTiledJSON("carte", "src/assets/map1.json");

    // Spritesheets enemmis + players
    this.load.spritesheet("enemi", "src/assets/enemi.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

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
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_dash", "src/assets/player_dash.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.start("SceneMenu");
  }
}
