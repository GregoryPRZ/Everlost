export class CarnivorousPlant {
    constructor(scene, x, y, texture, player, platforms) {
      this.scene = scene;
      this.player = player;
      this.health = 3; // Points de vie
      this.speed = 0; // Statique, pas de déplacement
      this.damage = 1; // Dégâts infligés au joueur
  
      // Création du sprite de la plante carnivore
      this.sprite = this.scene.physics.add.sprite(x, y, texture);
      this.sprite.setCollideWorldBounds(true);
      this.sprite.body.setAllowGravity(false); // Pas d'effet de gravité pour une plante
  
      // Ajouter des collisions
      this.scene.physics.add.collider(this.sprite, platforms);
  
      // Détection de la proximité du joueur
      this.scene.physics.add.overlap(this.player.player, this.sprite, this.onPlayerApproach, null, this);
  
      // Comportement lorsque la plante mord le joueur
      this.isAttacking = false;
  
      // Animation de la plante (à configurer dans la scène si nécessaire)
      this.setupAnimations();
    }
  
    setupAnimations() {
      this.scene.anims.create({
        key: 'emerge',
        frames: this.scene.anims.generateFrameNumbers('carnivorous_plant', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: 0 // L'animation se joue une seule fois
      });
  
      this.scene.anims.create({
        key: 'attack',
        frames: this.scene.anims.generateFrameNumbers('carnivorous_plant', { start: 4, end: 7 }),
        frameRate: 6,
        repeat: -1 // L'animation se joue en boucle pendant l'attaque
      });
  
      this.scene.anims.create({
        key: 'idle',
        frames: this.scene.anims.generateFrameNumbers('carnivorous_plant', { start: 8, end: 8 }),
        frameRate: 1,
        repeat: -1
      });
    }
  
    onPlayerApproach(player, plant) {
      if (!this.isAttacking) {
        this.isAttacking = true;
        this.sprite.play('emerge');
  
        // Déplacer la plante vers le joueur (ou changer son état pour mordre)
        this.scene.time.delayedCall(1000, () => {
          this.sprite.play('attack');
          this.attackPlayer(player);
        });
      }
    }
  
    attackPlayer(player) {
      if (this.health > 0) {
        // Réduire la santé du joueur si la plante mord
        console.log("La plante carnivore attaque !");
        player.takeDamage(this.damage); // Supposons que la classe Player ait une méthode takeDamage()
      }
    }
  
    takeDamage(amount) {
      this.health -= amount;
      if (this.health <= 0) {
        this.die();
      }
    }
  
    die() {
      // Supprimer le sprite de la plante du jeu
      this.sprite.destroy();
      console.log("La plante carnivore a été détruite.");
    }
  
    update() {
      // Gestion de l'état et de l'animation
      if (this.health <= 0) {
        return;
      }
  
      if (!this.isAttacking) {
        this.sprite.play('idle', true);
      }
    }
  }
  