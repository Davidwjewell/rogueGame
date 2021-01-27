class ScatterGun extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y)
    {
        super(scene,x,y,'scatterGun');
        scene.add.existing(this);
    }
}



class LaserAutomaticRifle extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y)
    {
        super(scene,x,y,'laserAutoRifle');
        scene.add.existing(this);
    }
}