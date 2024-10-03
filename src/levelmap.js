export class Level {
  constructor(scene) {
    this.scene = scene;
    this.blocks = ["bloc1", "bloc2", "bloc3", "bloc4", "bloc5"];
    this.platforms = this.scene.physics.add.staticGroup();
    this.mapWidth = 7080;
    this.mapHeight = 3072;
    this.platformHeight = 700;
    this.platformSpacingX = 500;
    this.startY = 2800;
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
}
