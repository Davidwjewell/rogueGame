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
        this.lastUpdateTime=null;
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
    this.lastUpdateTime=null;  
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


class BanditEnemy extends Phaser.GameObjects.Container{
    constructor(scene,x,y,id)
    {
        super(scene,x,y);
        scene.add.existing(this);
        this.type='banditEnemy';
        this.id=id;
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
        this.lastUpdateTime=null;

        this.weaponSprite=scene.add.sprite(0,0,'banditSprites','bandit_gun.png');
        this.weaponSprite.setSize(10,15,true);
        this.bodySprite=scene.add.sprite(0,0,'banditSprites','bandit_idle_00.png');
        this.bodySprite.setSize(10,15,true);

        this.add(this.bodySprite);
        this.add(this.weaponSprite);
    }

    updateEnemy(time,scene)
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
              
                this.bodySprite.clearTint();
                this.weaponSprite.clearTint();
                this.hit=false;
                this.checkHit=true;
            }
        
        }

        if (this.idle)
        {
           
          this.bodySprite.anims.play('banditIdle',true);
            
        
        }
        
      
        if (this.moving)
        {
           
         this.weaponSprite.setRotation(this.angle);  
   
        this.bodySprite.anims.play('banditRun',true);
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
         var banditDeathAnimation = scene.add.sprite(this.x,this.y,'banditSprites','bandit_death_00.png');
         this.destroy();   
    
         
        if ((this.angle * (180/Math.PI)>90) || ((this.angle * (180/Math.PI) > -180) && (this.angle * (180/Math.PI) < -90)))
        {
        //flip sprite if facing left
         banditDeathAnimation.flipX=true;
         
        }
         banditDeathAnimation.anims.play('banditDeath',false);
      }
      
      
    }
  
}

