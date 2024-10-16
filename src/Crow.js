export class Crow {
  constructor(scene, x, y, player) {
    this.scene = scene;
    this.player = player;
    this.isDiving = false;
    this.attackCooldown = false;
    
    // Ajouter le sprite du corbeau avec l'animation de vol par défaut
    this.sprite = this.scene.physics.add.sprite(x, y, 'crow_fly');
    this.sprite.setImmovable(false);
    this.sprite.body.allowGravity = false; // Le corbeau n'est pas affecté par la gravité

    // Définir les propriétés
    this.health = 1;

    // Jouer l'animation de vol par défaut
    this.sprite.play('fly');

    // Définir la vitesse de déplacement du corbeau
    this.speed = -100; // Vitesse de vol horizontale vers la gauche

    // Assurer que le sprite est orienté pour voler vers la gauche
    this.sprite.setFlipX(true);
  }

  diveAttack() {
    if (!this.isDiving && !this.attackCooldown) {
      this.isDiving = true;
      this.attackCooldown = true;
      
      // Déclencher l'animation d'attaque
      this.sprite.play('dive');

      // Calculer la direction pour plonger vers le joueur
      const targetX = this.player.x;
      const targetY = this.player.y + 50; // Ajuster la position cible pour imiter une attaque en piqué

      // Faire plonger le corbeau vers le joueur
      this.scene.tweens.add({
        targets: this.sprite,
        x: targetX,
        y: targetY,
        duration: 500,
        ease: 'Power1',
        onComplete: () => {
          // Infliger des dégâts au joueur lors de l'impact
          this.player.takeDamage(1);
          
          // Remonter le corbeau après l'attaque
          this.flyUp();
        }
      });
    }
  }

  flyUp() {
    // Faire remonter le corbeau après l'attaque
    const originalY = this.sprite.y - 150; // Remonte de 150 pixels vers le haut
    this.scene.tweens.add({
      targets: this.sprite,
      y: originalY,
      duration: 500,
      ease: 'Power1',
      onComplete: () => {
        this.isDiving = false;
        
        // Revenir à l'animation de vol
        this.sprite.play('fly');

        // Ajouter un délai avant la prochaine attaque
        this.scene.time.delayedCall(4000, () => {
          this.attackCooldown = false;
        });
      }
    });
  }

  update() {
    // Déplacer le corbeau continuellement vers la gauche
    if (!this.isDiving) {
      this.sprite.setVelocityX(this.speed);

      // Si le corbeau sort par la gauche de la scène, le repositionner à droite
      if (this.sprite.x < -50) {
        this.sprite.x = this.scene.scale.width + 50; // Réapparaît à droite, hors de la vue
      }

      // Vérifier la proximité avec le joueur pour déclencher l'attaque
      const distanceToPlayer = Phaser.Math.Distance.Between(
        this.sprite.x, this.sprite.y, this.player.x, this.player.y
      );

      // Si le corbeau est à portée de 200 pixels du joueur, il attaque
      if (distanceToPlayer < 200 && !this.isDiving && !this.attackCooldown) {
        this.diveAttack();
      }
    }
  }
}
