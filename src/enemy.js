export class Enemy {
  constructor(scene, x, y, texture, calque_plateformes) {
    this.scene = scene;

    // Initialisation de l'ennemi
    this.enemy = this.scene.physics.add.sprite(x, y, texture);
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setGravityY(300);

    
    // Collision avec le calque de plateformes
    this.scene.physics.add.collider(
      this.enemy,
      calque_plateformes,
      this.handlePlatformCollision,
      null,
      this
    );

    // Propriétés du comportement
    this.speed = 100;
    this.direction = 1;
    this.shootCooldown = 1000; // Délai entre les tirs (en millisecondes)
    this.lastShotTime = 0; // Dernière fois où l'ennemi a tiré

    // Limites de déplacement
    this.leftLimit = x - 400; // Limite gauche
    this.rightLimit = x + 100; // Limite droite
  }
   // Gérer la collision avec une plateforme
   handlePlatformCollision() {
    console.log("Collision détectée, changement de direction !");
    this.direction *= -1;
    this.enemy.setVelocityX(this.speed * this.direction); // Mise à jour de la vitesse lors du changement de direction
}

  // Mettre à jour l'ennemi à chaque frame
  update() {
    this.move();
    const distanceToPlayer = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, this.scene.player.player.x, this.scene.player.player.y); // Accès à la position du joueur
    
    // Vérifier si le joueur est à portée et si le délai entre les tirs est respecté
    if (distanceToPlayer < 300 && this.scene.time.now > this.lastShotTime + this.shootCooldown) {
        this.shoot();
        this.lastShotTime = this.scene.time.now; // Mettre à jour le temps du dernier tir
    }
  }

  // Déplacement de l'ennemi
  move() {
    // Vérifie si l'ennemi atteint la limite gauche ou droite
    if (this.enemy.x <= this.leftLimit) {
      this.direction = 1; // Change la direction à droite
    } else if (this.enemy.x >= this.rightLimit) {
      this.direction = -1; // Change la direction à gauche
    }

    // Crée des capteurs juste sous le côté gauche et le côté droit de l'ennemi
    const leftSensorX = this.enemy.x - 10; // Capteur côté gauche
    const rightSensorX = this.enemy.x + 10; // Capteur côté droit
    const sensorY = this.enemy.y + this.enemy.height / 2 + 5; // Légèrement sous l'ennemi

    // Vérifie s'il y a une plateforme sous les capteurs
    const tileLeft = this.scene.calque_plateformes.getTileAtWorldXY(leftSensorX, sensorY);
    const tileRight = this.scene.calque_plateformes.getTileAtWorldXY(rightSensorX, sensorY);

    // Si l'ennemi est en train de se déplacer vers la gauche et qu'il n'y a pas de plateforme à gauche
    if (this.direction === -1 && !tileLeft) {
      this.direction = 1; // Change la direction à droite
    }

    // Si l'ennemi est en train de se déplacer vers la droite et qu'il n'y a pas de plateforme à droite
    if (this.direction === 1 && !tileRight) {
      this.direction = -1; // Change la direction à gauche
    }

    // Déplacement de l'ennemi
    this.enemy.setVelocityX(this.speed * this.direction);

    // Animation et inversion de l'échelle selon la direction
    if (this.direction === 1) {
      this.enemy.play("enemy_droite", true); // Joue l'animation pour aller à droite
      this.enemy.setFlipX(false); // Remet à l'échelle normale pour aller à droite
    } else {
      this.enemy.play("enemy_gauche", true); // Joue l'animation pour aller à gauche
      this.enemy.setFlipX(true); // Inverse l'échelle pour tourner l'ennemi vers la gauche
    }
  }

  // Vérifie si le joueur est proche et tire
  checkForPlayerAndShoot(time) {
    const distance = Phaser.Math.Distance.Between(
      this.enemy.x,
      this.enemy.y,
      this.player.x,
      this.player.y
    );

    // Si le joueur est à moins de 200 pixels et que l'ennemi peut tirer
    if (distance < 200 && time > this.lastShotTime + this.shootCooldown) {
      this.shoot();
      this.lastShotTime = time;
    }
  }
  // Fonction pour faire tirer l'ennemi
  shoot() {
    console.log("L'ennemi tire !");
    
    // Créer la balle à la position de l'ennemi
    const bullet = this.scene.physics.add.sprite(this.enemy.x, this.enemy.y, "bullet_texture");

    // Calculer le vecteur directionnel vers le joueur
    const playerX = this.scene.player.player.x;
    const playerY = this.scene.player.player.y;

    const directionX = playerX - this.enemy.x;
    const directionY = playerY - this.enemy.y;

    // Normaliser le vecteur directionnel pour garder une vitesse constante
    const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
    const normalizedX = (directionX / magnitude) * 300; // 300 est la vitesse de la balle
    const normalizedY = (directionY / magnitude) * 300;

    // Appliquer la vélocité calculée à la balle
    bullet.setVelocity(normalizedX, normalizedY);

    // Gérer la collision entre la balle et le joueur
    this.scene.physics.add.collider(bullet, this.scene.player.player, () => {
        console.log("Le joueur est touché !");
        bullet.destroy(); // Détruit la balle lorsqu'elle touche le joueur
        // Ajoute ici la logique pour réduire les points de vie du joueur si nécessaire
        this.scene.player.takeDamage(); // Appelle la fonction pour réduire les vies et clignoter
    });
  }


}
