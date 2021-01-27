
//SHOTGUN WEAPON
class ScatterGun extends Phaser.GameObjects.Sprite{
    constructor(config)
    {
    super(config.scene, config.x, config.y,'scatterGun'); 
    this.setSize(10,15,true);
    config.scene.physics.add.existing(this);   
    this.projectiles=3;   //projectiles per attack sequence
    this.fireDelay=500;   //delay between firing
    this.projectileVelocity=100;  //spped of projectiles shot
    this.weaponSpread=5;  // Spread of 3 shots - shot 2 is middle of target  
    }
  
  fireWeapon(scene,player,time,inputInfo)
  {
   const bulletsToAdd=[];
             const angles=[];
             player.fireTime = time;
             let offSet=this.weaponSpread;
             let offSetRadians = Phaser.Math.DegToRad(offSet);
             
             
             //get 3 angles for offset of shots
             angles.push(inputInfo.angle-offSetRadians);
             angles.push(inputInfo.angle);
             angles.push(inputInfo.angle+offSetRadians)
    

             for (var i=0; i< player.weaponEquip.projectiles; i++)
               
               {
            var bulletId = bulletCounter;
            bulletCounter++;

            var newBullet = new Bullet(scene, player.x, player.y, bulletId);
            newBullet.playerFiredId = player.playerId;
       
            newBullet.angle=angles[i];     
            newBullet.setSize(10, 10, true);
            scene.physics.velocityFromRotation(newBullet.angle, newBullet.speed, newBullet.body.velocity);
            scene.bullets.add(newBullet);
             
             let bulletDataToSend={
                 x: newBullet.x,
                 y: newBullet.y,
                 id: newBullet.id,
                 angle: newBullet.angle
             };
             
            bulletsToAdd.push(bulletDataToSend);
               
               }
    
            return bulletsToAdd;

  }
  
}


//LASER RIFLE STARTING WEAPON
class laserGun extends Phaser.GameObjects.Sprite{
   constructor(config)
  {
    super(config.scene, config.x, config.y, 'playerSprites','main gun_Gun_0.png'); 
    this.setSize(10,15,true);
    config.scene.physics.add.existing(this);
    this.fireDelay=300; //fire rate
    this.projectileVelocity=500; // bullet speed

  }
  
  
  fireWeapon(scene,player)
  {
    
    
  }
  
  
  
}


//LASER RIFLE AUTOMATIC
class LaserAutomaticRifle extends Phaser.GameObjects.Sprite{
  constructor(config)
  {
    super(config.scene, config.x, config.y, 'laserAutoRifle');
    this.setSize(10,15,true);
    config.scene.physics.add.existing(this);
    this.fireDelay=250; //fire rate
    this.projectileVelocity=500; //bullet speed
    this.shotsFiredInGroup=0;
    this.offSetPerShot=2;
    this.resetGroup=true;

    
   
  }
  
  fireWeapon(scene,player,time,inputInfo,io)
  {
    const bulletsToAdd=[];
      var bulletId = bulletCounter;
            bulletCounter++;
           
    
            let randomOffSet=Math.random();
            let offSetRadians = Phaser.Math.DegToRad(randomOffSet);
            
            var newBullet = new Bullet(scene, player.x, player.y, bulletId);
            newBullet.playerFiredId = player.playerId;
    
            newBullet.angle=(inputInfo.angle+(this.shotsFiredInGroup*this.offSetPerShot*offSetRadians));
       
            newBullet.setSize(10, 10, true);
            scene.physics.velocityFromRotation(newBullet.angle, newBullet.speed, newBullet.body.velocity);
            scene.bullets.add(newBullet);
             
             let bulletDataToSend={
                 x: newBullet.x,
                 y: newBullet.y,
                 id: newBullet.id,
                 angle: newBullet.angle
             };
    
              this.shotsFiredInGroup++;
              bulletsToAdd.push(bulletDataToSend);
              io.emit('createBullet', bulletsToAdd);   
    
             player.fireTime = time;
             this.resetGroup=true; 
    
    
    
    
    /*
    
         if (this.getBulletAngles)
           {
          for (var i=0; i<this.shotsPerBurst;i++)
        {
         let offSet=this.weaponSpread;
         let offSetRadians = Phaser.Math.DegToRad(offSet);
         this.angles.push(inputInfo.angle+(offSetRadians*i));
        }
             this.getBulletAngles=false;
             
           }
    

       for (var j=0; j < this.shotsPerBurst; j++)
               {
           if (this.shotTime === 0 || time - this.shotTime > this.delayBetweenShots)
             {
               this.shotTime=time;
            var bulletId = bulletCounter;
            bulletCounter++;

            var newBullet = new Bullet(scene, player.x, player.y, bulletId);
            newBullet.playerFiredId = player.playerId;
       
            newBullet.angle=this.angles[j];     
            newBullet.setSize(10, 10, true);
            scene.physics.velocityFromRotation(newBullet.angle, newBullet.speed, newBullet.body.velocity);
            scene.bullets.add(newBullet);
             
             let bulletDataToSend={
                 x: newBullet.x,
                 y: newBullet.y,
                 id: newBullet.id,
                 angle: newBullet.angle
             };
             
              this.bulletsToAdd.push(bulletDataToSend);
              io.emit('createBullet', this.bulletsToAdd);   
                 //return bulletsToAdd;
             }
               }
    
            
            this.bulletsToAdd=[];
            this.angles=[];  
            this.getBulletAngles=true;
            player.fireTime = time;
            player.firingWeapon=false;  
             
           
            //
  */  
  }
  
}