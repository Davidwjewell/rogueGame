
const players = {};
const enemiesArray = {};
const bulletArray = {};
const bulletArrayEnemy = {};
const bulletsDeleteArray = [];
const enemyDeleteArray = [];
const coinArray = {};
var bulletCounter = 0;
var enemyBulletCounter = 0;
var enemyIdCounter = 0;
var spawnTime = 0;
var twoPlayerTest = false;
var coinSpawnTime = 0;
var coinIdCounter = 0;
const spawnTestCoins = false;
const onePlayerSkeletonTest = false;
const spawnTestEnemiesNumber = 1;
const banditTest = false;

var portalTest = false;



var config = {
  type: Phaser.HEADLESS,
  parent: 'phaser-example',
  //width: 100,
 // height: 100,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
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
  this.load.multiatlas('skeletonSprites', 'assets/skeleton.json', 'assets');
  this.load.image('slimeEnemy', './assets/slime move_blob_0.png');
  this.load.image("tiles", "assets/16 x 16 codename iso game.png");
  this.load.tilemapTiledJSON("map", 'assets/16test.json');
  this.load.image('ship', 'assets/spaceShips_001.png');
  this.load.image('star', 'assets/star_gold.png');
  this.load.image('bullet', './assets/bullet_projectile_0.png');
  this.load.image('coin', './assets/coin_sprite.png');
  this.load.multiatlas('banditSprites', 'assets/bandit.json', 'assets');
  this.load.multiatlas('doorSprites', 'assets/door.json', 'assets');
  this.load.image('portalHidden', './assets/portal animation_Animation 2_00.png');
  this.load.image('scatterGun' ,'./assets/scatterGun.png');
  this.load.image('laserAutoRifle', './assets/laserAutoRifle.png');

}

