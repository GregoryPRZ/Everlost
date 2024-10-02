// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

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
    // une scene est un écran de jeu. Pour fonctionner il lui faut 3 fonctions  : create, preload, update
    preload: preload, // la phase preload est associée à la fonction preload, du meme nom (on aurait pu avoir un autre nom)
    create: create, // la phase create est associée à la fonction create, du meme nom (on aurait pu avoir un autre nom)
    update: update, // la phase update est associée à la fonction update, du meme nom (on aurait pu avoir un autre nom)
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// création et lancement du jeu
new Phaser.Game(config);

/******************************** */
//mes variable
var enemy1;
var player;
var clavier;
var nbSaut = 0;
var doubleSaut = false;
var plateformeTypes = ["plateforme_1"]; // Noms des tuiles de plateformes
var platformeHauteurMin = 400; // Hauteur minimale pour les plateformes
var platformeHauteurMax = 600; // Hauteur maximale pour les plateformes
var direction = -1; // -1 pour gauche, 1 pour droite
var vitesse = 100; // vitesse de déplacement de l'ennemi
var limitesGauche = 100; // point limite à gauche
var limitesDroite = 1000; // point limite à droite

/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

/** La fonction preload est appelée une et une seule fois,
 * lors du chargement de la scene dans le jeu.
 * On y trouve surtout le chargement des assets (images, son ..)
 */
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
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48, //64x64
  });

  //cherger l'image balle
  this.load.image("bullet", "src/assets/bullet.png");

  //background
  this.load.image("fond", "src/assets/images/background.png");
}

/***********************************************************************/

/** FONCTION CREATE 
/***********************************************************************/

/* La fonction create est appelée lors du lancement de la scene
 * si on relance la scene, elle sera appelée a nouveau
 * on y trouve toutes les instructions permettant de créer la scene
 * placement des peronnages, des sprites, des platesformes, création des animations
 * ainsi que toutes les instructions permettant de planifier des evenements
 */
function create() {
  // Créer l'image de fond
  const background = this.add.image(0, -250, "fond").setOrigin(0, 0);
  background.setScrollFactor(0); // Cela fixe l'image de fond à la caméra

  // chargement de la carte
  const carteDuNiveau = this.add.tilemap("carte");

  // chargement du jeu de tuiles
  const tileset = carteDuNiveau.addTilesetImage("tuiles_de_jeu", "tuilesJeu");

  // chargement du calque calque_background
  const calque_background = carteDuNiveau.createLayer(
    "calque_background",
    tileset
  );

  // chargement du calque calque_plateformes
  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateformes",
    tileset
  );

  // Configurer les collisions pour le calque des plateformes
  calque_plateformes.setCollisionByProperty({ estSolide: true });
  //touche clavier
  clavier = this.input.keyboard.createCursorKeys();

  /****************************player************************************ */

  player = this.physics.add.sprite(300, 450, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);
  this.physics.add.collider(player, calque_plateformes);
  //touche clavier
  clavier = this.input.keyboard.createCursorKeys();
  //animation gauche
  this.anims.create({
    key: "anim_tourne_gauche",
    frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }),
    frameRate: 10, // vitesse de défilement des frames
    repeat: -1,
  });

  //anim droite
  this.anims.create({
    key: "anim_tourne_droite",
    frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //anim face
  this.anims.create({
    key: "anim_face",
    frames: [{ key: "img_perso", frame: 4 }],
    frameRate: 10,
    repeat: -1,
  });
  // Animation pour se baisser
  this.anims.create({
    key: "anim_baisser",
    frames: [{ key: "img_perso", frame: 6 }], // a modif apres num
    frameRate: 10,
  });

  /*------------------------enemy-----------------------------------------------*/

  enemy1 = this.physics.add.sprite(500, 450, "enemi");
  enemy1.setCollideWorldBounds(true); // S'assurer que l'ennemi ne sort pas des bords du monde
  //enemy1.setBounce(0.1); // Ajouter un léger rebond si nécessaire
  //enemy1.body.allowGravity = false; // Désactiver la gravité
  this.physics.add.collider(enemy1, calque_plateformes);

  // Ajouter un groupe pour les balles de l'ennemi
  enemyBullets = this.physics.add.group({
    defaultKey: "bullet",
    maxSize: 10,
  });

  // Animation et déplacement de l'ennemi
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

  this.physics.world.setBounds(
    0,
    0,
    carteDuNiveau.widthInPixels,
    carteDuNiveau.heightInPixels
  );
  this.cameras.main.setBounds(
    0,
    0,
    carteDuNiveau.widthInPixels,
    carteDuNiveau.heightInPixels
  );

  this.cameras.main.startFollow(player);
}

/***********************************************************************/
/** FONCTION UPDATE 
/***********************************************************************/
//pour modifier les dimension quand le pero se baisse
/*var largeurOriginal = player.body.width;
var hauteurOriginal = player.body.height;*/

function update() {
  // Déplacement de l'ennemi
  if (enemy1.x <= limitesGauche) {
    direction = 1; // Changer de direction vers la droite
  } else if (enemy1.x >= limitesDroite) {
    direction = -1; // Changer de direction vers la gauche
  }

  enemy1.setVelocityX(vitesse * direction); // Appliquer la vitesse selon la direction

  // Animation de l'ennemi en fonction de la direction
  if (direction === -1) {
    enemy1.anims.play("enemy_gauche", true); // Animation pour aller à gauche
  } else {
    enemy1.anims.play("enemy_droite", true); // Animation pour aller à droite
  }
  //touche clavier
  if (clavier.right.isDown == true) {
    player.setVelocityX(160);
    player.anims.play("anim_tourne_droite", true);
  } else if (clavier.left.isDown == true) {
    player.setVelocityX(-160);
    player.anims.play("anim_tourne_gauche", true);
  } // Se baisser
  else if (clavier.down.isDown) {
    player.setVelocityX(0); // Stopper le mouvement horizontal quand on se baisse
    player.setOffset(0, player.height / 2); // Ajuster l'offset pour que le bas du personnage touche toujours le sol
    player.anims.play("anim_baisser", true); // Jouer l'animation pour se baisser
  } else {
    player.setVelocityX(0);
    player.anims.play("anim_face");
    //à modifier
    player.setOffset(0, 0); // Réinitialiser l'offset
  }
  if (player.body.blocked.down) {
    nbSaut = 0; // je met compteur de saut
    doubleSaut = true; // Permet le double saut
  }
  //le saut
  // Gérer le saut avec un seul appui détecté
  if (Phaser.Input.Keyboard.JustDown(clavier.up)) {
    if (nbSaut < 1 && player.body.blocked.down) {
      // Premier saut
      player.setVelocityY(-330);
      nbSaut++;
    } else if (nbSaut === 1 && doubleSaut) {
      // Double saut
      player.setVelocityY(-330);
      nbSaut++; // Le joueur ne peut plus sauter jusqu'à ce qu'il touche le sol
      doubleSaut = false; // Désactiver le double saut
    }
  }
}
/**************************************************************************************************** */
