import { Player } from "./Player.js"; // Assurez-vous d'importer correctement votre classe
import { Enemy } from "./enemy.js"; // Assurez-vous d'importer correctement votre classe

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: "MapScene" }); // Définir la clé de la scène
    this.tileset = null;
    this.carteDuNiveau = null;
    this.calque_background = null;
    this.calque_plateformes = null;
    this.calque_mort = null;
    this.calque_echelle = null;
    this.player = null; // Ajouter le joueur ici
    this.enemies = []; // Pour stocker les ennemis
  }

  preload() {
    // Charger les sons
    this.load.audio('jumpSound', 'src/assets/sounds/se_jump.mp3');
    this.load.audio('dashSound', 'src/assets/sounds/se_dash.mp3');
    this.load.audio('attackSound', 'src/assets/sounds/se_sword.mp3');
    this.load.audio('mapMusic', 'src/assets/sounds/bgm_map.mp3'); // Remplacez par le chemin de votre son
    // Charger d'autres ressources...
  }

  create() {
    console.log("MapScene: create() démarré"); // Débogage : Suivre l'initialisation

    // Chargement de la carte
    this.carteDuNiveau = this.add.tilemap("carte");
    // Ajoutez l'image de fond et positionnez-la à l'origine
    let fond = this.add.image(0, 0, 'fond').setOrigin(0, 0);

    // Ajustez l'échelle de l'image de fond pour qu'elle remplisse toute la scène
    fond.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
    // Arrêter la musique du titre
    this.scene.get('SceneMenu').titleMusic.stop();

    this.mapMusic = this.sound.add('mapMusic', { loop: true });
    this.mapMusic.play();

    if (this.carteDuNiveau) {
      console.log("Carte du niveau chargée avec succès");
    } else {
      console.error("Erreur : Carte du niveau non chargée");
    }

    // Chargement du jeu de tuiles
    this.tileset = this.carteDuNiveau.addTilesetImage(
      "tuiles_de_jeu",
      "tuilesJeu"
    );
    if (this.tileset) {
      console.log("Tileset chargé avec succès");
    } else {
      console.error("Erreur : Tileset non chargé");
    }


    // Chargement des calques
    this.calque_mort = this.carteDuNiveau.createLayer(
      "calque_mort",
      this.tileset
    );
    this.calque_echelle = this.carteDuNiveau.createLayer(
      "calque_echelle",
      this.tileset
    );
    this.calque_background = this.carteDuNiveau.createLayer(
      "calque_background",
      this.tileset
    );
    this.calque_plateformes = this.carteDuNiveau.createLayer(
      "calque_plateformes",
      this.tileset
    );

    if (this.calque_mort) {
      console.log("Calque de fond chargé");
    } else {
      console.error("Erreur : Calque de fond non chargé");
    }

    if (this.calque_echelle) {
      console.log("Calque de fond chargé");
    } else {
      console.error("Erreur : Calque de fond non chargé");
    }

    if (this.calque_background) {
      console.log("Calque de fond chargé");
    } else {
      console.error("Erreur : Calque de fond non chargé");
    }

    if (this.calque_plateformes) {
      console.log("Calque de plateformes chargé");
    } else {
      console.error("Erreur : Calque de plateformes non chargé");
    }

    // Configurer les collisions pour le calque des plateformes
    this.calque_plateformes.setCollisionByProperty({estSolide: true});
    this.calque_echelle.setCollisionByProperty({ estEchelle: true }); // Ajouter collision pour les échelles

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, 7680, 6144);
    this.cameras.main.setBounds(0, 0, 7080, 6144);

    // Créer le joueur
    this.player = new Player(
      this,
      50,
      5900,
      "img_perso",
      this.calque_plateformes
    );

    if (this.player) {
      console.log("Joueur créé avec succès", this.player);
    } else {
      console.error("Erreur : Joueur non créé");
    }

    // Ajoute les sprites pour les 5 vies (exemple : sprites nommés life_5, life_4, ..., life_0)
    this.lifeBar = this.add.sprite(16, 16, 'full').setOrigin(0, 0); // Position en haut à enemy_gauche
    this.lifeBar.setScale(2);
    this.lifeBar.setScrollFactor(0); // Pour que la barre de vie ne bouge pas avec la caméra

    // Créer l'ennemi
    this.enemy = new Enemy(
      this,
      600,
      500,
      "enemi",
      this.player,
      this.calque_plateformes
    );

    if (this.enemy) {
      console.log("Ennemi créé avec succès", this.enemy);
    } else {
      console.error("Erreur : Ennemi non créé");
    }

    this.physics.add.overlap(this.player, this.enemy, this.playerIsHit, null, this);

    // Suivre le joueur avec la caméra
    this.cameras.main.startFollow(this.player.player);

    // Ajouter les collisions
    this.physics.add.collider(this.player.player, this.calque_plateformes);
    this.physics.add.collider(this.enemy.enemy, this.calque_plateformes);
    this.physics.add.overlap(this.player.player, this.calque_echelle, this.onScaleOverlap, null, this); // Détection de chevaucheme

    console.log("MapScene: create() terminé"); // Débogage : Fin de la méthode create
  }

  update() {
    if (this.player) {
      this.player.update();
      console.log("Player update appelé"); // Débogage : Suivre les mises à jour du joueur
    }

    if (this.enemy) {
      this.enemy.update();
      console.log("Enemy update appelé"); // Débogage : Suivre les mises à jour de l'ennemi
    }

    // Mise à jour du joueur
    this.player.update();

    // Exemple de condition de perte de vie
    if (this.playerIsHit) {
      this.player.decreaseLife(); // Enlève une vie
    }
  }


  updateLifeDisplay() {
    // Change le sprite de la barre de vie en fonction du nombre de vies du joueur
    const lifePoints = this.player.lifePoints;

    // Change l'image de la barre de vie selon les vies restantes
    if (lifePoints === 5) {
      this.lifeBar.setTexture('full');
    } else if (lifePoints === 4) {
      this.lifeBar.setTexture('4hit');
    } else if (lifePoints === 3) {
      this.lifeBar.setTexture('3hit');
    } else if (lifePoints === 2) {
      this.lifeBar.setTexture('2hit');
    } else if (lifePoints === 1) {
      this.lifeBar.setTexture('1hit');
    }
  }
}
