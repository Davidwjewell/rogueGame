const players = {};
const enemiesArray ={};
const bulletArray={};
const bulletArrayEnemy={};
const bulletsDeleteArray=[];
const enemyDeleteArray=[];
const coinArray={};
var bulletCounter=0;
var enemyBulletCounter=0;
var enemyIdCounter=0;
var spawnTime=0;
var twoPlayerTest=true;
var coinSpawnTime=0;
var coinIdCounter=0;


const config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  width: 800,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  autoFocus: false
};

function preload() {
  this.load.multiatlas('playerSprites', 'assets/player.json', 'assets');
  this.load.multiatlas('skeletonSprites','assets/skeleton.json','assets');
  this.load.image('slimeEnemy','./assets/slime move_blob_0.png');
  this.load.image("tiles", "assets/16 x 16 codename iso game.png");
  this.load.tilemapTiledJSON("map",'assets/16test.json');
  this.load.image('ship', 'assets/spaceShips_001.png');
  this.load.image('star', 'assets/star_gold.png');
  this.load.image('bullet','./assets/bullet_projectile_0.png');
  this.load.image('coin','./assets/coin_sprite.png');
  
  
  
}

function create() {
  const self = this;
  //this.physics.world.setFPS(60);
   this.players = this.physics.add.group();
  this.bullets=this.physics.add.group();
  this.enemies=this.physics.add.group();
  this.enemyBullets=this.physics.add.group();
  this.coins=this.physics.add.group();
  
   const map = this.make.tilemap({ key: "map" });
   const tileset = map.addTilesetImage("rogue-tiles","tiles",16,16);
   const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
   this.wallLayer=map.createStaticLayer("Walls", tileset,0,0);
  
  
  
    
   this.wallLayer.setCollisionByProperty({ collides: true });


  this.physics.add.collider(this.players);
  this.physics.add.collider(this.players,this.wallLayer);
  this.physics.add.collider(this.enemies, this.wallLayer);
   this.physics.add.collider(this.enemies, this.enemies);
  this.physics.add.collider(this.bullets, this.wallLayer, bulletCollide, null, this);
  this.physics.add.collider(this.enemyBullets, this.wallLayer, bulletCollideEnemy, null, this);
  this.physics.add.overlap(this.bullets, this.enemies, enemyCollide, null, this);
  this.physics.add.overlap(this.bullets, this.players, playerShot, null, this);
  this.physics.add.overlap(this.enemyBullets, this.players, playerShot, null, this);
  this.physics.add.collider(this.enemies, this.players , playerTouched, null, this);
  this.physics.add.overlap(this.coins,this.players, coinPickup, null, this);
  
  
  //animations needed for timing
  //
  
   var frameNamesSkeletonSpawn =  this.anims.generateFrameNames('skeletonSprites',{
        start: 0, end: 16, zeroPad: 2, prefix: 'skeleton-spawn-', suffix: '.png'
    });
  
  this.anims.create({key: 'skeletonSpawn', frames:frameNamesSkeletonSpawn, frameRate:10, repeat: 0});
  //player roll
  
    var frameNamesPlayerRoll = this.anims.generateFrameNames('playerSprites', {
                         start: 0, end: 5, zeroPad: 0,
                         prefix: 'roll_roll_', suffix: '.png'
                     });
  
   this.anims.create({ key: 'playerRoll', frames: frameNamesPlayerRoll, frameRate: 10, repeat: 0});
  
  
  
  

  io.on('connection', function (socket) {
    console.log('a user connected');
    // create a new player and add it to our players object
    players[socket.id] = {
      x: Math.floor(Math.random() * 700) + 50,
      y: Math.floor(Math.random() * 500) + 50,
      playerId: socket.id,
      angle:0,
      moving:false,
      roll:false,
      hit:false,
      hearts:0,
      alive:true,
      respawn:false,
      coins:0,
      input:{
      up:false,
      down:false,
      left:false,
      right:false,
      mouseRight:false,
      mouseLeft:false,
      angle:0,
      pointerX:0,
      pointerY:0  
      }

    };
    // add player to server
    addPlayer(self, players[socket.id]);
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
   

    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function (inputData) {
      handlePlayerInput(self, socket.id, inputData);
    });
    
    socket.on('rollAnimationFinished', function(playerRollFinished){
      self.players.getChildren().forEach((player)=>{
        if (player.playerId === playerRollFinished.playerId)
          {
            player.roll=false;
            console.log('roll false');
          }
      });
   
    });
  });
  
}