function create() {
  const self = this;
  this.physics.world.setFPS(60);
  this.players = this.physics.add.group();
  this.bullets = this.physics.add.group();
  this.bullets.defaults = {};
  this.railProjectiles=this.add.group();
  this.enemies = this.physics.add.group();
  this.enemyBullets = this.physics.add.group();
  this.coins = this.physics.add.group();
  this.portals = this.physics.add.group();
  
  this.gameController = new GameController();
 

  const map = this.make.tilemap({
    key: "map"
  });
  const tileset = map.addTilesetImage("rogue-tiles", "tiles", 16, 16);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  this.wallLayer = map.createStaticLayer("Walls", tileset, 0, 0);




  this.wallLayer.setCollisionByProperty({
    collides: true
  });


  const doorLocation = map.getObjectLayer('door').objects;


  this.newDoor = new Door({
    scene: this,
    x: doorLocation[0].x + (doorLocation[0].width),
    y: doorLocation[0].y
  });


  //place portals on map
  const portalSpawnLocations = map.getObjectLayer('portalSpawners').objects;

  var portalId=1;
  
  portalSpawnLocations.forEach(portal => {
   
    const newPortal = new PortalSpawn({
      scene: this,
      x: portal.x + portal.width / 2,
      y: portal.y - portal.height / 2,
      id: portalId
    });
    this.portals.add(newPortal);
    portalId++;
  });


  this.physics.add.collider(this.players);
  this.physics.add.collider(this.players, this.wallLayer);
  this.physics.add.collider(this.enemies, this.wallLayer);
  this.physics.add.collider(this.enemies, this.enemies);
  this.physics.add.collider(this.bullets, this.wallLayer, bulletCollide, null, this);
  this.physics.add.collider(this.railProjectiles, this.wallLayer, railProjectileCollide, null, this);
  this.physics.add.collider(this.enemyBullets, this.wallLayer, bulletCollideEnemy, null, this);
  this.physics.add.overlap(this.bullets, this.enemies, enemyCollide, null, this);
  this.physics.add.overlap(this.railProjectiles, this.enemies, enemyCollideRailProjectile, null, this);
  this.physics.add.overlap(this.bullets, this.enemies, enemyCollide, null, this);
  this.physics.add.overlap(this.bullets, this.players, playerShot, null, this);
  this.physics.add.overlap(this.enemyBullets, this.players, playerShot, null, this);
  this.physics.add.collider(this.enemies, this.players, playerTouched, null, this);
  this.physics.add.overlap(this.coins, this.players, coinPickup, null, this);


  //animations needed for timing
  //

  var frameNamesSkeletonSpawn = this.anims.generateFrameNames('skeletonSprites', {
    start: 0,
    end: 16,
    zeroPad: 2,
    prefix: 'skeleton-spawn-',
    suffix: '.png'
  });

  this.anims.create({
    key: 'skeletonSpawn',
    frames: frameNamesSkeletonSpawn,
    frameRate: 10,
    repeat: 0
  });
  //player roll

  var frameNamesPlayerRoll = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 5,
    zeroPad: 0,
    prefix: 'roll_roll_',
    suffix: '.png'
  });

  this.anims.create({
    key: 'playerRoll',
    frames: frameNamesPlayerRoll,
    frameRate: 10,
    repeat: 0
  });
  //
  var frameNamesDoorOpen = this.anims.generateFrameNames('doorSprites', {
    start: 11,
    end: 23,
    zeroPad: 2,
    prefix: 'door anim_Animation 1_',
    suffix: '.png'
  });

  //door
  this.anims.create({
    key: 'doorOpen',
    frames: frameNamesDoorOpen,
    frameRate: 10,
    repeat: 0
  });






  io.on('connection', function(socket) {
    console.log('a user connected');
    //get user name 
    socket.emit('inputName');

    socket.on('playerNameInput', function(playerName) {
      console.log('player name recieved');



      console.log(playerName);

      // create a new player and add it to our players object
      players[socket.id] = {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        name: playerName,
        angle: 0,
        moving: false,
        roll: false,
        hit: false,
        hearts: 0,
        alive: true,
        respawn: false,
        coins: 0,
        input: {
          up: false,
          down: false,
          left: false,
          right: false,
          mouseRight: false,
          mouseLeft: false,
          angle: 0,
          pointerX: 0,
          pointerY: 0
        }

      };

      // add player to server
      addPlayer(self, players[socket.id]);
      // send the players object to the new player
      socket.emit('currentPlayers', players);
      // update all other players of the new player
      socket.broadcast.emit('newPlayer', players[socket.id]);
      
        });
      //create portals and locations
    
      self.portals.getChildren().forEach(function(portal){
          var portalData = {
          x: portal.x,
          y: portal.y,
          id: portal.id
        };
        socket.emit('createPortal', portalData);
      });
    
    socket.on('disconnect', function() {
      console.log('user disconnected');
      // remove player from server
      removePlayer(self, socket.id);
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerInput', function(inputData) {
      //console.log(inputData);
      handlePlayerInput(self, socket.id, inputData);
    });
  });

}


