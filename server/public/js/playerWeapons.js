class ScatterGun extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y)
    {
        super(scene,x,y,'scatterGun');
        scene.add.existing(this);
        this.shots=3;
        
      

    }
}