class SlimeEnemy extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,id)
    {
      
        super(scene,x,y,'slimeEnemy');
        scene.add.existing(this);
        this.type='slime';
        this.id=id;
        this.hit=false;
        this.death=false;
        this.checkHit=true;
        this.hitTime=0;
        this.flashTime=150;
    }


        updateEnemy(time,scene)
        {
  
 
    //enemy is dead play animation
           if (this.death)
          {
          var blobDeathAnimation=scene.add.sprite(this.x,this.y,'playerSprites','death_blob death_00.png');
          this.destroy();   

          blobDeathAnimation.anims.play('blobDeath',false).once('animationcomplete', ()=>{
          blobDeathAnimation.destroy(); 
        
          });
        
      }
        else
        {
        if (this.hit) //if hit
        {
          
     
            if (this.checkHit)
            {
            this.checkHit=false;
            this.hitTime=time;
            this.setTintFill('0xFFFFFF');
          
            }
          
          
            if (time-this.hitTime>this.flashTime)
            {
                //clear white hit to false
                
                this.clearTint();
                this.hit=false;
                this.checkHit=true;
            }
        
        }

   this.anims.play('blobMove',true);
    
  }
    
  }
  


}



class SkeletonEnemy extends Phaser.GameObjects.Container{
    constructor(scene,x,y,id)
    {
    super(scene,x,y);
    scene.add.existing(this);
    this.id=id;  
    this.moveDelay=1000;
    this.type='skeletonEnemy';
    this.hit=false;
    this.checkHit=true;
    this.hitTime=0;
    this.flashTime=150;
    this.moving=true;
    this.fireTime=0;
    this.fireDelay=500; 
    this.health=200; // 4 shots
    this.speed=40;
    this.shotDistance=150;
    this.totalShots=0;
    this.shotGroup=2;
    this.projectilespeed=400;
    this.idle=false;
    this.idleTime=5000;
    this.idleStart=0;
    this.angle=0;  // angle to player used to flip sprite / gun
    this.spawning=true; //spawn animation control
    this.playSpawnAnimation=true;
    this.activeState=false;  
    this.inRange=false;
    this.setSize(10,15);
  
    this.weaponSprite=scene.add.sprite(0,0,'skeletonSprites','skeleton-weapon.png');
    //this.weaponSprite.setDepth(1);
    
    this.weaponSprite.setSize(10,15,true);
    //this.weaponSprite.setCollideWorldBounds(true);
     //body sprite
    this.bodySprite=scene.add.sprite(0,0,'skeletonSprites','skeleton-idle-00.png');
    this.bodySprite.setSize(10,15,true);
    //this.bodySprite.setCollideWorldBounds(true);
      this.add(this.bodySprite);
      this.add(this.weaponSprite);
            
   
            

   
    }
  
  updateEnemy(time,scene)
  {
    console.log('update skeleton');
    //iof spawn play animation
    if (this.spawning)
      {
        if (this.playSpawnAnimation)
          {
             this.playSpawnAnimation=false;
             this.bodySprite.anims.play('skeletonSpawn',false).once('animationcomplete', ()=>{
             this.activeState=true;
             });
            

          }

      }
    
          if (this.hit) //if hit
                {
                    if (this.checkHit)
                    {
                     this.checkHit=false;
                    this.hitTime=time;
                    this.bodySprite.setTintFill('0xFFFFFF');
                    this.weaponSprite.setTintFill('0xFFFFFF');
                    }
                    if (time-this.hitTime>this.flashTime)
                    {
                        //clear white hit to false
                        //console.log('clear tint');
                        this.bodySprite.clearTint();
                        this.weaponSprite.clearTint();
                        this.hit=false;
                        this.checkHit=true;
                    }
                
                }
    
    if (this.activeState)
        {
        if (this.moving)
        {
          
        this.weaponSprite.setRotation(this.angle);
          
        this.bodySprite.anims.play('skeletonWalk',true);
        
        }
    
    if (this.idle)
        {
         this.bodySprite.anims.play('skeletonIdle',true);
        }
        
      }
    
    if ((this.angle * (180/Math.PI)>90) || ((this.angle * (180/Math.PI) > -180) && (this.angle * (180/Math.PI) < -90)))
    {
    //flip player body sprite   
      this.bodySprite.flipX=true;
      this.weaponSprite.flipY=true;
     }
    else
    {
      this.bodySprite.flipX=false;
      this.weaponSprite.flipY=false;

    } 
    
    if (this.death)
      {
         var skeletonDeathAnimation = scene.add.sprite(this.x,this.y,'skeletonSprites','skeleton-spawn-13.png');
         this.destroy();   
    
         
        if ((this.angle * (180/Math.PI)>90) || ((this.angle * (180/Math.PI) > -180) && (this.angle * (180/Math.PI) < -90)))
        {
        //flip sprite if facing left
         skeletonDeathAnimation.flipX=true;
         
        }
         skeletonDeathAnimation.anims.play('skeletonDeath',false);
      }
    
  }
}


