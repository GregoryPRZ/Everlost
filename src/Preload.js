// preload.js
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    //Images
    this.load.image("accueil", "src/assets/screens/accueil.png");
    this.load.image("controle", "src/assets/screens/controles.png");
    this.load.image("controls", "src/assets/buttons/controls.png");
    this.load.image("credit", "src/assets/screens/credits.png");
    this.load.image("credits", "src/assets/buttons/credits.png");
    this.load.image("scenario", "src/assets/screens/scenario.png");
    this.load.image("gameover", "src/assets/screens/gameOver.png");
    this.load.image("start", "src/assets/buttons/Start.png");
    this.load.image("retour", "src/assets/buttons/retour.png");

    this.load.audio('buttonClick', 'src/assets/sounds/se_click.mp3');

    this.load.image("tuilesJeu", "src/assets/tuilesJeu.png");
    this.load.image("bullet", "src/assets/enemy/bullet.png");
    this.load.image("fond", "src/assets/background/background.png");

    this.load.image("full", "src/assets/player/hpbarfull.png");
    this.load.image("4hit", "src/assets/player/hpbar4hit.png");
    this.load.image("3hit", "src/assets/player/hpbar3hit.png");
    this.load.image("2hit", "src/assets/player/hpbar2hit.png");
    this.load.image("1hit", "src/assets/player/hpbar1hit.png");

    this.load.image("enemy_full", "src/assets/enemy/hpbarfull.png");
    this.load.image("enemy_mid", "src/assets/enemy/hpbarmid.png");
    this.load.image("enemy_empty", "src/assets/enemy/hpbarempty.png");
    this.load.image("enemy_2hit", "src/assets/enemy/hpbar2hit.png");
    this.load.image("enemy_1hit", "src/assets/enemy/hpbar1hit.png");

    this.load.tilemapTiledJSON("carte", "src/assets/map.json");

    // Spritesheets enemmis + players
    this.load.spritesheet("enemi", "src/assets/enemy/blob_move.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    //lianes
    this.load.spritesheet("vine", "src/assets/enemy/ground_vine.png", {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet("player_marche", "src/assets/player/player_walking.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_debout", "src/assets/player/player_idle.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_crouch", "src/assets/player/player_crouch.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_jump", "src/assets/player/player_jump.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("player_attack", "src/assets/player/player_attack.png", {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.spritesheet("player_dash", "src/assets/player/player_dash.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    //----------------------------------------------------------------------------
    // Charger l'image pour la plante en mode statique
    // Charger la spritesheet pour la plante en mode statique
    this.load.spritesheet(
      "carnivorous_plant_idle",
      "src/assets/enemy/carnivorous_plant.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      }
    );

    // Charger la spritesheet pour la plante en mode attaque
    this.load.spritesheet(
      "carnivorous_plant_attack",
      "src/assets/enemy/carnivorous_plant_attack.png",
      {
        frameWidth: 32,
        frameHeight: 64,
      }
    );

//----------------------------------------------------------------------------------
    // Charger la spritesheet pour le vol du corbeau
    this.load.spritesheet('crow_fly', 'src/assets/enemy/crow_move.png', {
      frameWidth: 64,
      frameHeight: 64
    });

    // Charger la spritesheet pour l'attaque en piqué du corbeau
    this.load.spritesheet('crow_dive', 'src/assets/enemy/crow_attack.png', {
      frameWidth: 64,
      frameHeight: 64
    });


//------------------------- Charger la texture de la balle ----------------------------
    this.load.image("bullet_texture", "src/assets/Bullet.png");


}


create() {
  this.scene.start("SceneMenu");
  //---------------------------------------
}
}