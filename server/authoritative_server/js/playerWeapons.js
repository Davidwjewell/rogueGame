class ScatterGun extends Phaser.GameObjects.Sprite{
    constructor(config)
    {
    super(config.scene, config.x, config.y,'scatterGun'); 
    this.setSize(10,15,true);
    config.scene.physics.add.existing(this);   
    this.projectiles=3;   //projectiles per attack sequence
    this.fireDelay=500;   //delay between firing
    this.projectileVelocity=100;  //spped of projectiles shot
    this.weaponSpread;  
    }
  
  fireWeapon(scene,player)
  {
    let i=0;
    let angle1=player.angle-1;
    let angle2=player.angle;
    let angle3=player.angle+1;
 
    
    
    
  }
  
}