function update(time,delta,self) {

if (this.gameController.gameOver)
  {
  
   io.emit('gameOver', this.gameController.winningPlayer.name);

  }
  
  if (!this.gameController.gameOver)
    {
   this.gameController.update(this,time);
    }

  if (this.gameController.gameRun)
    {

  this.players.getChildren().forEach((player) => {
    
    
    const inputInfo = players[player.playerId].input;
    
   

    
    if (!player.alive) {
      player.body.setEnable(false);
      if (player.checkDeath) {

        player.checkDeath = false;
        player.timeOfDeath = time;


      }

      if (time - player.timeOfDeath > player.deathTimeOut) {
        player.body.setEnable(true);
        player.alive = true;
        player.checkDeath = true;
        var x = Math.floor(Math.random() * 700) + 50;
        var y = Math.floor(Math.random() * 500) + 50;

        player.hearts = 3;
        player.setPosition(x, y);
        player.respawn = true;
        //set player states to client
        player.setAsAlive=true;
        player.setReSpawn=true;
      }

    }


    //player alive

    if (player.alive)

    {
      if (player.invunerable) {
        if (player.checkInvunerable) {
          player.hitTime = time;

          player.checkInvunerable = false;
        }

        if (time - player.hitTime > player.invunerableTimer) {
          player.invunerable = false;
          player.checkInvunerable = true;

        }

      }

      if (!player.roll) {

        if (inputInfo.angle)
          {
            player.angle = inputInfo.angle;
          }
        
        player.moving = false;
        player.body.setVelocity(0);




        if (inputInfo.up) {

          if (inputInfo.up && inputInfo.mouseRight && (!inputInfo.left && !inputInfo.right)) {

            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(-player.rollspeed);

            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });



          } else if (inputInfo.up && inputInfo.left && inputInfo.mouseRight) {

            //roll left and up 

            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(-player.rollspeed);
            player.body.setVelocityX(-player.rollspeed);


            //play roll 
            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });

          } else if (inputInfo.up && inputInfo.right && (inputInfo.mouseRight)) {
            //roll right and up

            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(-player.rollspeed);
            player.body.setVelocityX(player.rollspeed);


            //play roll 
            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });

          } else {

            player.moving = true;
            player.body.setVelocityY(-player.speed);

          }

        }

        //Player not rolling


        if (inputInfo.down) {
          if (inputInfo.down && (inputInfo.mouseRight) && !(inputInfo.left && inputInfo.right)) {
            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(player.rollspeed);

            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });


          } else if (inputInfo.down && inputInfo.left && (inputInfo.mouseRight)) {
            //roll left and up    
            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(player.rollspeed);
            player.body.setVelocityX(-player.rollspeed);


            //play roll 
            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });

          } else if (inputInfo.down && inputInfo.right && (inputInfo.mouseRight)) {
            //roll right and up

            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityY(-player.rollspeed);
            player.body.setVelocityX(player.rollspeed);


            //play roll 
            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });

          } else {
            player.moving = true;
            player.body.setVelocityY(player.speed);

          }


        }



        if (inputInfo.left) {

          if (inputInfo.left && (inputInfo.mouseRight) && (!inputInfo.up && !inputInfo.down)) {
            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityX(-player.rollspeed);

            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });



          } else {
            player.moving = true;
            player.body.setVelocityX(-player.speed);
          }

        }
        if (inputInfo.right) {
          if (inputInfo.right && (inputInfo.mouseRight) && (!inputInfo.up && !inputInfo.down)) {
            player.roll = true;
            player.setRoll=true;
            player.body.setVelocityX(player.rollspeed);

            player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
              player.roll = false;
            });

          } else {
            player.moving = true;
            player.body.setVelocityX(player.speed);

          }

        }

        if (inputInfo.mouseLeft) {
         
        
          //if ((time - player.fireTime > player.fireDelay || player.fireTime == 0)) {
         //player.firingWeapon=true;
           if ((time - player.fireTime > player.weaponEquip.fireDelay || player.fireTime == 0)) 
             {
                   
                   player.weaponEquip.fireWeapon(this,player,time,inputInfo,io);
            }

            }
        else  //not firing weapon
            {
                 if (player.weaponEquip.resetGroup)
                   {
                     console.log('reset group');
                     player.weaponEquip.resetGroup=false;
                     player.weaponEquip.shotsFiredInGroup=0;                     
                   }
                // player.firingWeapon=false;
             
            }

        }

      }


/*
    players[player.playerId].x = player.x;
    players[player.playerId].y = player.y;
    players[player.playerId].moving = player.moving;
    players[player.playerId].angle = player.angle;
    players[player.playerId].hit = player.hit;
    players[player.playerId].hearts = player.hearts;
    players[player.playerId].alive = player.alive;
    players[player.playerId].respawn = player.respawn;
    players[player.playerId].coins = player.coins;
    players[player.playerId].roll = player.roll;
    */

    //players[player.playerId].rotation = player.rotation;
    player.hit = false;
    player.respawn = false;
    inputInfo.mouseLeft=false;
    inputInfo.mouseRight=false;
    
  });

   const playerDataAllPlayers=getPlayerDataToSend(this);

  //this.physics.world.wrap(this.players, 5);
   io.emit('playerUpdates', playerDataAllPlayers);
  ////
  ////


  if (this.bullets.getLength() > 0) {
    
    const bulletArrayDataToSend=[];
    this.bullets.getChildren().forEach(function(bullet) {


      var bulletData =

        {
          id: bullet.id,
          x: bullet.x,
          y: bullet.y,
          ...(bullet.hit && {hit : bullet.hit})        
        };

      bulletArrayDataToSend.push(bulletData);
      //io.emit('bulletUpdates', bulletData)

      if (bullet.hit) {

        //bulletsDeleteArray.push(bullet.id);
        bullet.destroy();

      }
    });

    io.emit('bulletUpdates', bulletArrayDataToSend);

  }
      
  if (this.railProjectiles.getLength() > 0) {
    
     const bulletArrayDataToSend=[];
     this.railProjectiles.getChildren().forEach(function(rail) {
     
           var railData={
             id:rail.id,
             x:rail.x,
             y:rail.y,
             ...(rail.hit && {hit : rail.hit}) 
           };
          
        bulletArrayDataToSend.push(railData);
            
          if (rail.hit)
            {
              rail.destroy();
            }
           
         
     });
    
     io.emit('bulletUpdates', bulletArrayDataToSend);
  }