/*
class banditEnemy extends Phaser.GameObjects.Container{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        scene.add.existing(this);
        this.type='bandit';
        this.hit=false;
        this.checkHit=true;
        this.hitTime=0;
        this.flashTime=150;
        this.angle=0;
        this.moving=true;
        this.fireDelay=400;
        this.shotDistance=300;
        this.shotGroup=3;
        this.totalShots=0;
        this.idle=false;
        this.idleTime=2000;
        this.idleStart=0;
        this.speed=30;
        this.fireTime=0;
        this.health=250; // 5 shots
        this.inRange=false;
        this.projectilespeed=400;
        this.setSize(10,15);
        scene.physics.world.enable(this);
        

        this.weaponSprite=scene.physics.add.sprite(0,0,'banditSprites','bandit_gun.png');
        this.weaponSprite.setSize(10,15,true);
        this.bodySprite=scene.physics.add.sprite(0,0,'banditSprites','bandit_idle_00.png');
        this.bodySprite.setSize(10,15,true);

        this.add(this.bodySprite);
        this.add(this.weaponSprite);
    }

    updateEnemy(scene,time)
    {
        if (this.hit) //if hit
        {
            if (this.checkHit)
            {
             this.checkHit=false;
            this.hitTime=time;
           // console.log(enemy);
            this.bodySprite.setTintFill('0xFFFFFF');
            this.weaponSprite.setTintFill('0xFFFFFF');
            }
            if (time-this.hitTime>this.flashTime)
            {
                //clear white hit to false
                //console.log('clear tint');
                this.bodySprite.clearTint();
                this.weaponSprite.clearTint();
                this.hit=false;
                this.checkHit=true;
            }
        
        }

        if (this.idle)
        {
            if (time-this.idleStart<this.idleTime)
            {
                this.bodySprite.anims.play('banditIdle',true);
            }
            else
            {
                this.idle=false;
                this.totalShots=0; // reset shots to 0
            }
        }
        setGunAngle(this);
    if (!this.idle)
    {
        
        if ((Phaser.Math.Distance.Between(this.x,this.y,newPlayer.x,newPlayer.y)< this.shotDistance)) //&& 
             // player in range
        {
            this.inRange=true; // player in range
            this.moving=false; // dont move
        }
        else
        {
            this.inRange=false; // player not in range
            this.moving=true;
        }
        //console.log('range '+enemy.inRange);
       // console.log('moving' +enemy.moving);
        if (this.inRange)
        {
            //setGunAngle(enemy);
            this.body.setVelocity(0,0);
            
            //fire projectile
            if (time-this.fireTime>this.fireDelay || this.fireTime==0)
            {
            this.fireTime=time;
            let newEnemyBullet= new Bullet(scene,this.x,this.y);
            newEnemyBullet.setSize(10,10,true);     
            newEnemyBullet.setRotation(this.angle);
            scene.physics.moveTo(newEnemyBullet,newPlayer.x,newPlayer.y,this.projectilespeed);
            enemyBullets.add(newEnemyBullet);
            this.totalShots++;
            }


        }

        if (this.totalShots==this.shotGroup)
        {
            
            this.idle=true;
            this.idleStart=time;
        }
        

        if (this.moving)
        {
        //console.log('move');    
        scene.physics.moveTo(this,newPlayer.x,newPlayer.y,this.speed);
        this.bodySprite.anims.play('banditRun',true);
        }   

    }            
    }

    onHit(scene)
    {
        if (this.health<=0)
        {
    
         var banditDeathAnimation = scene.add.sprite(this.x,this.y,'banditSprites','bandit_death_00.png');
         this.destroy();   
    
           
        if ((this.angle * (180/Math.PI)>90) || ((this.angle * (180/Math.PI) > -180) && (this.angle * (180/Math.PI) < -90)))
        {
        //flip sprite if facing left
         banditDeathAnimation.flipX=true;
        }
    
         banditDeathAnimation.anims.play('banditDeath', false);
        }
        else
        {
        this.hit=true;
        }  
    }
}




    onHit(scene)
    {
        if (this.health<=0)
        {
         var skeletonDeathAnimation = scene.add.sprite(this.x,this.y,'skeletonSprites','skeleton-spawn-13.png');
         this.destroy();   
    
         
        if ((this.angle * (180/Math.PI)>90) || ((this.angle * (180/Math.PI) > -180) && (this.angle * (180/Math.PI) < -90)))
        {
        //flip sprite if facing left
         skeletonDeathAnimation.flipX=true;
         
        }
         skeletonDeathAnimation.anims.play('skeletonDeath',false).once('animationcomplete', ()=>{
        //skeletonDeathAnimation.destroy();      
         });
        }
        else
        {
            this.hit=true;
        }
    }

    updateEnemy(scene,time)
    {
        if (this.spawning) //if spawning
                {
                    if (this.playSpawnAnimation)
                    {
                     this.playSpawnAnimation=false;   
                    this.bodySprite.anims.play('skeletonSpawn',false,0).once('animationcomplete', ()=>{
                        this.spawning=false;
                        });
                    }
                }

                if (!this.spawning)

            {

                if (this.hit) //if hit
                {
                    if (this.checkHit)
                    {
                     this.checkHit=false;
                    this.hitTime=time;
                    this.bodySprite.setTintFill('0xFFFFFF');
                    this.weaponSprite.setTintFill('0xFFFFFF');
                    }
                    if (time-this.hitTime>this.flashTime)
                    {
                        //clear white hit to false
                        //console.log('clear tint');
                        this.bodySprite.clearTint();
                        this.weaponSprite.clearTint();
                        this.hit=false;
                        this.checkHit=true;
                    }
                
                }

                if (this.idle)
                {
                    if (time-this.idleStart<this.idleTime)
                    {
                        this.bodySprite.anims.play('skeletonIdle',true);
                    }
                    else
                    {
                        this.idle=false;
                        this.totalShots=0;
                    }
                }
                setGunAngle(this);
                if (!this.idle)
                {
               
                if ((Phaser.Math.Distance.Between(this.x,this.y,newPlayer.x,newPlayer.y)< this.shotDistance)) //&& 
                     // player in range
                {
                    this.inRange=true; // player in range
                    this.moving=false; // dont move
                }
                else
                {
                    this.inRange=false; // player not in range
                    this.moving=true;
                }
                //console.log('range '+enemy.inRange);
               // console.log('moving' +enemy.moving);
                if (this.inRange)
                {
                    
                    
                    //setGunAngle(enemy);
                    this.body.setVelocity(0,0);
                    //console.log('in range');
                    //fire projectile
                    if (time-this.fireTime>this.fireDelay || this.fireTime==0)
                    {
                    this.fireTime=time;
                    let newEnemyBullet= new EnemyBulletSkeleton(scene,this.x,this.y);
                    newEnemyBullet.setSize(10,10,true);     
                    //newEnemyBullet.setRotation(angle);
                    scene.physics.moveTo(newEnemyBullet,newPlayer.x,newPlayer.y,this.projectilespeed);
                    enemyBullets.add(newEnemyBullet);
                    this.totalShots++;
                    }
                    

                }
                if (this.totalShots==this.shotGroup)
                {
                    
                    this.idle=true;
                    this.idleStart=time;
                }
              

                if (this.moving)
                {
                //console.log('move');    
                scene.physics.moveTo(this,newPlayer.x,newPlayer.y,this.speed);
                this.bodySprite.anims.play('skeletonWalk',true);
                }
                
                }
            }   
    }
}


/*
    onHit(scene)
    {
        if (this.health<=0)
    {

    var blobDeathAnimation=scene.add.sprite(this.x,this.y,'playerSprites','death_blob death_00.png');
    this.destroy();   

    blobDeathAnimation.anims.play('blobDeath',false).once('animationcomplete', ()=>{
    blobDeathAnimation.destroy(); 
        
    });
    }
    else
    {
        this.hit=true;
    }

    }

    updateEnemy(scene,time)
    {
      
      this.x += (this.target_x - this.x) * 0.16;
      this.y += (this.target_y - this.y) * 0.16;
      
        if (this.hit) //if hit
        {
            if (this.checkHit)
            {
             this.checkHit=false;
            this.hitTime=time;
            this.setTintFill('0xFFFFFF');
          
            }
            if (time-this.hitTime>this.flashTime)
            {
                //clear white hit to false
                //console.log('clear tint');
                this.clearTint();
                this.hit=false;
                this.checkHit=true;
            }
        
        }

        this.anims.play('blobMove',true);  
        
    }
}
*/