function update(time) {
  
  
  //spawn coin every 500 ms until max reached
  
  if (this.coins.getLength()<20)
    {

    
  if (coinSpawnTime === 0 || time - coinSpawnTime > 2000)
    {
      let newCoin=null;
      coinIdCounter++;
      newCoin=spawnCoin(this,this.wallLayer,coinIdCounter);
      //if coin created
      if (newCoin)
      
      {
        
      this.coins.add(newCoin);  
        
      coinArray[newCoin.id]={
                x:newCoin.x,
                y:newCoin.y,
                id:newCoin.id
      };
      
       io.emit('createCoin', coinArray[newCoin.id]);
        
        coinSpawnTime=time;   
        
      }

      
    }

      
    }
  
  

  if (twoPlayerTest)
    {
  
  if (this.enemies.getLength()<10 && this.players && this.players.getLength()>1)
    {
 
      if (spawnTime === 0 || (time-spawnTime > 2000 ))
     {
       
       var chance = Math.round(Math.random());
  
      /*
      enemyIdCounter++;
      var x = Math.floor(Math.random() * 700) + 50;
      var y =Math.floor(Math.random() * 500) + 50;
      var newEnemy = new SlimeEnemy(this,x,y,enemyIdCounter);
      newEnemy.setSize(10,10,true);
      this.enemies.add(newEnemy);
      findTarget(this,newEnemy,time);
       */
       
   
      enemyIdCounter++;
    
      x = Math.floor(Math.random() * 700) + 50;
      y =Math.floor(Math.random() * 500) + 50;
       
      var newEnemySkeleton = new SkeletonEnemy(this,x,y,enemyIdCounter);
      // findTarget(this,newEnemy,time);
        this.enemies.add(newEnemySkeleton);
       
       enemiesArray[newEnemySkeleton.id]={
               x:newEnemySkeleton.x,
               y:newEnemySkeleton.y,
               id:newEnemySkeleton.id,
               type:newEnemySkeleton.type
       }
       
        io.emit('createEnemy', enemiesArray[newEnemySkeleton.id]);
        
       
      enemyIdCounter++;
    
      x = Math.floor(Math.random() * 700) + 50;
      y =Math.floor(Math.random() * 500) + 50;
       
      var newEnemySlime = new SlimeEnemy(this,x,y,enemyIdCounter);
       newEnemySlime.setSize(10,10,true);
       this.enemies.add(newEnemySlime);
       
       
      enemiesArray[newEnemySlime.id]={
               x:newEnemySlime.x,
               y:newEnemySlime.y,
               id:newEnemySlime.id,
               type:newEnemySlime.type
      };
       
      io.emit('createEnemy', enemiesArray[newEnemySlime.id]);
       
       console.log(enemiesArray[newEnemySlime.id]);
       
       
       //if (chance === 1)
        // {
       //newEnemy = new SkeletonEnemy(this,x,y,enemyIdCounter);
       //findTarget(this,newEnemy,time);
     //  this.enemies.add(newEnemy);
     //   }
       
     
           //newEnemy = new SlimeEnemy(this,x,y,enemyIdCounter);
           //newEnemy.setSize(10,10,true);
           //findTarget(this,newEnemy,time);
          //this.enemies.add(newEnemy);
           
         
       /*
      
      var playerLength=this.players.getLength();
      
      var randomPlayer=Math.floor(Math.random() * playerLength);
      
      var playerCounter=0;
      
      var playerFound=false;

 
      //this will throw an error if player leaves will fix
      this.players.getChildren().forEach(player=>{
        if (playerCounter === randomPlayer  && !playerFound)
          {
            newEnemy.target=player;
            playerFound=true;
           
          }
        
        playerCounter++;
      
        
      });
      
 
      */
      
      
            
      
      
      spawnTime=time;
      
  
    }
      
    }
      
    }
  
  this.players.getChildren().forEach((player) => {
    const inputInfo = players[player.playerId].input;
    
    if (!player.alive)
      {
        player.body.setEnable(false);
        if (player.checkDeath)
          {
 
          player.checkDeath=false;  
          player.timeOfDeath=time;
      
            
          }
        
           if (time - player.timeOfDeath > player.deathTimeOut)
          {
            player.body.setEnable(true);
            player.alive=true;
            player.checkDeath=true;
            var x = Math.floor(Math.random() * 700) + 50;
            var y =Math.floor(Math.random() * 500) + 50;
            
            player.hearts=3;
            player.setPosition(x,y);
            player.respawn=true;    
          }
        
        
        
        
        
      }
    
    
     //f (!player.roll)
       //
    
    /*
          if (player.hearts==0)
            {
        
              player.death=true;
               player.setActive(false);
             
            }
    
    if (player.death)
      {
        if (player.checkDeath)
          {
             player.deathTime=time;
            player.checkDeath=false;
          }
        
        if (time - player.deathTime > player.deathTime)
          {
            console.log('back to life');
            player.death=false;
            player.checkDeath=true;
            var x = Math.floor(Math.random() * 700) + 50;
            var y =Math.floor(Math.random() * 500) + 50;
            
            player.hearts=3;
            
            player.setPosition(x,y);
            player.setActive(true);
            
            
          }
        
        
      }
    
    */
              
            
    //player alive

        if (player.alive)
    
      {
        if (player.invunerable)
          {
            if (player.checkInvunerable)
              {
                 player.hitTime=time;
              
                player.checkInvunerable=false;
              }
            
            if (time-player.hitTime>player.invunerableTimer)
              {
                player.invunerable=false;
                player.checkInvunerable=true; 
                
              }
           
          }
        
         if (!player.roll)
          {
            
             player.angle=inputInfo.angle;
             player.moving=false;
             player.body.setVelocity(0);
            
        
        
            
         if (inputInfo.up)
        {
   
          if (inputInfo.up && inputInfo.mouseRight && (!inputInfo.left && !inputInfo.right))
            {
            
               player.roll=true;
               player.body.setVelocityY(-player.rollspeed); 
              
                player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
                 }); 
              
              

            }
          
     
         else if (inputInfo.up && inputInfo.left && inputInfo.mouseRight)
            {
              console.log(player.roll);
                //roll left and up 
              console.log('up and left');
                player.roll=true;
                player.body.setVelocityY(-player.rollspeed);
                player.body.setVelocityX(-player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }
            
         else if (inputInfo.up && inputInfo.right && (inputInfo.mouseRight))
            {
                //roll right and up
              console.log('up and right');
                
                player.roll=true;
                player.body.setVelocityY(-player.rollspeed);
                player.body.setVelocityX(player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }   
          
          else 
            {
             
              player.moving=true;
              player.body.setVelocityY(-player.speed);

            }

        }
        
        //Player not rolling
        
       
            
         
       
    
        if (inputInfo.down)
          {
              if (inputInfo.down && (inputInfo.mouseRight) && !(inputInfo.left && inputInfo.right))
            {
               player.roll=true;
               player.body.setVelocityY(player.rollspeed); 
              
                player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
                 }); 


            }
          
          else if (inputInfo.down && inputInfo.left && (inputInfo.mouseRight))
            {
                //roll left and up    
                player.roll=true;
                player.body.setVelocityY(player.rollspeed);
                player.body.setVelocityX(-player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }
            
         else if (inputInfo.down && inputInfo.right && (inputInfo.mouseRight))
            {
                //roll right and up
                
                player.roll=true;
                player.body.setVelocityY(-player.rollspeed);
                player.body.setVelocityX(player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }   
          
          else
            {
              player.moving=true;
              player.body.setVelocityY(player.speed);

            }
            
            
          }
            
            
            
        if (inputInfo.left)
          {
            
              if (inputInfo.left && (inputInfo.mouseRight) && (!inputInfo.up && !inputInfo.down))
            {
               player.roll=true;
               player.body.setVelocityX(-player.rollspeed); 
              
                player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
                 }); 
              
              

            }
          
     /*
          else if (inputInfo.left && inputInfo.up && (inputInfo.mouseRight))
            {
                //roll left and up    
                player.roll=true;
                player.body.setVelocityY(-player.rollspeed);
                player.body.setVelocityX(-player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }
            
         else if (inputInfo.left && inputInfo.down && (inputInfo.mouseRight))
            {
                //roll right and up
                
                player.roll=true;
                player.body.setVelocityY(player.rollspeed);
                player.body.setVelocityX(-player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }   
          */
          else
            {
              player.moving=true;
              player.body.setVelocityX(-player.speed);
            }
            
          }
          if (inputInfo.right)
            {
               if (inputInfo.right && (inputInfo.mouseRight) && (!inputInfo.up && !inputInfo.down))
            {
               player.roll=true;
               player.body.setVelocityX(player.rollspeed); 
              
                player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
                 }); 

            }
          
     /*
          else if (inputInfo.right && inputInfo.up && (inputInfo.mouseRight))
            {
                //roll left and up    
                player.roll=true;
                player.body.setVelocityY(-player.rollspeed);
                player.body.setVelocityX(player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }
            
         else if (inputInfo.right && inputInfo.down && (inputInfo.mouseRight))
            {
                //roll right and up
                
                player.roll=true;
                player.body.setVelocityY(player.rollspeed);
                player.body.setVelocityX(player.rollspeed);
    
            
            //play roll 
            player.playerBody.anims.play('playerRoll',false).once('animationcomplete', ()=>{
                player.roll=false;
            }); 
    
          }   
          */
          else
            {
              player.moving=true;
              player.body.setVelocityX(player.speed);

            }
              
            }
    
          if (inputInfo.mouseLeft)
            {
              if ((time-player.fireTime>player.fireDelay || player.fireTime==0))
            {   
              player.fireTime=time;
             
              var bulletId=bulletCounter;
              bulletCounter++;

              var newBullet=new Bullet(this,player.x,player.y,bulletId);
              newBullet.playerFiredId=player.playerId;
              newBullet.setSize(10,10,true);
              this.bullets.add(newBullet);

               bulletArray[newBullet.id]={
               x:newBullet.x,
               y:newBullet.y,
               id:newBullet.id,
               angle:inputInfo.angle,
               hitX:0,
               hitY:0  
             }; 
             

              this.physics.moveTo(newBullet,inputInfo.pointerX,inputInfo.pointerY,newBullet.speed);
              
              
             io.emit('createBullet', bulletArray[newBullet.id]); 
            }
              
            }
            
          }
      
        
        //
      }
    
    players[player.playerId].x = player.x;
    players[player.playerId].y = player.y;
    players[player.playerId].moving=player.moving;
    players[player.playerId].angle=player.angle;
    players[player.playerId].updateTime = time;
    players[player.playerId].hit=player.hit;
    players[player.playerId].hearts=player.hearts;
    players[player.playerId].alive=player.alive;
    players[player.playerId].respawn=player.respawn;
    players[player.playerId].coins=player.coins;
    players[player.playerId].roll=player.roll;
    
    //players[player.playerId].rotation = player.rotation;
    
    player.hit=false;
    player.respawn=false;
  });
  
  //this.physics.world.wrap(this.players, 5);
  io.emit('playerUpdates', players);
  
  //update bullets
  if (this.bullets)
    {
      this.bullets.getChildren().forEach(bullet=>{
        
    if (bullet)
      {
        if (bulletArray[bullet.id])
          {
         bulletArray[bullet.id].x=bullet.x;
         bulletArray[bullet.id].y=bullet.y;
         bulletArray[bullet.id].hit=bullet.hit;
         bulletArray[bullet.id].updateTime=time;
        
         if (bullet.hit)
        {
          bulletsDeleteArray.push(bullet.id);
          bullet.destroy();
        }
      }
        
      }
        
      
        
      });
      
      
     
    }
  
  io.emit('bulletUpdates', bulletArray);
  
  if (bulletsDeleteArray)
    {
  
  for (var i=0; i< bulletsDeleteArray.length;i++)
       {
         delete bulletArray[bulletsDeleteArray[i]];
       
       }
      
    }
  
  
  //enemy bullets
