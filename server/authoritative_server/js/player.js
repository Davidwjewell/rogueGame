class Player extends Phaser.GameObjects.Container{
    constructor(scene,x,y,id,name)
    {
     
    super(scene,x,y);  
    scene.add.existing(this);
    this.playerId=id;  
    this.moving=false;
    this.alive=true;  
    this.hit=false;  
    this.coins=0;
    this.name=name;
    this.setAsAlive=false;
    this.setReSpawn=false; 
    this.setAsHit=false;
    this.setAsDead=false;
    this.setRoll=false;
    this.setUpdateHearts=false;  
    this.setUpdateCoins=false; 
    this.firingWeapon=false;
    this.fireTime=0;  
    this.roll=false;
    this.angle=0;
    this.invunerable=false;
    this.invunerableTimer=500;
    this.checkInvunerable=true;  
    this.timeOfDeath;
    this.deathTimeOut=2000;  
    this.checkDeath=true;  
    this.hitTime=0;  
    this.hearts=3;
    this.totalHearts=3;
    this.speed=75;
    this.rollspeed=100;  
    this.setSize(10,15);
    this.updateTime=0;  
    this.inputInfo;  
    scene.physics.world.enable(this);

    //this.gunSprite=scene.physics.add.sprite(0,0,'playerSprites','main gun_Gun_0.png'); 
    //this.weaponEquip=new ScatterGun({scene:scene,x:0,y:0});  
    this.weaponEquip=new LaserAutomaticRifle({scene:scene,x:0,y:0});
  
    this.playerBody=scene.physics.add.sprite(0,0,'playerSprites','run_run_0.png');
    this.playerBody.setSize(10,15,true);

   
    this.add(this.playerBody);
    this.add(this.weaponEquip);

    }
  
}
//player touched by enemy

function playerTouched(enemy, player)
{
  if (!player.invunerable)
    {
          player.invunerable=true;
          player.hearts--;
          player.setUpdateHearts=true;
    }
  
  if (player.hearts==0)
    {
      player.alive=false;
      player.setAsDead=true;
    }
  else
    {
      player.hit=true;
      player.setAsHit=true;
    }
  
  
}


  //player hit by bullet
  
  function playerShot(bullet, player)
  {
    //disable overlap for own bullet
    
    if (bullet.playerFiredId===player.playerId)
      {
        return;
      }
    
    else
      {
    //stop bullet and disable
     if (!bullet.hit)
      {
     
      bullet.hit=true;
      bullet.setVelocityX(0);
      bullet.setVelocityY(0);
        
      bullet.disableBody(true,true);   
      }
      
        
         if (!player.invunerable)
    {
          player.invunerable=true;
          player.hearts--;  
          player.setUpdateHearts=true;
    }
        
        
       
      if (player.hearts===0)
        {
          player.alive=false;
          player.setAsDead=true;
        }
        else
         {
          player.hit=true;
          player.setAsHit=true; 
         }
      
      }
    
  }
  
  


/*

    onHit(scene,player)
    {

    if (!this.invunerable)
    {
    
    scene.cameras.main.shake(200, 0.02); // shake screen    
    this.hearts--;
    updateHearts(scene,this);
       if (this.hearts==0)
      {
        //player had died
        this.alive=false;
        //disable sprites

        this.playerBody.disableBody(true,true);
       this.gunSprite.disableBody(true,true);
       
       scene.socket.emit('playerDied',{playerId:this.playerId,x:this.x,y:this.y})
        this.destroy();
        var playerDeathAnimation=scene.add.sprite(this.x,this.y,'playerSprites','style 1_player death_00.png');
        
        
        
        
         
        //play death animation
        playerDeathAnimation.anims.play('playerDeath',false).once('animationcomplete', ()=>{
        playerDeathAnimation.destroy(); 
        
    });
        
        
      }
      else
        {
          //communicate hit
           scene.socket.emit('playerHit',{playerId:this.playerId,x:this.x,y:this.y})
          
        }

    }
      
    }
  
  getInputs(time,scene,cursors,mouse)
  {
    //if not rolling 
    //player can fire

    if (!this.roll)
        {
                this.moving=false;
           this.body.setVelocity(0);      
            //if firing
            if (mouse.leftButtonDown() && (time-this.fireTime>this.fireDelay || this.fireTime==0))
            {   
           
            this.fireTime=time;
        
             //send bullet event 
              /*
             var newBullet = new Bullet(scene,this.x,this.y);
            newBullet.setSize(10,10,true);     
            newBullet.setRotation(this.angle);        
            scene.physics.moveTo(newBullet,scene.input.activePointer.x,scene.input.activePointer.y,600); 
            bullets.add(newBullet);  
            scene.socket.emit('playerFire',{playerId:this.playerId,x:this.x,y:this.y,angle:this.angle,destX:scene.input.activePointer.x,destY:scene.input.activePointer.y}) 
           */