/*
function spawnSlime(portal,scene)
{
    console.log(portal);
    console.log(scene);
    portal.anims.play('portalSpawnEnemy',false).once('animationcomplete', ()=>{

    
    var newSlime= new SlimeEnemy(scene,portal.x,portal.y+20);
    newSlime.speed+=newPlayer.coins; 
    newSlime.setCollideWorldBounds(true);
    newSlime.setSize(10,10,true);
    this.enemies.add(newSlime);
    portal.setTexture('playerSprites','portal animation_Animation 2_22.png');
    
    portal.numEnemies--; 

}); 

}

function setGunAngle(enemy)
{
    
enemy.angle=Phaser.Math.Angle.Between(enemy.x,enemy.y,newPlayer.x,newPlayer.y);

enemy.weaponSprite.setRotation(enemy.angle); 


  if ((enemy.angle * (180/Math.PI)>90) || ((enemy.angle * (180/Math.PI) > -180) && (enemy.angle * (180/Math.PI) < -90)))
{
    //flip player body sprite
    
    enemy.bodySprite.flipX=true;
    enemy.weaponSprite.flipY=true;
}
else
{
   
    enemy.bodySprite.flipX=false;
    enemy.weaponSprite.flipY=false;

} 

}



function spawnBanditEnemy(scene,door)
{
    door.anims.play('doorOpen',false).once('animationcomplete', ()=>{
        bandit = new banditEnemy(scene,door.x,door.y);
        bandit.projectilespeed+=newPlayer.coins; // add coins to projectile speed
        enemies.add(bandit);
        door.anims.play('doorClose',false);
    });
}


function spawnSkeleton(scene,wallLayer)
{
    var spawn=true;
    const x = Phaser.Math.RND.between(0,800);
    const y = Phaser.Math.RND.between(0,800);

    var newSkeleton = new SkeletonEnemy(scene,x,y);
    newSkeleton.projectilespeed+=newPlayer.coins;
    //dont spawn on wall
    var wall=wallLayer.getTileAtWorldXY(newSkeleton.x,newSkeleton.y);

    enemies.getChildren().forEach((enemy)=>{
        if (enemy.getBounds().contains(newSkeleton.x,newSkeleton.y))
        {
            spawn=false;
            
        }
    });
    //spawn enemy
    if (wall==null && spawn)
    {
     enemies.add(newSkeleton);   
    }
    //destory enemy try again
    else
    {
        //console.log('bad location');
        newSkeleton.destroy();
        spawnSkeleton(scene,wallLayer);
    }

}


function findTarget(enemy)
{
  if (self.newPlayer.playerId===enemy.targetId)
    {
      enemy.target=self.newPlayer;
      console.log(enemy.target);
    }
  
}

*/