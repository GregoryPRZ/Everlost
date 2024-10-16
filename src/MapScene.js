import { Blob, CarnivorousPlant, Vine, Crow } from "./enemy.js";
import { Boots, Dash, Heart, DiamondHeart, Sword, DreamSword} from "./objects.js";
import { Player } from "./Player.js"; 

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
    this.enemies = null; // Pour stocker les ennemis
    this.enemyObjects = [];
    this.objects = []; // Nouveau tableau pour stocker les objets
    this.totalEnemies = 0; // Nombre total d'ennemis
    this.defeatedEnemies = 0; // Nombre d'ennemis vaincus
    this.enemyText = null; // Texte pour afficher le compteur
    this.bootsImage = null; // Image pour les bottes dans l'interface
  }

  preload() {
    // Charger les sons
    this.load.audio("blobSound", "src/assets/sounds/se_blob.mp3"); // Remplacez le chemin par celui de votre fichier audio
    this.load.audio("crowCawSound", "src/assets/sounds/se_crow.mp3"); // Remplacez le chemin par celui de votre fichier audio
    this.load.audio("jumpSound", "src/assets/sounds/se_jump.mp3");
    this.load.audio("poisonSound", "src/assets/sounds/se_poison.mp3");
    this.load.audio("dashSound", "src/assets/sounds/se_dash.mp3");
    this.load.audio("attackSound", "src/assets/sounds/se_sword.mp3");
    this.load.audio("mapMusic", "src/assets/sounds/bgm_map.mp3"); // Remplacez par le chemin de votre son
    this.load.audio("stepSound", "src/assets/sounds/se_step.mp3");
    this.load.audio("hurtSound", "src/assets/sounds/se_hurt.mp3");
    this.load.audio("objectSound", "src/assets/sounds/se_objet.mp3");
    this.load.audio("shootSound", "src/assets/sounds/se_shoot_sword.mp3");
  }

  create() {
    this.carteDuNiveau = this.add.tilemap("carte");
    let fond = this.add.image(0, 0, "fond").setOrigin(0, 0);

    fond.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    fond.setScrollFactor(0); // Cela fixe l'image de fond à la caméra
    this.scene.get("SceneMenu").titleMusic.stop();

    this.mapMusic = this.sound.add("mapMusic", { loop: true });
    this.mapMusic.setVolume(0.5); // Volume à 50% (valeurs entre 0 et 1)
    this.mapMusic.play({ loop: true }); // Lecture en boucle

    // Chargement du jeu de tuiles
    this.tileset = this.carteDuNiveau.addTilesetImage(
      "tuiles_de_jeu",
      "tuilesJeu"
    );

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

    // Configurer les collisions pour le calque des plateformes
    this.calque_plateformes.setCollisionByProperty({ estSolide: true });
    this.calque_echelle.setCollisionByProperty({ estEchelle: true }); // Ajouter collision pour les échelles
    // Assurez-vous que les tuiles de ce calque sont solides (optionnel selon la configuration de Tiled)
    this.calque_mort.setCollisionByProperty({ estMortel: true }); // Assurez-vous que cela correspond à la propriété que vous avez définie dans Tiled.

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

    this.lifeBar = this.add.sprite(16, 0, "full").setOrigin(0, 0); // Position en haut à enemy_gauche
    this.lifeBar.setScale(2);
    this.lifeBar.setScrollFactor(0); // Pour que la barre de vie ne bouge pas avec la caméra

    this.createUIObjects();  
    
    this.enemies = this.physics.add.group(); // Groupe des ennemis

    // Obtenez les données d'ennemis depuis le calque de la carte
    const enemyObjects =
      this.carteDuNiveau.getObjectLayer("calque_ennemis").objects;

    this.totalEnemies = enemyObjects.length; // Nombre total d'ennemis au début
    this.defeatedEnemies = 0; // Initialiser le nombre d'ennemis vaincus à 0

    this.enemyText = this.add.text(16, 50, `Ennemis battus: 0/${this.totalEnemies}`, {
      font: '36px EnchantedLand',
      fill: '#ffffff'
    }).setScrollFactor(0); // Le texte reste fixe lors du défilement de la caméra
    

    // Utiliser enemyObjects pour placer les ennemis
    enemyObjects.forEach((enemyData) => {
      const enemyType = enemyData.properties.find(
        (prop) => prop.name === "enemyType"
      ).value;
      console.log("Creating enemy of type:", enemyType);

      let enemy;
      // Créer l'ennemi en fonction de son type
      switch (enemyType) {
        case "blob":
          enemy = new Blob(
            this,
            enemyData.x,
            enemyData.y,
            "enemi",
            this.calque_plateformes
          );
          break;
        case "vine":
          enemy = new Vine(this, enemyData.x, enemyData.y, "vine");
          break;
        case "plant":
          enemy = new CarnivorousPlant(
            this,
            enemyData.x,
            enemyData.y,
            this.player
          );
          break;
        case "crow":
          enemy = new Crow(this, enemyData.x, enemyData.y, this.player);
          break;
      }

      if (enemy) {
        // Ajouter l'ennemi complet au groupe this.enemies en tant qu'objet
        this.enemies.add(enemy.enemy); // Ajoute uniquement le sprite au groupe

        // Stocker l'instance complète dans une propriété de sprite pour la mise à jour
        enemy.enemy.instance = enemy;

        // Ajouter un événement quand un ennemi est vaincu
        enemy.enemy.on('destroy', () => {
          this.defeatedEnemies++; // Incrémenter le nombre d'ennemis vaincus
          if (this.player){
            if (this.player.lifePoints < 6) {
              this.player.lifePoints++;
              this.updateLifeDisplay(); // Mettre à jour l'affichage des points de vie
            }
            this.updateEnemyText(); // Mettre à jour le texte d'ennemis
          }
        });

        enemy.enemy.setCollideWorldBounds(true); // Empêche les ennemis de sortir des limites
        console.log("Enemy created and added to group:", enemy);
      } else {
        console.error("Enemy creation failed for:", enemyType);
      }
  });

  const objectLayer = this.carteDuNiveau.getObjectLayer('calque_objets').objects;

  objectLayer.forEach((objectData) => {
    console.log(objectData);
    const objectType = objectData.properties.find(prop => prop.name === 'objectType').value;
    console.log('Creating object of type:', objectType);
  
    let object;
    switch (objectType) {
      case 'boots':
        object = new Boots(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
      case 'dash':
        object = new Dash(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
      case 'heart':
        object = new Heart(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
      case 'diamond_heart':
        object = new DiamondHeart(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
      case 'sword':
        object = new Sword(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
      case 'dream_sword':
        object = new DreamSword(this, objectData.x, objectData.y, this.calque_plateformes, this.player);
        break;
    }
  
    if (object) {
      this.objects.push(object); // Ajoute à la liste des objets
      this.physics.add.overlap(this.player.player, object, () => {
        if (objectType === "boots") {
          this.player.collectBoots();
        } else if (objectType === "dash") {
          this.player.collectDash();
        } else if (objectType === "heart") {
          this.player.collectHeart();
        } else if (objectType === "diamond_heart") {
          this.player.collectDiamondHeart();
        } else if (objectType === "sword") {
          this.player.collectSword();
        } else if (objectType === "dream_sword") {
          this.player.collectDreamSword();
        }
        object.destroy(); // Supprime l'objet ramassé
      });
    }
  });
  

    // Suivre le joueur avec la caméra
    this.cameras.main.startFollow(this.player.player);

    // Collisions
    this.physics.add.collider(this.enemies, this.calque_plateformes);
    this.physics.add.collider(this.player.player, this.calque_plateformes);
    this.physics.add.collider(this.player.player, this.calque_mort, this.handleDeath, null, this);
    this.physics.add.overlap(this.player.player, this.calque_echelle,() => { this.player.onScaleOverlap(this.calque_echelle);}, null, this);
    this.physics.add.overlap(
      this.player.player,
      this.enemies,
      () => {
        this.player.takeDamage();
        this.player.blinkRed();
      },
      null,
      this
    );

    // Suivre le joueur avec la caméra
    this.cameras.main.startFollow(this.player.player);
  }

  update() {
    // Mettre à jour le joueur
    if (this.player) {
      this.player.update();
      //console.log("Player update appelé"); // Débogage : Suivre les mises à jour du joueur
    }
    if (this.enemyObjects) {
      this.enemyObjects.forEach((enemy) => {
          if (enemy.update) {
              enemy.update(); // Appeler la méthode update de l'instance d'ennemi
          }
      });
    }  
  
    this.objects.forEach(object => object.update());
    // Exemple de condition de perte de vie
    if (this.playerIsHit) {
      this.player.decreaseLife(); // Enlève une vie
    }

    // Mettre à jour tous les ennemis dans this.enemies
    this.enemies.children.iterate((enemySprite) => {
      // Vérifier si une instance complète d'ennemi existe
      if (enemySprite.instance && enemySprite.instance.update) {
        enemySprite.instance.update(); // Appeler la méthode update de l'instance complète
      }
    });

  // Vérifier si tous les ennemis sont battus
    if (this.enemies.countActive(true) === 0) { // Vérifie si aucun ennemi n'est actif
      this.checkVictoryCondition(); // Appelle une méthode pour gérer la fin
    }
  }

  checkVictoryCondition() {
    if (this.player.hasDiamondHeart) {
      // Si le joueur a le cœur de diamant, passer à une fin spéciale
      this.scene.start("SpecialEnding");
    } else {
      // Sinon, passer à une fin normale
      this.scene.start("NormalEnding");
    }
  }

  updateEnemyText() {
    console.log("Vérification du joueur :", this.player);
    console.log("Vérification du texte des ennemis :", this.enemyText);
    if (this.player) { // Vérifie si le joueur existe
        if (this.enemyText) {
            this.enemyText.setText(`Ennemis battus: ${this.defeatedEnemies}/${this.totalEnemies}`);
        } else {
            console.warn("Le texte des ennemis battus n'existe pas encore ou a été détruit.");
        }
    } else {
        console.warn("Le joueur a été détruit, le texte des ennemis ne sera pas mis à jour.");
    }
}


  updateLifeDisplay() {
    // Change le sprite de la barre de vie en fonction du nombre de vies du joueur
    const lifePoints = this.player.lifePoints;

    // Change l'image de la barre de vie selon les vies restantes
    if (lifePoints >= 5) {
      this.lifeBar.setTexture("full");
    } else if (lifePoints === 4) {
      this.lifeBar.setTexture("1hit");
    } else if (lifePoints === 3) {
      this.lifeBar.setTexture("2hit");
    } else if (lifePoints === 2) {
      this.lifeBar.setTexture("3hit");
    } else if (lifePoints === 1) {
      this.lifeBar.setTexture("4hit");
    }
  }

  handleDeath() {
    console.log("Le joueur est mort !");
    this.player.die(); // Appelle la méthode pour gérer la mort du joueur
  }

  createUIObjects() {
    // Créer une image pour les bottes
    this.swordImage = this.add.image(944, 16, "sword").setOrigin(0, 0).setScale(2);
    this.swordImage.setTint(0x000000); // Applique une teinte noire
    this.swordImage.setScrollFactor(0); // Fixe l'image pour qu'elle ne bouge pas avec la caméra

    this.dashImage = this.add.image(1008, 16, "dash").setOrigin(0, 0).setScale(2);
    this.dashImage.setTint(0x000000); // Applique une teinte noire
    this.dashImage.setScrollFactor(0); // Fixe l'image pour qu'elle ne bouge pas avec la caméra

    this.bootsImage = this.add.image(1072, 16, "boots").setOrigin(0, 0).setScale(2);
    this.bootsImage.setTint(0x000000); // Applique une teinte noire
    this.bootsImage.setScrollFactor(0); // Fixe l'image pour qu'elle ne bouge pas avec la caméra

    this.dreamSwordImage = this.add.image(1136, 16, "upgraded_sword").setOrigin(0, 0).setScale(2);
    this.dreamSwordImage.setTint(0x000000); // Applique une teinte noire
    this.dreamSwordImage.setScrollFactor(0); // Fixe l'image pour qu'elle ne bouge pas avec la caméra

    this.diamondHeartImage = this.add.image(1200, 16, "diamond_heart").setOrigin(0, 0).setScale(2);
    this.diamondHeartImage.setTint(0x000000); // Applique une teinte noire
    this.diamondHeartImage.setScrollFactor(0); // Fixe l'image pour qu'elle ne bouge pas avec la caméra
  }

  updateSwordUI() {
    // Change la couleur des bottes en couleur normale
    if (this.swordImage) {
      this.swordImage.clearTint(); // Enlève la teinte noire
    }
  }
}
