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
      debug: false, // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
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

/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

/** La fonction preload est appelée une et une seule fois,
 * lors du chargement de la scene dans le jeu.
 * On y trouve surtout le chargement des assets (images, son ..)
 */
function preload() {
  this.load.image("fond", "./src/assets/sky.png");
  this.load.image("img_plateforme","src/assets/platform.png");
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48, //64x64
  });
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

  player = this.physics.add.sprite(300, 450, "img_perso");
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player,groupe_plateformes);
  player.setBounce(0.2);

  //touche clavier
  clavier = this.input.keyboard.createCursorKeys(); 
  
}

/***********************************************************************/
/** FONCTION UPDATE 
/***********************************************************************/

function update() {
  //touche clavier
  if (clavier.right.isDown == true) {
    player.setVelocityX(160);
  } else if(clavier.left.isDown == true){
    player.setVelocityX(-160);
  }else{
    player.setVelocityX(0);
  }
}
