export class Crow {
    constructor(scene, x, y, player) {
      this.scene = scene;
      this.player = player;
      this.isDiving = false;
      this.attackCooldown = false; // Pour empêcher l'attaque multiple sans pause
      
      
      // Ajouter le sprite du corbeau avec l'animation de vol par défaut
      this.sprite = this.scene.physics.add.sprite(x, y, 'crow_fly');
      this.sprite.setImmovable(false);
      this.sprite.body.allowGravity = false; // Le corbeau n'est pas affecté par la gravité
  
      // Définir les propriétés
      this.health = 1;
  
      // Jouer l'animation de vol par défaut
      this.sprite.play('fly');63
  
      // Définir la vitesse de déplacement du corbeau
      this.speed = 100; // Vitesse de vol horizontale
  
      // Ajouter un détecteur de proximité
      this.proximitySensor = this.scene.add.circle(x, y, 200); // Rayon de détection de 200 pixels
      this.scene.physics.add.existing(this.proximitySensor);
      this.proximitySensor.body.setCircle(200);
      this.proximitySensor.body.setAllowGravity(false);
      this.proximitySensor.body.setImmovable(true);
  
      // Vérifier les collisions avec le joueur
      this.scene.physics.add.overlap(this.proximitySensor, this.player, this.diveAttack, null, this);
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
      // Déplacer le corbeau horizontalement
      if (!this.isDiving) {
        this.sprite.setVelocityX(this.speed);
        
        // Faire changer de direction lorsqu'il atteint les bords de la scène
        if (this.sprite.x > this.scene.scale.width - 50 || this.sprite.x < 50) {
          this.speed = -this.speed; // Inverser la direction
          this.sprite.flipX = !this.sprite.flipX; // Retourner le sprite
        }
      }
    }
  }  