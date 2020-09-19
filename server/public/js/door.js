class Door extends Phaser.GameObjects.Sprite{
    constructor(config)
    {
    super(config.scene, config.x, config.y,'doorSprites','door anim_Animation 1_11.png');  
    config.scene.add.existing(this);
    }
  
}