class GameController {
  constructor()
  {
    this.enemyIdCounter=0;
    this.coinWinAmout=30;
    this.winState=false;
    this.winningPlayer=null;
    this.chanceSpawnSkeleton=10;
    this.chanceSpawnBandit=5;
    this.chanceSpawnTimer=2000;
    this.chanceSpawnTime=0;
    this.playersToStart=2;
    this.coinsInGame=20;
    this.gameRun=false;
    this.coinSpawnTime=0;
    this.coinSpawnTimer=2000;
    this.coinIdCounter=0;
    this.gameOver=false;
  }
  
  
  update(scene,time)
  {
    if (scene.players.getLength() === this.playersToStart && !this.gameOver)
      {
        
        this.gameRun=true;

      }
    
    if (this.gameRun && !this.gameOver)
    {
    this.checkCoins(scene);
    this.spawnCoins(scene,time);
    this.chanceSpawn(scene,time);
    }
    
    if (this.gameOver)
      {
        
        this.gameRun=false;
      }
    
  }
  
  
  
  chanceSpawn(scene,time)
  {
    
    if (time - this.chanceSpawnTime > this.chanceSpawnTimer || this.chanceSpawnTime === 0)
      {
        
        var chanceSkel = Math.floor(Math.random() * 100);
        
        var chanceBandit=Math.floor(Math.random() * 100);
        
        
        if (chanceSkel<=this.chanceSpawnSkeleton)
          {
            this.spawnSkeleton(scene);
            
          }
        
         if (chanceBandit<=this.chanceSpawnBandit)
          {
            
            this.spawnBandit(time,scene);
            
          }
        
        
        this.chanceSpawnTime=time;
        
      }
  }
  
  spawnCoins(scene,time)
  {

   if (scene.coins.getLength() < this.coinsInGame) {

    if (this.coinSpawnTime === 0 || time - this.coinSpawnTime > this.coinSpawnTimer) {
      let newCoin = null;
      this.coinIdCounter++;
      newCoin = spawnCoin(scene, scene.wallLayer, this.coinIdCounter);
      //if coin created
      if (newCoin)

      {

        scene.coins.add(newCoin);

        coinArray[newCoin.id] = {
          x: newCoin.x,
          y: newCoin.y,
          id: newCoin.id
        };

        io.emit('createCoin', coinArray[newCoin.id]);

        this.coinSpawnTime = time;

      }

        
        
        
      }
    
    
  }

    
  }
  
  spawnSkeleton(scene)
  {
        
        var x = Math.floor(Math.random() * 700) + 50;
         var y = Math.floor(Math.random() * 500) + 50;

        let newEnemySkeleton = new SkeletonEnemy(scene, x, y, this.enemyIdCounter);
        // findTarget(this,newEnemy,time);
        scene.enemies.add(newEnemySkeleton);

        enemiesArray[newEnemySkeleton.id] = {
          x: newEnemySkeleton.x,
          y: newEnemySkeleton.y,
          id: newEnemySkeleton.id,
          type: newEnemySkeleton.type
        }
        this.idAddOne();

        io.emit('createEnemy', enemiesArray[newEnemySkeleton.id]);
    
  }
  
  
  spawnBandit(time,scene)
  {
    
      
      scene.newDoor.doorOpenSpawnBandit(time, scene, this.enemyIdCounter);
      this.idAddOne();
    
    
  }
  
  
 idAddOne()
  {
    this.enemyIdCounter++;
    
  }
  
  checkCoins(scene)
  {
    
    scene.players.getChildren().forEach(player =>{
      if (player.coins === this.coinWinAmout)
        {
          console.log('player wins game');
          this.gameRun=false;
          this.gameOver=true;
          this.winningPlayer=player;
        }
      
    });
    
    
  }

}
  
