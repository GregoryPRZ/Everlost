// Level.js
export class Level extends Phaser.Scene {
  constructor() {
    super({ key: "Level" }); // Définir la clé de la scène
    this.blocks = ["bloc1", "bloc2", "bloc3", "bloc4", "bloc5"];
    this.platforms = null;
    this.mapWidth = 7080;
    this.mapHeight = 3072;
    this.platformHeight = 700;
    this.platformSpacingX = 500;
    this.startY = 2800;
  }

  preload() {
    // Charger les blocs (assurez-vous que les images existent dans votre répertoire)
    for (const block of this.blocks) {
      this.load.image(block, `src/assets/${block}.png`);
    }
  }

  create() {
    this.platforms = this.physics.add.staticGroup();
    this.generateColumnsOfPlatforms();
  }

  generateColumnsOfPlatforms() {
    const numberOfColumns = Math.floor(this.mapHeight / this.platformHeight);

    for (let column = 0; column < numberOfColumns; column++) {
      const baseY = this.startY - column * this.platformHeight;
      let lastX = 500;

      while (lastX < this.mapWidth) {
        const blockKey =
          this.blocks[Phaser.Math.Between(0, this.blocks.length - 1)];
        const platform = this.platforms
          .create(lastX, baseY, blockKey)
          .setOrigin(0.5, 0.5); // Centrer l'image
        platform.body.immovable = true;
        platform.body.setSize(platform.width, platform.height, false); // Réajuster la hitbox
        lastX += this.platformSpacingX;
      }
    }
  }

  update() {
    // Logique de mise à jour si nécessaire
  }
}
