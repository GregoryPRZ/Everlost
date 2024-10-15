export class Vine {
    constructor(scene, x, y, texture, player, platforms) {
        this.scene = scene;
        this.player = player;
        this.sprite = this.scene.physics.add.sprite(x, y, texture);
        //this.vine = this.vine;
        
        // Configurer les propriétés de la vigne
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setAllowGravity(false);
        
       
        
    }
   
    
    

    setupAnimations() {
        // Créer une animation de balancement léger pour les lianes
        this.scene.anims.create({
            key: 'swaying_vine',
            frames: this.scene.anims.generateFrameNumbers('vine', { start: 0, end: 7 }),
            frameRate: 8, // Plus bas pour un balancement lent
            repeat: -1 // Répéter indéfiniment
        });
        
        // Jouer l'animation de balancement pour rendre les lianes plus dynamiques
        this.sprite.play('swaying_vine');
    }
    
    

    update() {
        // Mettre à j
    }
}
