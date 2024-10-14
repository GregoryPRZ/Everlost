export class Controle extends Phaser.Scene {
  constructor() {
    super({ key: "Controle" }); // Clé de la scène pour l'identifier
  }

  create() {
    // Appeler la méthode pour créer les contrôles lors de la création de la scène
    this.createControle();
  }

  createControle() {
    // Ajouter l'image de contrôle
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "controle"
    );

    // Créer le bouton Start (jouer)
    const startButton = this.add
      .image(
        this.cameras.main.centerX + 510,
        this.cameras.main.centerY + 195,
        "start"
      )
      .setInteractive()
      .setScale(1); // Taille du bouton

    // Ajouter un événement au clic sur le bouton Start
    startButton.on("pointerdown", () => {
      this.sound.play('buttonClick'); // Joue le son
      this.scene.start("Scenario"); // Remplace 'SceneMenu' par le nom de ta scène précédente
    });

    // Ajouter un curseur pour le bouton avec une animation douce
    startButton.on("pointerover", () => {
      this.tweens.add({
        targets: startButton,
        scale: 1.2, // Agrandir légèrement le bouton au survol
        duration: 200, // Durée de l'animation
        ease: "Power1", // Type d'animation
      });
    });

    startButton.on("pointerout", () => {
      this.tweens.add({
        targets: startButton,
        scale: 1, // Revenir à la taille réduite
        duration: 200, // Durée de l'animation
        ease: "Power1", // Type d'animation
      });
    });

    // Créer le bouton Retour, positionné 150 pixels en dessous du bouton Start
    const retourButton = this.add
      .image(
        this.cameras.main.centerX + 510,
        this.cameras.main.centerY + 300,
        "retour"
      )
      .setInteractive()
      .setScale(1); // Taille du bouton Retour

    // Ajouter un événement au clic sur le bouton Retour
    retourButton.on("pointerdown", () => {
      this.sound.play('buttonClick'); // Joue le son
      this.scene.start("SceneMenu"); // Lance la scène du menu
    });

    // Ajouter un curseur pour le bouton Retour avec une animation douce
    retourButton.on("pointerover", () => {
      this.tweens.add({
        targets: retourButton,
        scale: 1.2, // Agrandir légèrement le bouton au survol
        duration: 200, // Durée de l'animation
        ease: "Power1", // Type d'animation
      });
    });

    retourButton.on("pointerout", () => {
      this.tweens.add({
        targets: retourButton,
        scale: 1, // Revenir à la taille réduite
        duration: 200, // Durée de l'animation
        ease: "Power1", // Type d'animation
      });
    });
  }
}
