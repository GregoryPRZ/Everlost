import { Player } from "./Player.js"; // Assurez-vous d'importer correctement votre classe
import { Enemy } from "./enemy.js"; // Assurez-vous d'importer correctement votre classe

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: "MapScene" }); // Définir la clé de la scène
    this.tileset = null;
    this.carteDuNiveau = null;
    this.calque_background = null;
    this.calque_plateformes = null;
    this.player = null; // Ajouter le joueur ici
    this.enemies = []; // Pour stocker les ennemis
  }

  create() {
    console.log("MapScene: create() démarré"); // Débogage : Suivre l'initialisation

    // Chargement de la carte
    this.carteDuNiveau = this.add.tilemap("carte");
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
    this.calque_background = this.carteDuNiveau.createLayer(
      "calque_background",
      this.tileset
    );
    this.calque_plateformes = this.carteDuNiveau.createLayer(
      "calque_plateformes",
      this.tileset
    );

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
    this.calque_plateformes.setCollisionByProperty({ estSolide: true });

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, 7080, 3072);
    this.cameras.main.setBounds(0, 0, 7080, 3072);

    // Créer le joueur
    this.player = new Player(
      this,
      100,
      2700,
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