/*
  if (bulletsDeleteArray) {

    for (var i = 0; i < bulletsDeleteArray.length; i++) {
      delete bulletArray[bulletsDeleteArray[i]];

    }

  }

*/












  //enemy bullets
  if (this.enemyBullets) {



    this.enemyBullets.getChildren().forEach(bullet => {



      bulletArrayEnemy[bullet.id].x = bullet.x;
      bulletArrayEnemy[bullet.id].y = bullet.y;
      bulletArrayEnemy[bullet.id].hit = bullet.hit;


      if (bullet.hit) {
        bulletsDeleteArray.push(bullet.id);
        bullet.destroy();
      }

    });




    //io.emit('bulletUpdatesEnemy', bulletArrayEnemy);


  }

  if (bulletsDeleteArray) {

    for (var j = 0; j < bulletsDeleteArray.length; j++) {
      delete bulletArray[bulletsDeleteArray[j]];

    }

  }


  //});  

  if (this.enemies) {



    this.enemies.getChildren().forEach((enemy) => {



      if (enemy.type === 'slime') {

        //if enemy target null or after time elapsed check target and find closest
        if ((!enemy.target) || (!enemy.target.alive) || (time - enemy.checkTargetTime > enemy.checkTargetAgainTimer)) {


          findTarget(this, enemy, time);

        }

        if (enemy.target) {

          this.physics.moveTo(enemy, enemy.target.x, enemy.target.y, enemy.speed);
          enemiesArray[enemy.id].x = enemy.x;
          enemiesArray[enemy.id].y = enemy.y;

        }


      }

      if (enemy.type === 'skeletonEnemy') {
        if (enemy) {
          if (enemy.spawning) {
            if (enemy.playSpawnAnimation) {
              enemy.playSpawnAnimation = false;
              enemy.bodySprite.anims.play('skeletonSpawn', false).once('animationcomplete', () => {
                enemy.spawning = false;
                enemy.activeState = true;
                //findTarget(this,enemy,time);  

              });
            }
          }


          if (enemy.idle) {
            if (time - enemy.idleStart < enemy.idleTime) {
              enemy.activeState = false;
            } else {
              enemy.idle = false;
              enemy.totalShots = 0;
              enemy.activeState = true;

            }
          }



          if (enemy.activeState) {

            if ((!enemy.target) || (!enemy.target.alive) || (time - enemy.checkTargetTime > enemy.checkTargetAgainTimer)) {
              findTarget(this, enemy, time);
            }


            if (enemy.target) {
              setGunAngle(enemy);


              if ((Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.target.x, enemy.target.y) < enemy.shotDistance)) //&& 
              // player in range
              {
                enemy.inRange = true; // player in range
                enemy.moving = false; // dont move
              } else {
                enemy.inRange = false; // player not in range
                enemy.moving = true;
              }


              if (enemy.inRange) {


                enemy.body.setVelocity(0, 0);

                //console.log('in range');
                //fire projectile
                if (time - enemy.fireTime > enemy.fireDelay || enemy.fireTime == 0) {
                  enemyBulletCounter++;
                  enemy.fireTime = time;
                  let newEnemyBullet = new EnemyBulletSkeleton(this, enemy.x, enemy.y, enemyBulletCounter);
                  newEnemyBullet.setSize(10, 10, true);
                  //newEnemyBullet.setRotation(angle);

                  this.enemyBullets.add(newEnemyBullet);

                  enemy.totalShots++;

                  bulletArrayEnemy[newEnemyBullet.id] = {
                    x: newEnemyBullet.x,
                    y: newEnemyBullet.y,
                    id: newEnemyBullet.id,
                    angle: enemy.angle,
                    hit: null,
                    hitX: null,
                    hitY: null,
                    type: 'skelBullet'
                  };

                  this.physics.moveTo(newEnemyBullet, enemy.target.x, enemy.target.y, enemy.projectilespeed);

                  io.emit('createBulletEnemy', bulletArrayEnemy[newEnemyBullet.id]);

                }


              }

              if (enemy.totalShots == enemy.shotGroup) {

                enemy.idle = true;
                enemy.idleStart = time;
              }


              if (enemy.moving) {
                this.physics.moveTo(enemy, enemy.target.x, enemy.target.y, enemy.speed);
                setGunAngle(enemy);
              }

            }


          }

          enemiesArray[enemy.id].x = enemy.x;
          enemiesArray[enemy.id].y = enemy.y;
          enemiesArray[enemy.id].angle = enemy.angle;
          enemiesArray[enemy.id].spawning = enemy.spawning;
          enemiesArray[enemy.id].moving = enemy.moving;
          enemiesArray[enemy.id].idle = enemy.idle;

        }

      }

      if (enemy.type === "banditEnemy") {
        if (enemy.idle) {
          if (time - enemy.idleStart < enemy.idleTime) {
            enemy.activeState = false;
          } else {
            enemy.idle = false;
            enemy.totalShots = 0;
            enemy.activeState = true;

          }
        }



        if (enemy.activeState) {

          if ((!enemy.target) || (!enemy.target.alive) || (time - enemy.checkTargetTime > enemy.checkTargetAgainTimer)) {
            findTarget(this, enemy, time);
          }

          if (enemy.target) {
            setGunAngle(enemy);

            if (time - enemy.distanceCheckTimer > enemy.checkTargetAgainTimer) {

              var distanceToPlayer = checkDistance(enemy, time);
              if (distanceToPlayer < enemy.shotDistance)
              // if ((Phaser.Math.Distance.Between(enemy.x, enemy.y, enemy.target.x, enemy.target.y) < enemy.shotDistance)) //&& 
              // player in range
              {

                enemy.inRange = true; // player in range
                enemy.moving = false; // dont move
              } else {
                enemy.inRange = false; // player not in range
                enemy.moving = true;
              }
            }

            if (enemy.inRange) {


              enemy.body.setVelocity(0, 0);

              //console.log('in range');
              //fire projectile
              if (time - enemy.fireTime > enemy.fireDelay || enemy.fireTime == 0) {
                enemyBulletCounter++;
                enemy.fireTime = time;
                let newEnemyBullet = new Bullet(this, enemy.x, enemy.y, enemyBulletCounter);
                newEnemyBullet.setSize(10, 10, true);
                //newEnemyBullet.setRotation(angle);

                this.enemyBullets.add(newEnemyBullet);

                enemy.totalShots++;

                bulletArrayEnemy[newEnemyBullet.id] = {
                  x: newEnemyBullet.x,
                  y: newEnemyBullet.y,
                  id: newEnemyBullet.id,
                  angle: enemy.angle,
                  hitX: null,
                  hitY: null,
                  type: 'banditBullet'
                };

                this.physics.moveTo(newEnemyBullet, enemy.target.x, enemy.target.y, enemy.projectilespeed);

                io.emit('createBulletEnemy', bulletArrayEnemy[newEnemyBullet.id]);

              }


            }

            if (enemy.totalShots == enemy.shotGroup) {

              enemy.idle = true;
              enemy.idleStart = time;
            }


            if (enemy.moving) {
              this.physics.moveTo(enemy, enemy.target.x, enemy.target.y, enemy.speed);
              setGunAngle(enemy);
            }

          }


        }

        enemiesArray[enemy.id].x = enemy.x;
        enemiesArray[enemy.id].y = enemy.y;
        enemiesArray[enemy.id].moving = enemy.moving;
        enemiesArray[enemy.id].angle = enemy.angle;
        enemiesArray[enemy.id].idle = enemy.idle;



      }

      if (enemy.hit) {
        io.emit('enemyHit', enemy.id);
      }

      if (enemy.death) {
        io.emit('enemyDeath', enemy.id);
        enemyDeleteArray.push(enemy.id);
        enemy.destroy();
      } else {
        //set value back
        enemy.hit = false;
      }




    });


    if (enemyDeleteArray) {
      for (var k = 0; k < enemyDeleteArray.length; k++) {
        delete enemiesArray[enemyDeleteArray[k]];

      }
    }

  }

  this.newDoor.updateDoor(time); //update door
  
  //
  this.portals.getChildren().forEach((portal) =>{
    portal.updatePortal(time, this);
  });
  
}

}