if (this.enemyBullets)
  {
    
      this.enemyBullets.getChildren().forEach(bullet=>{
        

         bulletArrayEnemy[bullet.id].x=bullet.x;
         bulletArrayEnemy[bullet.id].y=bullet.y;
         bulletArrayEnemy[bullet.id].hit=bullet.hit;
         bulletArrayEnemy[bullet.id].updateTime=time;
        
         if (bullet.hit)
        {
          bulletsDeleteArray.push(bullet.id);
          bullet.destroy();
        }
        
      });
      
     
    
  
  io.emit('bulletUpdatesEnemy', bulletArrayEnemy);
    
    
  }
  
  if (bulletsDeleteArray)
    {
  
  for (var j=0; j< bulletsDeleteArray.length;j++)
       {
         delete bulletArray[bulletsDeleteArray[j]];
       
       }
    
  }
  
  
//});  
  
  if (this.enemies)
    {
      this.enemies.getChildren().forEach((enemy) => {
      
        if (enemy.type === 'slime')
          {
            
        //if enemy target null or after time elapsed check target and find closest
        if ((!enemy.target) ||(!enemy.target.alive) || (time-enemy.checkTargetTime > enemy.checkTargetAgainTimer))
         {
            
            
            findTarget(this,enemy,time);

         }
            
        if (enemy.target)
         {
            
        this.physics.moveTo(enemy,enemy.target.x,enemy.target.y,enemy.speed);
        enemiesArray[enemy.id].x=enemy.x;
        enemiesArray[enemy.id].y=enemy.y;
        enemiesArray[enemy.id].hit=enemy.hit;
        enemiesArray[enemy.id].death=enemy.death;
       // enemiesArray[enemy.id].moving=enemy.moving;    
        
          }
      
         
          }
        
        if (enemy.type === 'skeletonEnemy')
          {
            if (enemy)
              {
            if (enemy.spawning)
              {
                if (enemy.playSpawnAnimation)
                    {
                        enemy.playSpawnAnimation=false;   
                        enemy.bodySprite.anims.play('skeletonSpawn',false).once('animationcomplete', ()=>{
                        enemy.spawning=false;
                        enemy.activeState=true;  
                        //findTarget(this,enemy,time);  
                          
                        });
                    }
              }
            
            
              if (enemy.idle)
                {
                    if (time-enemy.idleStart<enemy.idleTime)
                    {
                        enemy.activeState=false;
                    }
                    else
                    {
                        enemy.idle=false;
                        enemy.totalShots=0;
                        enemy.activeState=true;
                      
                    }
                }
            
            
            
            if (enemy.activeState)
              {
                
                   if ((!enemy.target) || (!enemy.target.alive) || (time-enemy.checkTargetTime > enemy.checkTargetAgainTimer))
                    {
                      findTarget(this,enemy,time);
                     }
                
                
                if (enemy.target)
                {
                  setGunAngle(enemy);
                  
                 if ((Phaser.Math.Distance.Between(enemy.x,enemy.y,enemy.target.x,enemy.target.y)< enemy.shotDistance)) //&& 
                     // player in range
                {
                    enemy.inRange=true; // player in range
                    enemy.moving=false; // dont move
                }
                else
                {
                    enemy.inRange=false; // player not in range
                    enemy.moving=true;
                }
                
                
                if (enemy.inRange)
                  {
                    
                  
                    enemy.body.setVelocity(0,0);
                    
                    //console.log('in range');
                    //fire projectile
                    if (time-enemy.fireTime>enemy.fireDelay || enemy.fireTime==0)
                    {
                    enemyBulletCounter++;  
                    enemy.fireTime=time;
                    let newEnemyBullet= new EnemyBulletSkeleton(this,enemy.x,enemy.y,enemyBulletCounter);
                    newEnemyBullet.setSize(10,10,true);     
                    //newEnemyBullet.setRotation(angle);
                   
                    this.enemyBullets.add(newEnemyBullet);
                      
                    enemy.totalShots++;
                      
                    bulletArrayEnemy[newEnemyBullet.id]={
                    x:newEnemyBullet.x,
                    y:newEnemyBullet.y,
                    id:newEnemyBullet.id,
                    angle:enemy.angle    
                    }; 

                   this.physics.moveTo(newEnemyBullet,enemy.target.x,enemy.target.y,enemy.projectilespeed);
       
              
              
                  io.emit('createBulletEnemy', bulletArrayEnemy[newEnemyBullet.id]);   
                      
                    
                      
                    }
                    
                    
                  }
                
                  if (enemy.totalShots==enemy.shotGroup)
                {
                    
                    enemy.idle=true;
                    enemy.idleStart=time;
                }
                
                
                if (enemy.moving)
                  {
                    this.physics.moveTo(enemy,enemy.target.x,enemy.target.y,enemy.speed);
                    setGunAngle(enemy);
                  }
                
                }
                
               
              }
            
            enemiesArray[enemy.id].x=enemy.x;
            enemiesArray[enemy.id].y=enemy.y;
            enemiesArray[enemy.id].hit=enemy.hit;
            enemiesArray[enemy.id].death=enemy.death;
            enemiesArray[enemy.id].spawning=enemy.spawning;
            enemiesArray[enemy.id].moving=enemy.moving;
            enemiesArray[enemy.id].angle=enemy.angle;
            enemiesArray[enemy.id].idle=enemy.idle;
            
            

          }
        
          
          
          
          }
        
        
        
        
        io.emit('enemyUpdates', enemiesArray);  
        
        
      
        if (enemiesArray[enemy.id].death)
          {
          enemyDeleteArray.push(enemy.id);
          enemy.destroy();
          }
       else
         {
           //set value back
        enemy.hit=false;
         }
        
        
        
        
      });
      
     //   io.emit('enemyUpdates', enemiesArray);
      
      if (enemyDeleteArray)
        {
          for (var k=0;k<enemyDeleteArray.length;k++)
            {
              delete enemiesArray[enemyDeleteArray[k]];
              
            }
        }
      
    }

}


//distance check function to find closest playerCounter
//Math.hypot(x2-x1, y2-y1)
function findTarget(self,enemy,time)
{
  var distance=0;
  var prevDistance;
  var clostestPlayer;
  
  
  self.players.getChildren().forEach(player =>{
    
    if (player.alive)
      {
    distance = Math.hypot(enemy.x-player.x, enemy.y-player.y);
    
    if (!prevDistance || distance < prevDistance)
      {
        clostestPlayer=player;
      }
    
    prevDistance=distance;
      }
  });
  
  enemy.target=clostestPlayer;
  enemy.checkTargetTime=time;
  
  
}


function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

function handlePlayerInput(self, playerId, input) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      players[player.playerId].input = input;
      players[player.playerId].roll=input.roll;
    }
  });
}

function addPlayer(self, playerInfo)
{
  let player = new Player(self,playerInfo.x,playerInfo.y,playerInfo.playerId);
  self.players.add(player);
}


function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}

const game = new Phaser.Game(config);
window.gameLoaded();
