export class Scenario {
  constructor(scene) {
    this.scene = scene;
    this.createScenario();
  }

  update() {
    this.createScenario();
  }

  createScenario() {
    // Ajouter l'image d'accueil
    this.scene.add.image(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      "scenario"
    );

    // Créer le bouton Start et définir une échelle plus petite
    const startButton = this.scene.add
      .image(
        this.scene.cameras.main.centerX,
        this.scene.cameras.main.centerY + 100,
        "start"
      )
      .setInteractive()
      .setScale(0.15); // Réduit la taille du bouton à 50%

    // Ajouter un événement au clic sur le bouton Start
    startButton.on("pointerdown", () => {
      this.scene.start("Controle"); // Remplace 'GameScene' par le nom de ta scène de jeu
    });

    // Ajouter un curseur pour le bouton
    startButton.on("pointerover", () => {
      startButton.setScale(0.2); // Agrandir légèrement le bouton au survol
    });

    startButton.on("pointerout", () => {
      startButton.setScale(0.15); // Revenir à la taille réduite
    });
  }
}
