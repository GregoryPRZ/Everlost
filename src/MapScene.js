import { Player } from "./Player.js"; // Assurez-vous d'importer correctement votre classe
import { Enemy } from "./enemy.js"; // Assurez-vous d'importer correctement votre classe
import { Vine } from "./vine.js";
import {CarnivorousPlant} from "./CarnivorousPlant.js";

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
    //console.log("MapScene: create() démarré"); // Débogage : Suivre l'initialisation

    // Chargement de la carte
    this.carteDuNiveau = this.add.tilemap("carte");
    /*if (this.carteDuNiveau) {
      console.log("Carte du niveau chargée avec succès");
    } else {
      console.error("Erreur : Carte du niveau non chargée");
    }*/

    // Chargement du jeu de tuiles
    this.tileset = this.carteDuNiveau.addTilesetImage(
      "tuiles_de_jeu",
      "tuilesJeu"
    );
    /*if (this.tileset) {
      console.log("Tileset chargé avec succès");
    } else {
      console.error("Erreur : Tileset non chargé");
    }*/

    // Chargement des calques
    this.calque_background = this.carteDuNiveau.createLayer(
      "calque_background",
      this.tileset
    );
    this.calque_plateformes = this.carteDuNiveau.createLayer(
      "calque_plateformes",
      this.tileset
    );

    /*if (this.calque_background) {
      console.log("Calque de fond chargé");
    } else {
      console.error("Erreur : Calque de fond non chargé");
    }

    if (this.calque_plateformes) {
      console.log("Calque de plateformes chargé");
    } else {
      console.error("Erreur : Calque de plateformes non chargé");
    }*/

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

    /*if (this.player) {
      console.log("Joueur créé avec succès", this.player);
    } else {
      console.error("Erreur : Joueur non créé");
    }*/

    // Créer l'ennemi
    this.enemy = new Enemy(
      this,
      600,
      500,
      "enemi",
      this.player,
      this.calque_plateformes
    );

    /*if (this.enemy) {
      console.log("Ennemi créé avec succès", this.enemy);
    } else {
      console.error("Erreur : Ennemi non créé");
    }800, 1500*/

    //liane
    console.log("Création des lianes");
    this.vine = new Vine(this, 600, 3055, "vine", this.player, this.calque_plateformes);

    console.log("Configuration des animations pour la vigne");
    this.vine.setupAnimations();


    if (this.vine) {
      console.log("Lianes créées avec succès", this.vine);
    } else {
      console.error("Erreur : Lianes non créées");
    }

  //----------------------------------plante carnivors---------------------------
  // Créer les animations pour la plante carnivore
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('carnivorous_plant_idle', { start: 0, end: 3 }),
    frameRate: 4,
    repeat: -1 // L'animation boucle indéfiniment
  });

  this.anims.create({
    key: 'attack',
    frames: this.anims.generateFrameNumbers('carnivorous_plant_attack', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: 0 // L'animation joue une seule fois
  });

  // Exemple de création d'une instance de la plante carnivore
  this.carnivorousPlant = new CarnivorousPlant(this, 900, 3040, this.player, this.platforms);
  //-------------------------------------------------------------
    
    // Ajoutez les collisions si nécessaire
    this.physics.add.collider(this.vine.sprite, this.calque_plateformes);

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
      //console.log("Player update appelé"); // Débogage : Suivre les mises à jour du joueur
    }

    if (this.enemy) {
      this.enemy.update();
      //console.log("Enemy update appelé"); // Débogage : Suivre les mises à jour de l'ennemi
    }

    this.carnivorousPlant.update();
  }
}
