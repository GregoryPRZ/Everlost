export class Scenario extends Phaser.Scene {
  constructor() {
    super({ key: "Scenario" }); // Clé de la scène pour l'identifier
  }

  create() {
    // Appeler la méthode pour créer le scénario lors de la création de la scène
    this.createScenario();
  }

  createScenario() {
    // Ajouter l'image de scénario
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "scenario"
    );

    // Créer le bouton Start et définir une échelle plus petite
    const startButton = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 315,
        "start"
      )
      .setInteractive()
      .setScale(1); // Réduit la taille du bouton à 10%

    // Ajouter un événement au clic sur le bouton Start
    startButton.on("pointerdown", () => {
      this.sound.play('buttonClick'); // Joue le son
      this.scene.start("MapScene"); // Remplace 'Controle' par le nom de ta scène de contrôle
    });

    // Ajouter un curseur pour le bouton
    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: 1.2, // Agrandir légèrement le bouton au survol
        duration: 300, // Durée de l'animation en millisecondes
        ease: "Power2", // Type d'animation
      });
    });

    startButton.on("pointerout", () => {
      this.tweens.add({
        targets: startButton,
        scale: 1, // Revenir à la taille réduite
        duration: 300, // Durée de l'animation en millisecondes
        ease: "Power2", // Type d'animation
      });
    });
  }
}
