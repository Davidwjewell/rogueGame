class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,id)
    {
        super(scene,x,y,'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);  
        this.id=id;
        this.speed=500;
        this.hit=false;
        this.angle=0;
        this.playFiredId=null;      
    
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


function bulletCollide(bullet)
{
   // bullets.destroy();
if (!bullet.hit)
  {
   
/*
  if (bulletArray[bullets.id])
   {
  
  bulletArray[bullets.id].hitX=bullets.x;
  bulletArray[bullets.id].hitY=bullets.y;  
   }
  */
    
    bullet.hit=true;
  }
  
}


function bulletCollideEnemy(bullet)
{
  if (!bullet.hit)
  {
  bullet.hit=true;
  //bulletArrayEnemy[bullet.id].hitX=bullet.x;
  //bulletArrayEnemy[bullet.id].hitY=bullet.y;  
  }
  
}