function updateLoop() {


  io.emit('enemyUpdates', enemiesArray);
  io.emit('bulletUpdatesEnemy', bulletArrayEnemy);
 // io.emit('playerUpdates', players);
  ////




}

setInterval(updateLoop, 100);



//distance check function to find closest playerCounter
//Math.hypot(x2-x1, y2-y1)
function findTarget(self, enemy, time) {
  var distance = 0;
  var prevDistance;
  var clostestPlayer;


  self.players.getChildren().forEach(player => {

    if (player.alive) {
      distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);

      if (!prevDistance || distance < prevDistance) {
        clostestPlayer = player;
      }

      prevDistance = distance;
    }
  });

  enemy.target = clostestPlayer;
  enemy.checkTargetTime = time;


}


function checkDistance(enemy, time) {

  var distance = Math.hypot(enemy.x - enemy.target.x, enemy.y - enemy.target.y);
  enemy.distanceCheckTimer = time;
  return distance;



}


function randomPosition(max) {
  return Math.floor(Math.random() * max) + 50;
}

function handlePlayerInput(self, playerId, input) {
 
  
  players[playerId].input=input;

}

function addPlayer(self, playerInfo) {
  let player = new Player(self, playerInfo.x, playerInfo.y, playerInfo.playerId, playerInfo.name);
  self.players.add(player);
}


