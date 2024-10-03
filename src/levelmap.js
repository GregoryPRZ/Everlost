export class Level {
  constructor(scene) {
    this.scene = scene;
    this.blocks = ["bloc1", "bloc2", "bloc3", "bloc4", "bloc5", "bloc6"];
    this.platforms = this.scene.physics.add.staticGroup(); // Groupement de plateformes statiques
    this.mapWidth = 7080; // Largeur maximale de la carte
    this.mapHeight = 3072; // Hauteur maximale de la carte
    this.platformHeight = 700; // Hauteur entre chaque niveau de colonnes
    this.platformSpacingX = 500; // Espacement entre les plateformes sur l'axe X
    this.startY = 2800; // Position de départ sur l'axe Y pour les plateformes
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
          .setOrigin(0, 0);
        platform.body.immovable = true; // Assurez-vous que la plateforme ne bouge pas
        platform.body.setSize(platform.width, platform.height); // S'assurer que le corps a la bonne taille
        lastX += this.platformSpacingX; // Espacement pour la prochaine plateforme
      }
    }
  }
}
