// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/
import { Player } from "./Player.js"; // Assurez-vous d'importer correctement votre classe
import { Enemy } from "./enemy.js"; // Assurez-vous d'importer correctement votre classe
import { Level } from "./levelmap.js"; // Assurez-vous que le chemin est correct

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 1280, // largeur en pixels
  height: 720, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300, // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true, // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    },
  },
  scene: {
    preload: preload, // la phase preload est associée à la fonction preload
    create: create, // la phase create est associée à la fonction create
    update: update, // la phase update est associée à la fonction update
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// création et lancement du jeu
new Phaser.Game(config);

/******************************** */ // mes variables

var player; // Variable pour stocker l'instance du joueur
var enemy; // Variable pour stocker l'instance de l'ennemi

/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

function preload() {
  // Charger le jeu de tuiles
  this.load.image("tuilesJeu", "src/assets/tuilesJeu.png");
  // Charger le fichier JSON de la carte
  this.load.tilemapTiledJSON("carte", "src/assets/map1.json");
  // Charger le sprite sheet de l'ennemi
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

  this.load.spritesheet("player_attaque", "src/assets/player_walking.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet("player_crouch", "src/assets/player_crouch.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet("player_dash", "src/assets/player_dash.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  this.load.spritesheet("player_jump", "src/assets/player_jump.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  // Charger l'image balle
  this.load.image("bullet", "src/assets/bullet.png");
  // Background
  this.load.image("fond", "src/assets/images/background.png");

  this.load.image("bloc1", "src/assets/bloc1.png");
  this.load.image("bloc2", "src/assets/bloc2.png");
  this.load.image("bloc3", "src/assets/bloc3.png");
  this.load.image("bloc4", "src/assets/bloc4.png");
  this.load.image("bloc5", "src/assets/bloc5.png");
}
/***********************************************************************/

/** FONCTION CREATE 
/***********************************************************************/

function create() {
  // Créer l'image de fond
  const background = this.add.image(0, -250, "fond").setOrigin(0, 0);
  background.setScrollFactor(0); // Cela fixe l'image de fond à la caméra

  // Chargement de la carte
  const carteDuNiveau = this.add.tilemap("carte");

  // Chargement du jeu de tuiles
  const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu", "tuilesJeu");

  // Chargement du calque calque_background
  const calque_background = carteDuNiveau.createLayer(
    "calque_background",
    tileset
  );

  // Chargement du calque calque_plateformes
  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateformes",
    tileset
  );

  // Configurer les collisions pour le calque des plateformes
  calque_plateformes.setCollisionByProperty({ estSolide: true });

  this.physics.world.setBounds(0, 0, 7080, 3072); // Limites du monde physique

  // Créer le joueur et l'ennemi
  player = new Player(this, 100, 2700, "img_perso", calque_plateformes); // Position et texture du joueur
  enemy = new Enemy(this, 600, 500, "enemi", player, calque_plateformes); // Position et texture de l'ennemi
  const level = new Level(this);
  this.cameras.main.setBounds(0, 0, 7080, 3072); // Définir les limites de la caméra
  this.cameras.main.startFollow(player.player); // Suivre le joueur
  // Ajouter les collisions entre le joueur et les blocs
  this.physics.add.collider(player.player, level.platforms);

  // Ajouter les collisions entre l'ennemi et les blocs
  this.physics.add.collider(enemy.enemy, level.platforms); // Assurez-vous que votre classe Enemy a une propriété 'enemy' pour le sprite
}

function update() {
  // Appeler la méthode update des classes Player et Enemy
  if (player) {
    player.update();
  }
  if (enemy) {
    enemy.update();
  }
}

/**************************************************************************************************** */