function removePlayer(self, playerId) {
  self.players.getChildren().forEach((player) => {
    if (playerId === player.playerId) {
      player.destroy();
    }
  });
}


function getPlayerDataToSend(self)
{
 
  const playerArray=[];
  
  self.players.getChildren().forEach((player) =>{

    var dataToSend={
      id:player.playerId, // required
      x:player.x, //required
      y:player.y, //required
      angle: player.angle, // required
     // hearts: player.hearts, // required
      //coins: player.coins, //required
      // Conditional data
     // ... (player.moving && {moving : player.moving}),
     // ... (player.hit && {hit : player.hit}),
      ...(player.setUpdateCoins && {setUpdateCoins : player.coins}),
      ...(player.setAsAlive && {setAsAlive : player.alive}),
      ... (player.setReSpawn && {setReSpawn : player.setReSpawn}),
      
      ...(player.setAsHit && { setAsHit : player.setAsHit}),
      ...(player.setAsDead && {setAsDead : player.setAsDead}),
      ...(player.setRoll && {setRoll : player.setRoll}),
      ...(player.setUpdateHearts && {setUpdateHearts : player.hearts})
    //  ... (player.alive && {alive : player.alive}),
     //  ...(!player.alive && {alive : player.alive}),
     // ... (player.respawn && {respawn : player.respawn}),
     // ... (!player.respawn && {respawn : player.respawn}),
    //  ... (player.roll && {roll : player.roll})
                
    };
    

    
    player.setAsAlive=false;
    player.setReSpawn=false;
    player.setAsHit=false;
    player.setAsDead=false;
    player.setRoll=false;
    player.setUpdateHearts=false;
    player.setUpdateCoins=false;
     
    playerArray.push(dataToSend);
    
    
  });
  
  
  return playerArray;
  
  
}


const game = new Phaser.Game(config);
window.gameLoaded();