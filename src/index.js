// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 1320, // largeur en pixels
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
var groupe_plateformes;
var player;
var clavier;
var nbSaut = 0;
var doubleSaut = false;
var cartes = ["map.json", "map1.json", "map2.json", "map3.json"];
var plateformeTypes = ["plateforme_1", "plateforme_2", "plateforme_3"]; // Noms des tuiles de plateformes
var platformeHauteurMin = 400; // Hauteur minimale pour les plateformes
var platformeHauteurMax = 600; // Hauteur maximale pour les plateformes

/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

/** La fonction preload est appelée une et une seule fois,
 * lors du chargement de la scene dans le jeu.
 * On y trouve surtout le chargement des assets (images, son ..)
 */
function preload() {
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48, //64x64
  });
  this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");

  // Charger les cartes
  cartes.forEach(function (carte) {
    this.load.tilemapTiledJSON(
      carte.replace(".json", ""),
      `src/assets/${carte}`
    );
  }, this);
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
  this.add.image(660, 360, "fond");
  groupe_plateformes = this.physics.add.staticGroup();
  groupe_plateformes.create(460, 645, "img_plateforme");
  groupe_plateformes.create(860, 645, "img_plateforme");
  groupe_plateformes.create(860, 490, "img_plateforme");
  groupe_plateformes.create(410, 350, "img_plateforme");
  //touche clavier
  clavier = this.input.keyboard.createCursorKeys();

  // Choisir une carte aléatoire
  carteChoisie = cartes[Math.floor(Math.random() * cartes.length)];
  const carteDuNiveau = this.add.tilemap(carteChoisie.replace(".json", ""));

  const tileset = carteDuNiveau.addTilesetImage(
    "tuiles_de_jeu",
    "Phaser_tuilesdejeu"
  );
  const calque_background = carteDuNiveau.createLayer(
    "calque_background",
    tileset
  );
  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateformes",
    tileset
  );

  player = this.physics.add.sprite(300, 450, "img_perso");
  player.setCollideWorldBounds(true);
  player.setBounce(0.2);

  //touche clavier
  clavier = this.input.keyboard.createCursorKeys();
  //animation gauche
  this.anims.create({
    key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
    frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
    frameRate: 10, // vitesse de défilement des frames
    repeat: -1, // nombre de répétitions de l'animation. -1 = infini
  });
  //anim droite
  this.anims.create({
    key: "anim_tourne_droite",
    frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });
  //anim face
  this.anims.create({
    key: "anim_face",
    frames: [{ key: "img_perso", frame: 4 }],
    frameRate: 10,
  });

  calque_plateformes.setCollisionByProperty({ estSolide: true });
  this.physics.add.collider(player, calque_plateformes);

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
var largeurOriginal = player.body.width;
var hauteurOriginal = player.body.height;

function update() {
  //touche clavier
  if (clavier.right.isDown == true) {
    player.setVelocityX(160);
    player.anims.play("anim_tourne_droite", true);
  } else if (clavier.left.isDown == true) {
    player.setVelocityX(-160);
    player.anims.play("anim_tourne_gauche", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("anim_face");
  }
  //fonction chaut
  /*if(clavier.up.isDown && player.body.blocked.down){
    player.setVelocityY(-200);
  }*/
  if (player.body.blocked.down) {
    nbSaut = 0; // je met compteur de saut
    doubleSaut = true; // Permet le double saut
  }

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
  //fonction se baiser à ajuster
  /*if(clavier.down.isDown){
    player.setSize(largeurOriginal,hauteurOriginal / 2);
    player.setOffset(0,hauteurOriginal / 2);

    player.anims.play('seBaisser', true);//pour l'animation se baisser sur l'image
  }/*else {
    // Revenir à la taille normale quand la touche bas est relâchée
    player.setSize(originalWidth, originalHeight); // Rétablir la taille originale
    player.setOffset(0, 0); // Réinitialiser l'offset

    // Facultatif : revenir à l'animation de marche/debout
    player.anims.play('Debou', true);
  }*/
  /****************************************************************************** */

  /* if (clavier.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-200);
  }*/
}
