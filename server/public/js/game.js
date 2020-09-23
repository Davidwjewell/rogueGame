var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 800,
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  scale: {
    //mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
};

var game = new Phaser.Game(config);

const UPDATES_PER_SECOND = 60;


function preload() {
  this.load.multiatlas('playerSprites', 'assets/player.json', 'assets');
  this.load.multiatlas('skeletonSprites', 'assets/skeleton.json', 'assets');
  this.load.image('slimeEnemy', './assets/slime move_blob_0.png');
  this.load.image("tiles", "assets/16 x 16 codename iso game.png");
  this.load.tilemapTiledJSON("map", 'assets/16test.json');
  this.load.multiatlas('banditSprites', 'assets/bandit.json', 'assets');
  this.load.image('bullet', './assets/bullet_projectile_0.png');
  this.load.image('coin', './assets/coin_sprite.png');
  this.load.multiatlas('doorSprites', 'assets/door.json', 'assets');
  this.load.image('portalHidden', './assets/portal animation_Animation 2_00.png');
}

function create() {

  var self = this;
  //center game

  this.socket = io();
  this.players = this.add.group();
  this.bullets = this.add.group();
  this.enemies = this.add.group();
  this.hearts = this.add.group();
  this.bulletsEnemy = this.add.group();
  this.coins = this.add.group();
  this.portals=this.add.group();




  const map = this.make.tilemap({
    key: "map"
  });
  const tileset = map.addTilesetImage("rogue-tiles", "tiles", 16, 16);
  const worldLayer = map.createStaticLayer("World", tileset, 0, 0);
  const wallLayer = map.createStaticLayer("Walls", tileset, 0, 0);


  cursors = this.input.keyboard.createCursorKeys();
  mouse = this.input.mousePointer;
  this.input.mouse.disableContextMenu();

  this.input.setDefaultCursor('url(assets/crosshair.png),pointer');
  this.mouse = this.input.mousePointer;

  //doors

  const doorLocation = map.getObjectLayer('door').objects;


  newDoor = new Door({
    scene: this,
    x: doorLocation[0].x + (doorLocation[0].width),
    y: doorLocation[0].y
  });


  var frameNamesRun = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 7,
    zeroPad: 0,
    prefix: 'run_run_',
    suffix: '.png'
  });

  var frameNamesIdle = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 4,
    zeroPad: 0,
    prefix: 'Idle_idle_',
    suffix: '.png'
  });

  var frameNamesPlayerRoll = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 5,
    zeroPad: 0,
    prefix: 'roll_roll_',
    suffix: '.png'
  });

  var frameNamesPlayerDeath = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 11,
    zeroPad: 2,
    prefix: 'style 1_player death_',
    suffix: '.png'
  });

  var frameNamesBullHit = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 2,
    zeroPad: 0,
    prefix: 'on hit_on hit_',
    suffix: '.png'
  });

  var frameNamesBlobMove = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 12,
    zeroPad: 0,
    prefix: 'slime move_blob_',
    suffix: '.png'
  });
  var frameNamesBlobDeath = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 12,
    zeroPad: 0,
    prefix: 'death_blob death_0',
    suffix: '.png'
  });

  var frameNamesSkeletonIdle = this.anims.generateFrameNames('skeletonSprites', {
    start: 0,
    end: 4,
    zeroPad: 2,
    prefix: 'skeleton-idle-',
    suffix: '.png'
  });

  var frameNamesSkeletonWalk = this.anims.generateFrameNames('skeletonSprites', {
    start: 0,
    end: 7,
    zeroPad: 2,
    prefix: 'skeleton-walk-',
    suffix: '.png'
  });

  var frameNamesSkeletonSpawn = this.anims.generateFrameNames('skeletonSprites', {
    start: 0,
    end: 16,
    zeroPad: 2,
    prefix: 'skeleton-spawn-',
    suffix: '.png'
  });

  var frameNamesSkeletonMuzzleFlash = this.anims.generateFrameNames('skeletonSprites', {
    start: 0,
    end: 1,
    zeroPad: 0,
    prefix: "skeleton-weapon-muzzle-",
    suffix: ".png"
  });

  var frameNamesSkeletonDeath = this.anims.generateFrameNames('skeletonSprites', {
    start: 13,
    end: 4,
    zeroPad: 2,
    prefix: 'skeleton-spawn-',
    suffix: '.png'
  });

  var frameNamesCoinSpin = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 5,
    zeroPad: 0,
    prefix: 'Pick Up_spin_',
    suffix: '.png'
  });

  var frameNamesCoinPickup = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 5,
    zeroPad: 0,
    prefix: 'Pick Up_pickup_',
    suffix: '.png'
  });

  var frameNamesDoorOpen = this.anims.generateFrameNames('doorSprites', {
    start: 11,
    end: 23,
    zeroPad: 2,
    prefix: 'door anim_Animation 1_',
    suffix: '.png'
  });

  var frameNamesDoorClose = this.anims.generateFrameNames('doorSprites', {
    start: 23,
    end: 11,
    zeroPad: 2,
    prefix: 'door anim_Animation 1_',
    suffix: '.png'
  });

  var frameNamesBanditDeath = this.anims.generateFrameNames('banditSprites', {
    start: 0,
    end: 11,
    zeroPad: 2,
    prefix: 'bandit_death_',
    suffix: '.png'
  });
  var frameNamesBanditIdle = this.anims.generateFrameNames('banditSprites', {
    start: 0,
    end: 4,
    zeroPad: 2,
    prefix: 'bandit_idle_',
    suffix: '.png'
  });
  var frameNamesBanditHit = this.anims.generateFrameNames('banditSprites', {
    start: 0,
    end: 1,
    zeroPad: 2,
    prefix: 'bandit_hit_',
    suffix: '.png'
  });
  var frameNamesBanditRun = this.anims.generateFrameNames('banditSprites', {
    start: 0,
    end: 7,
    zeroPad: 2,
    prefix: 'bandit_run_',
    suffix: '.png'
  });

  var frameNamesPortalSpawn = this.anims.generateFrameNames('playerSprites', {
    start: 0,
    end: 22,
    zeroPad: 2,
    prefix: 'portal animation_Animation 2_',
    suffix: '.png'
  });
  var frameNamesPortalSpawnReverse = this.anims.generateFrameNames('playerSprites', {
    start: 22,
    end: 0,
    zeroPad: 2,
    prefix: 'portal animation_Animation 2_',
    suffix: '.png'
  });
  var frameNamesPortalSpawnEnemy = this.anims.generateFrameNames('playerSprites', {
    start: 23,
    end: 31,
    zeroPad: 2,
    prefix: 'portal animation_Animation 2_',
    suffix: '.png'
  });




  //portal
  this.anims.create({
    key: 'portalSpawn',
    frames: frameNamesPortalSpawn,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'portalSpawnReverse',
    frames: frameNamesPortalSpawnReverse,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'portalSpawnEnemy',
    frames: frameNamesPortalSpawnEnemy,
    frameRate: 10,
    repeat: 0
  });


  //player
  this.anims.create({
    key: 'playerRun',
    frames: frameNamesRun,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'playerIdle',
    frames: frameNamesIdle,
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'playerRoll',
    frames: frameNamesPlayerRoll,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'playerDeath',
    frames: frameNamesPlayerDeath,
    frameRate: 10,
    repeat: 0
  });
  //bullet hit
  this.anims.create({
    key: 'bulletHit',
    frames: frameNamesBullHit,
    frameRate: 10,
    repeat: 0
  });
  //slime
  this.anims.create({
    key: 'blobDeath',
    frames: frameNamesBlobDeath,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'blobMove',
    frames: frameNamesBlobMove,
    frameRate: 10,
    repeat: -1
  });

  //skeleton
  this.anims.create({
    key: 'skeletonIdle',
    frames: frameNamesSkeletonIdle,
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'skeletonWalk',
    frames: frameNamesSkeletonWalk,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'skeletonSpawn',
    frames: frameNamesSkeletonSpawn,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'skeletonMuzzleFlash',
    frames: frameNamesSkeletonMuzzleFlash,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'skeletonDeath',
    frames: frameNamesSkeletonDeath,
    frameRate: 10,
    repeat: 0
  });

  //coin
  this.anims.create({
    key: 'coinSpin',
    frames: frameNamesCoinSpin,
    frameRate: 10,
    repeat: 1
  });
  this.anims.create({
    key: 'coinPickup',
    frames: frameNamesCoinPickup,
    frameRate: 10,
    repeat: 0
  });

  //bandit
  this.anims.create({
    key: 'banditRun',
    frames: frameNamesBanditRun,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'banditDeath',
    frames: frameNamesBanditDeath,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'banditIdle',
    frames: frameNamesBanditIdle,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'banditHit',
    frames: frameNamesBanditHit,
    frameRate: 10,
    repeat: 0
  });


  //door
  this.anims.create({
    key: 'doorOpen',
    frames: frameNamesDoorOpen,
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'doorClose',
    frames: frameNamesDoorClose,
    frameRate: 10,
    repeat: 0
  });



  this.scoreText = this.add.text(30, 60, '0', {
    fontSize: '16px',
    fontFamily: 'Oxanium, cursive',
    fill: 'gold'
  });
  //spawn hearts



  //this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' });
  //this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' });


  this.socket.on('inputName', function() {

    var playerName = nameInput();


    if (playerName) {


      self.socket.emit('playerNameInput', playerName);

    }


  });

  this.socket.on('currentPlayers', function(players) {
    Object.keys(players).forEach(function(id) {
      if (players[id].playerId === self.socket.id) {
        self.newPlayerLocal = new Player(self, players[id].x, players[id].y, players[id].playerId, players[id].name);
        self.players.add(self.newPlayerLocal);
        addHearts(self, self.newPlayerLocal, 35, 50);
        // displayPlayers(self, players[id], 'ship');
      } else {
        let newPlayer = new Player(self, players[id].x, players[id].y, players[id].playerId, players[id].name);
        self.players.add(newPlayer);
      }
    });
  });

  this.socket.on('newPlayer', function(playerInfo) {
    //displayPlayers(self, playerInfo, 'otherPlayer');
    let newPlayer = new Player(self, playerInfo.x, playerInfo.y, playerInfo.playerId, playerInfo.name);
    self.players.add(newPlayer);

  });

  this.socket.on('disconnect', function(playerId) {
    self.players.getChildren().forEach(function(player) {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
  });

  this.socket.on('createBullet', function(bullet) {

    let newBullet = new Bullet(self, bullet.x, bullet.y, bullet.id);

    newBullet.setRotation(bullet.angle);
    self.bullets.add(newBullet);
  });

  this.socket.on('createBulletEnemy', function(enemyBullet) {

    if (enemyBullet.type === 'skelBullet') {
      let newEnemyBullet = new EnemyBulletSkeleton(self, enemyBullet.x, enemyBullet.y, enemyBullet.id);
      newEnemyBullet.setRotation(enemyBullet.angle);
      self.bulletsEnemy.add(newEnemyBullet);
    }

    if (enemyBullet.type === 'banditBullet') {
      let newEnemyBullet = new Bullet(self, enemyBullet.x, enemyBullet.y, enemyBullet.id);
      newEnemyBullet.setRotation(enemyBullet.angle);
      self.bulletsEnemy.add(newEnemyBullet);


    }


  });


  this.socket.on('createEnemy', function(enemy) {

    //slime
    if (enemy.type === 'slime') {

      let newEnemySlime = new SlimeEnemy(self, enemy.x, enemy.y, enemy.id);
      // var newEnemySlime=self.add.sprite(enemy.x,enemy.y,'slimeEnemy');
      self.enemies.add(newEnemySlime);
    }
    //skeleton
    if (enemy.type === 'skeletonEnemy') {
      var newEnemySkeleton = new SkeletonEnemy(self, enemy.x, enemy.y, enemy.id);

      self.enemies.add(newEnemySkeleton);

    }

    if (enemy.type === 'banditEnemy') {
      var newBanditEnemy = new BanditEnemy(self, enemy.x, enemy.y, enemy.id);
      self.enemies.add(newBanditEnemy);
    }

  });

  this.socket.on('createCoin', function(coin) {
    let newCoin = new Coin(self, coin.x, coin.y, coin.id);
    self.coins.add(newCoin);

  });

  this.socket.on('coinTouched', function(coinTouched) {
    self.coins.getChildren().forEach(function(coin) {

      if (coinTouched.id === coin.id) {

        coin.spin = coinTouched.spin;
        coin.touched = coinTouched.touched;

      }


    });



  });

  this.socket.on('enemyHit', function(id) {
    self.enemies.getChildren().forEach(function(enemy) {
      if (id === enemy.id) {
        enemy.hit = true;
      }
    })
  });


  this.socket.on('enemyDeath', function(id) {
    self.enemies.getChildren().forEach(function(enemy) {
      if (id === enemy.id) {
        enemy.death = true;
      }
    })
  });


  this.socket.on('enemyUpdates', function(enemiesArray) {

    Object.keys(enemiesArray).forEach(function(id) {
      self.enemies.getChildren().forEach(function(enemy) {



        if (enemiesArray[id].id === enemy.id) {
          var localTime = Date.now();

          //    console.log(enemiesArray[id]);
          if (enemiesArray[id].type === 'skeletonEnemy') {
            enemy.spawning = enemiesArray[id].spawning;
            enemy.moving = enemiesArray[id].moving;
            enemy.angle = enemiesArray[id].angle;
            enemy.idle = enemiesArray[id].idle;

          }


          if (enemiesArray[id].type === 'banditEnemy') {
            enemy.moving = enemiesArray[id].moving;
            enemy.angle = enemiesArray[id].angle;
            enemy.idle = enemiesArray[id].idle;

          }



          // enemy.updateTime = enemiesArray[id].updateTime;
          var targetX = enemiesArray[id].x;
          var targetY = enemiesArray[id].y;
          var duration = (localTime - enemy.lastUpdateTime);

          if (!enemy.lastUpdateTime) {
            enemy.setPosition(targetX, targetY);

          } else {
            var tween = self.tweens.add({
              targets: enemy,
              x: targetX,
              y: targetY,

              duration: duration,

              onComplete: function() {
                tween.destroy
              }

            });


          }

          if (enemiesArray[id].death) {
            enemy.death = true;

          } else {

            if (enemiesArray[id].hit) {
              enemy.hit = true;

            }
          }

          enemy.lastUpdateTime = localTime;
        }
      });
    });
  });

  this.socket.on('bulletUpdatesEnemy', function(bulletArray) {

    Object.keys(bulletArray).forEach(function(id) {
      self.bulletsEnemy.getChildren().forEach(function(bullet) {

        if (bulletArray[id].id === bullet.id) {
          var localTime = Date.now();
          var targetX = bulletArray[id].x;
          var targetY = bulletArray[id].y;
          var duration = (localTime - bullet.lastUpdateTime);

          if (!bullet.lastUpdateTime) {
            bullet.setPosition(targetX, targetY);

          } else {

            var tween = self.tweens.add({
              targets: bullet,
              x: targetX,
              y: targetY,
              duration: duration,
              onComplete: function() {
                tween.destroy
                if (bulletArray[id].hit == true) {

                  var bulletHit = self.add.sprite(bullet.x, bullet.y, 'playerSprites', 'on hit_on hit_0.png');
                  bulletHit.anims.play('bulletHit', true).on('animationcomplete', () => {
                    bulletHit.destroy();
                  });


                  bullet.destroy();

                }
              },
            });

          }

          bullet.lastUpdateTime = localTime;
        }
      });
    });
  });


  this.socket.on('bulletUpdates', function(bulletData) {
    self.bullets.getChildren().forEach(function(bullet) {

      if (bulletData.id === bullet.id) {
        //create rectangle for debugging
        //let render = self.add.graphics();
        //let bounds = bullet.getBounds();

        //render.lineStyle(3, 0xffff37);
        //render.strokeRectShape(bounds);
        var localTime = Date.now();

        var targetX = bulletData.x;
        var targetY = bulletData.y;
        var duration = (localTime - bullet.lastUpdateTime);
        var hit = bulletData.hit;

        if (!bullet.lastUpdateTime) {
          bullet.setPosition(targetX, targetY);
        } else {

          var tween = self.tweens.add({
            targets: bullet,
            x: targetX,
            y: targetY,

            duration: duration,
            onComplete: function() {
              tween.destroy

              if (hit == true) {

                var bulletHit = self.add.sprite(bullet.x, bullet.y, 'playerSprites', 'on hit_on hit_0.png');
                bulletHit.anims.play('bulletHit', true).on('animationcomplete', () => {
                  bulletHit.destroy();
                });


                bullet.destroy();

              }
            },
          });

        }

        bullet.lastUpdateTime = localTime;

      }


      //
    });

    //  });


  });






  this.socket.on('playerUpdates', function(players) {
    Object.keys(players).forEach(function(id) {
      self.players.getChildren().forEach(function(player) {
        if (players[id].playerId === player.playerId) {

          var localTimePlayer = Date.now();
          
          //set new updates to player   
          player.moving = players[id].moving;
          player.roll = players[id].roll;
          player.angle = players[id].angle;
          player.hit = players[id].hit;
          player.hearts = players[id].hearts;
          player.alive = players[id].alive;
          player.respawn = players[id].respawn;
          player.gunSprite.setRotation(player.angle);
          player.coins = players[id].coins;


          //update target x // target y and duration since last update
          var duration = (localTimePlayer - player.lastUpdateTime);


          var targetX = players[id].x;
          var targetY = players[id].y;


          if (!player.alive) {
            if (player.playDeathAnimation) {
              player.playDeathAnimation = false;
              player.gunSprite.setVisible(false);
              player.playerBody.anims.play('playerDeath', false).once('animationcomplete', () => {
                player.playerBody.setVisible(false);

                // player.playDeathAnimation=true;
              });

            }

          }

          if (player.respawn) {

            player.playerBody.setVisible(true);
            player.gunSprite.setVisible(true);

            player.playDeathAnimation = true;

            if (player == self.newPlayerLocal) {
              respawnHearts(self, player);
            }

          }

          if (player.alive) {

            if (!player.lastUpdateTime) {
     
              player.setPosition(targetX, targetY);

            } else {
              
           
              var tween = self.tweens.add({
                targets: player,
                x: targetX,
                y: targetY,

                duration: duration,
              });

            }

            if ((player.angle * (180 / Math.PI) > 90) || ((player.angle * (180 / Math.PI) > -180) && (player.angle * (180 / Math.PI) < -90))) {
              //flip player body sprite
              player.playerBody.flipX = true;
              player.gunSprite.flipY = true;
            } else {
              player.playerBody.flipX = false;
              player.gunSprite.flipY = false;

            }

            if (player.roll) {
              if (player.playRollAnimation) {
                player.playRollAnimation = false;
                player.playerBody.anims.play('playerRoll', false).once('animationcomplete', () => {
                  player.playRollAnimation = true;

                });

              }

            } else {
              //if moving play move animation
              if (player.moving) {

                player.playerBody.anims.play('playerRun', true); // play walk animation   
              } else
              //play idle animation
              {
                player.playerBody.anims.play('playerIdle', true);

              }
            }


          }
          player.lastUpdateTime = localTimePlayer;


        }
        //set this updatetime to last updatetime 


      });
    });
  });

  this.socket.on('doorOpen', function() {
    newDoor.anims.play('doorOpen', false);
  });


  this.socket.on('doorClose', function() {
    newDoor.anims.play('doorClose', false);
  });
  
  this.socket.on('createPortal', function(portal){
    var newPortal = new PortalSpawn(self,portal.x,portal.y,portal.id);
    self.portals.add(newPortal);
    console.log(self.portals);
    
  });
  
  this.socket.on('portalSpawn', function(id){

    self.portals.getChildren().forEach(function(portal){
      if (portal.id === id)
        {
          portal.anims.play('portalSpawn',false);
          
        }
    });
    
    
  });
  
  
  this.socket.on('portalPlayDeSpawnAnimation', function (id){
     self.portals.getChildren().forEach(function(portal){
      if (portal.id === id)
        {

          portal.anims.play('portalSpawnReverse',false);
          
        }
    });
  });
  
  this.socket.on('portalPlaySpawnAnimation', function(id){

    self.portals.getChildren().forEach(function(portal){
      if (portal.id === id)
        {
          portal.anims.play('portalSpawnEnemy',false);
          
        }
    });
    
    
  });
  
  
  this.socket.on('gameOver', function(playerName){
    
    
    var text="Winner is "+playerName+" !!!!!!";
    self.winText = self.add.text(300,400,text);
    self.winText.color="black";
    self.winText.setFontSize(30);
    self.winText.setFontFamily('FreeMono', 'monospace');
   
  });






}

function update(time, delta, self) {


  //if player ready
  if (this.newPlayerLocal && this.newPlayerLocal.alive) {

    this.scoreText.setText(this.newPlayerLocal.coins);

    pointerMove(this, this.input.activePointer, this.cameras.main);


    var inputInfo = {

      up: cursors.up.isDown,
      down: cursors.down.isDown,
      left: cursors.left.isDown,
      right: cursors.right.isDown,
      mouseRight: mouse.rightButtonDown(),
      mouseLeft: mouse.leftButtonDown(),
      angle: this.newPlayerLocal.angle,
      pointerX: this.input.activePointer.x + this.cameras.main.scrollX,
      pointerY: this.input.activePointer.y + this.cameras.main.scrollY
    }





    this.socket.emit('playerInput', inputInfo);


  }

  this.players.getChildren().forEach(player => {
    player.updatePlayer(time, this, player);
  });

  //update enemiesArray

  this.enemies.getChildren().forEach(enemy => {
    enemy.updateEnemy(time, this)
  });

  this.coins.getChildren().forEach(coin => {
    coin.updateCoin(this);
  });


}

function pointerMove(self, pointer, camera) {


  // if (!pointer.manager.isOver) return;
  self.newPlayerLocal.angle = Phaser.Math.Angle.Between(self.newPlayerLocal.x, self.newPlayerLocal.y, pointer.x + camera.scrollX, pointer.y + camera.scrollY);
  self.newPlayerLocal.gunSprite.setRotation(self.newPlayerLocal.angle);



  if ((self.newPlayerLocal.angle * (180 / Math.PI) > 90) || ((self.newPlayerLocal.angle * (180 / Math.PI) > -180) && (self.newPlayerLocal.angle * (180 / Math.PI) < -90))) {
    //flip player body sprite
    self.newPlayerLocal.playerBody.flipX = true;
    self.newPlayerLocal.gunSprite.flipY = true;
  } else {
    self.newPlayerLocal.playerBody.flipX = false;
    self.newPlayerLocal.gunSprite.flipY = false;

  }

}