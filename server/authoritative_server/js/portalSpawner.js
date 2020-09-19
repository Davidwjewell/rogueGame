class PortalSpawn extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "portalHidden");
    config.scene.add.existing(this);
    this.id = config.id;
    this.portalSpawnAnimationTimer = 2000;
    this.portalDeSpawnAnimationTimer = 50;
    this.spawnSlimeTimer = 1000;
    this.portalSpawned = false;
    this.portalSpawnCheck = true;
    this.enemySpawnCheck = true;
    this.slimeSpawned = false;
    this.portalDeSpawned = false;
    this.portalSpawnStartTime = 0;
    this.portalSpawnSlimeTime = 0;
    this.active = false;
    this.deSpawn=false;
    this.spawnEnemySlimes=false;
    this.numToSpawn = null;
    this.spawnEnemy = false;
    this.numEnemySpawned = 0
    this.idcounter=0;
    this.firstDistanceCheckTime=10000
    this.distanceCheckTime=0;
    this.distanceCheckTimer=2000;
    this.radius=100;
    this.enemyFound=false;
    this.deSpawnTime=0;
    this.despawnTimeOut=5000;
    this.scanForPlayer=true;
    this.startingTimeOut=true;
    this.portalMaxEnemies=5;
  

    //logic for this spawning and spawning enemy
  }

 // spawnEnemies(number) {
  //  this.numToSpawn = number;

//  }

  updatePortal(time, scene) {

    if (!this.active)
      {
        
        if (time > this.firstDistanceCheckTime)
          {
            this.startingTimeOut=false;
          }
        
        if (!this.startingTimeOut)
          {
  
        if (time - this.distanceCheckTime > this.distanceCheckTimer || this.distanceCheckTime===0)
          {
           
            this.distanceCheckTime=time;
            this.scanForPlayer=true;
            if (this.scanForPlayer)
              {
     
                this.scanForPlayer=false;
                
            
        scene.players.getChildren().forEach(player =>{
          
           if (Phaser.Math.Distance.Between(player.x,player.y,this.x,this.y)<=this.radius)
             {
          
               this.enemyFound=true;
               
             }

        });
     
        
        if (this.enemyFound)
          {
          
            var numEnemiesToSpawn=Math.floor(Math.random() * this.portalMaxEnemies)+1;
            this.active=true;
            this.numToSpawn=numEnemiesToSpawn;
            
          }
        
            
          }
            
          }
            
          }
            
      }

    if (this.active) {
      if (!this.portalSpawned) {
        if (this.portalSpawnCheck) {
          this.portalSpawnCheck = false;
          this.portalSpawnStartTime = time;
          io.emit('portalSpawn', this.id);
          console.log('emit portal spawn event');
        }
        // console.log(time-this.portalSpawnStartTime);
        if (time - this.portalSpawnStartTime > this.portalSpawnAnimationTimer) {
          //portal animation has finished playing
          //can now spawn enemies
          this.portalSpawned = true;
          this.numEnemySpawned=0;
          // this.portalSpawnCheck=true;
        }

      }

      if (this.portalSpawned) {
        if (this.numEnemySpawned < this.numToSpawn) {

          this.spawnEnemySlimes = true;

        } 
        else {
       
          this.spawnEnemySlimes = false;
          this.deSpawn=true;
        }

        if (this.spawnEnemySlimes) {
          
          if (this.enemySpawnCheck) {

            this.enemySpawnCheck = false;
            io.emit('portalPlaySpawnAnimation', this.id);
            this.portalSpawnSlimeTime = time;

          }
          if (time - this.portalSpawnSlimeTime > this.spawnSlimeTimer)
            {
              this.spawnEnemy=true;
            }
          
          if (this.spawnEnemy)
            //create enemy
            {
            this.spawnEnemy=false;  
        
            var newEnemySlime = new SlimeEnemy(scene, this.x, this.y + 20, scene.gameController.enemyIdCounter);
            newEnemySlime.setSize(10, 10, true);
            scene.enemies.add(newEnemySlime);


            enemiesArray[newEnemySlime.id] = {
              x: newEnemySlime.x,
              y: newEnemySlime.y,
              id: newEnemySlime.id,
              type: newEnemySlime.type
            };

            io.emit('createEnemy', enemiesArray[newEnemySlime.id]);

            scene.gameController.idAddOne();
        
            this.numEnemySpawned++;
            this.enemySpawnCheck = true;
            }
          

        }


      }
      
      if (this.deSpawn)
        {
          this.deSpawn=false;  
          this.active=false;
          this.enemyFound=false;
          this.portalSpawned=false;
          this.enemyFound=false;
          this.portalSpawnCheck=true;
          this.enemySpawnCheck=true;
          this.hide=true;
          this.deSpawnTime=time;
        
          io.emit('portalPlayDeSpawnAnimation', this.id);
        }

    }
    
    
    

  }

}