/*
           scene.socket.emit('playerFire',{playerId:this.playerId,x:this.x,y:this.y,angle:this.angle,destX:scene.input.activePointer.x,destY:scene.input.activePointer.y});
              //return;
            }
        }
        
  // if (time-this.fireTime>this.fireDelay)
    // {
       var inputInfo ={
         playerId:this.playerId,
         x:this.x,
         y:this.y,
     up:cursors.up.isDown,
     down:cursors.down.isDown,
     left:cursors.left.isDown,
     right:cursors.right.isDown,
     mouseRight:mouse.rightButtonDown(),
     angle:this.angle    
       }
   
  
   scene.socket.emit('playerInput',{inputInfo: inputInfo});
   //  }
    
  }
    
  
    updatePlayerInputs(inputInfo)
    {

 
      if (!this.roll)
        {
       this.moving=false;
       this.body.setVelocity(0);
         
        if (inputInfo.up)
        {
            
            if (inputInfo.up && inputInfo.left && (inputInfo.mouseRight))
            {
                //roll left and up
                
                this.roll=true;
                this.body.setVelocityY(-this.speed);
                this.body.setVelocityX(-this.speed);
    
        
            
            //play roll 
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); 
            return;
            
            }
    
            
            if (inputInfo.up && inputInfo.right && (inputInfo.mouseRight))
            {
                //roll left and up
                
                this.roll=true;
                this.body.setVelocityY(-this.speed);
                this.body.setVelocityX(this.speed);
    
            
            //play roll 
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); 
            return;
            
            }
    
            if (inputInfo.up && (inputInfo.mouseRight))
            {
                //roll right
                
                this.roll=true;
                this.body.setVelocityY(-this.rollspeed);
            
            //play roll 
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); 
            return;
            
            }
    
    
            else // walk
            {
                this.moving=true;
                this.body.setVelocityY(-this.speed);
             // scene.socket.emit('playerUpdate' ,{moving: this.moving,velocityX: this.velocityX, velocityY: this.velocityY});
             
             // scene.socket.emit('playerMove',{x: this.x, y: this.y, angle : this.angle, move:this.moving});
            //this.playerBody.anims.play('playerRun', true); // play walk animation
            }
           
        }
        
       
        //holding down
       // else
        if (inputInfo.down)
        {
        
            if(inputInfo.down && inputInfo.left && (inputInfo.mouseRight))
            {
                //roll down
                
                this.roll=true;
                this.body.setVelocityY(+this.speed);
                this.body.setVelocityX(-this.speed);
           
    
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); //play roll
            return;
            
            }
    
            if(inputInfo.down && inputInfo.right && (inputInfo.mouseRight))
            {
                //roll down
                
                this.roll=true;
                this.body.setVelocityY(+this.speed);
                this.body.setVelocityX(+this.speed);
           
    
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); //play roll
            return;
            
            }
    
            if(inputInfo.down && (inputInfo.mouseRight))
            {
                //roll down
                
                this.roll=true;
                this.body.setVelocityY(+this.rollspeed);
           
    
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); //play roll
            return;
            
            }
            else // walk
            {
            this.moving=true;
           this.body.setVelocityY(+this.speed);
           // this.playerBody.anims.play('playerRun', true); // play walk animation
            }
        }
    
        if (inputInfo.right)
        {
            if (inputInfo.right && (inputInfo.mouseRight))
            {
                //roll right
                
                this.roll=true;
            
           this.body.setVelocityX(+this.rollspeed);
    
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); //play roll
            return;
    
            }
    
            else // walk
            {
                this.moving=true;
           this.body.setVelocityX(+this.speed);
            //this.playerBody.anims.play('playerRun',true); //play walk
            }
            
        }
    
        //holding left
       // else //
       if (inputInfo.left)
        {
    
            if (inputInfo.left && (inputInfo.mouseRight))
            {
                //roll left           
                this.roll=true;
                this.body.setVelocityX(-this.rollspeed);
          
              
            this.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                this.roll=false;
            }); //play roll
            return;
            
            }
            else // walk
            {
                this.moving=true;
           this.body.setVelocityX(-this.speed);
               
            //this.playerBody.anims.play('playerRun', true); // play walk animation
            }
        }
        
    
        if (this.moving)
        {
            this.playerBody.anims.play('playerRun', true); // play walk animation   
        }
        else
        {
            this.playerBody.anims.play('playerIdle',true);
        }
        
    
        }
      
    
    }
 

}
  


/*
function playerTouched(enemy, player)
{
   
    if (!player.invunerable)
    {
    this.cameras.main.shake(200, 0.02); //shake screen    
    player.hearts--;
    //console.log(player.hearts);
    updateHearts(this,player);
    //console.log('touched');
   // console.log(player);
    player.invunerable=true;
    player.setAlpha(0);
   // player.playerBody.tint=0xff0000;
   if (player.invunerable)
   {
       //run for 5 seconds
    this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 200,
    ease: 'Linear',
    repeat: 5,
    onComplete: function () { player.invunerable=false;
    }, //can take damage again     
});

    
   }
    }
}
*/