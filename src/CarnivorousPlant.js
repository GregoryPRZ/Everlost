export class CarnivorousPlant {
    constructor(scene, x, y, player, platforms) {
      this.scene = scene;
      this.player = player;
      this.platforms = platforms;
      this.isAttacking = false;
  
      // Ajouter le sprite avec l'animation statique par défaut
      this.sprite = this.scene.physics.add.sprite(x, y, 'carnivorous_plant_idle');
      this.sprite.setImmovable(true);
      this.sprite.body.allowGravity = false;
  
      // Démarrer l'animation idle au début
      this.sprite.play('idle');
  
      // Définir les propriétés
      this.health = 3;
  
      // Ajouter un détecteur de proximité
      this.proximitySensor = this.scene.add.circle(x, y, 100);
      this.scene.physics.add.existing(this.proximitySensor);
      this.proximitySensor.body.setCircle(100);
      this.proximitySensor.body.setAllowGravity(false);
      this.proximitySensor.body.setImmovable(true);
  
      // Vérifier les collisions avec le joueur
      this.scene.physics.add.overlap(this.proximitySensor, this.player, this.startAttack, null, this);
    }
  
    startAttack() {
      if (!this.isAttacking) {
        this.isAttacking = true;
        
        // Jouer l'animation d'attaque
        this.sprite.play('attack');
        
        // Code pour infliger des dégâts au joueur
        this.player.takeDamage(1);
  
        // Ajouter un délai pour revenir à l'animation statique après l'attaque
        this.scene.time.delayedCall(1000, this.stopAttack, [], this);
      }
    }
  
    stopAttack() {
      this.isAttacking = false;
      this.sprite.play('idle'); // Revenir à l'animation statique
    }
  
    update() {
      // Vérifier la distance avec le joueur
      const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.player.x, this.player.y);
      if (distance < 100) {
        this.startAttack();
      }
    }
  }
    