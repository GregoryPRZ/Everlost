// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

import { SceneMenu } from "./SceneMenu.js";
import { Scenario } from "./scenario.js";
import { Controle } from "./controle.js";
import { GameOver } from "./GameOver.js";
import { MapScene } from "./MapScene.js";
import { PreloadScene } from "./Preload.js";
import { GoodEnd } from "./GoodEnd.js";
import { BadEnd } from "./BadEnd.js";
import { Credits } from "./credits.js";

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
        y: 500, // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: false, // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    },
  },
  scene: [PreloadScene, SceneMenu, Scenario, Controle, Credits, MapScene, GameOver, GoodEnd, BadEnd],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// création et lancement du jeu
new Phaser.Game(config);

/******************************** */ // mes variables

/***********************************************************************/

/** FONCTION CREATE 
/***********************************************************************/

/**************************************************************************************************** */
