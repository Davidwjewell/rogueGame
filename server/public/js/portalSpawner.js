class PortalSpawn extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,id) {
        super(scene, x, y, "portalHidden");
        scene.add.existing(this); 
        this.id=id;
        //logic for this spawning and spawning enemy
        }
  
}