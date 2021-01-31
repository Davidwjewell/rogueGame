class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,id)
    {
        super(scene,x,y,'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);  
        this.id=id;
        this.speed=500;
        this.hit=false;
       
        this.playFiredId=null;      
    
    }
}

class RailGunProjectile extends Phaser.Physics.Arcade.Sprite
{
   constructor(scene,x,y,id)
  {
     super(scene,x,y);
     scene.physics.add.existing(this);
     this.id=id;
     this.angle;
     this.hit=false;
     this.playFiredId=null; 
    this.startX=x;
    this.startY=y;
    
    
  }
 
  
  
  
}

class EnemyBulletSkeleton extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,id)
    {
        super(scene,x,y,'skeletonSprites','skeleton-bullet.png');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.hit=false;
        this.id=id;
        this.type=null;
    }
}

function railProjectileCollide(railProjectile)
{

  if (!railProjectile.hit)
{
       railProjectile.hit=true;
      
    }
 
  
  
}


function bulletCollide(bullet)
{
   // bullets.destroy();
if (!bullet.hit)
  {
   
    bullet.hit=true;
  }
  
}


function bulletCollideEnemy(bullet)
{
  if (!bullet.hit)
  {
  bullet.hit=true;
  
  }
  
}
