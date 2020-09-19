
  if (portalTest) {

     if (this.players && this.players.getLength() > 0)
       {  

           portalTest=false;
            this.portals.getChildren().forEach(function(portal) {
              console.log(portal.id);
          if (portal.id === 1) {
            //console.log(portal.id);
            portal.spawnEnemies(3);


          }
        });
         
         
       }
    
    

  }

  //spawn coin every 500 ms until max reached

  if (this.coins.getLength() < 20 && spawnTestCoins) {


    if (coinSpawnTime === 0 || time - coinSpawnTime > 2000) {
      let newCoin = null;
      coinIdCounter++;
      newCoin = spawnCoin(this, this.wallLayer, coinIdCounter);
      //if coin created
      if (newCoin)

      {

        this.coins.add(newCoin);

        coinArray[newCoin.id] = {
          x: newCoin.x,
          y: newCoin.y,
          id: newCoin.id
        };

        io.emit('createCoin', coinArray[newCoin.id]);

        coinSpawnTime = time;

      }


    }


  }


  if (banditTest) {
    if (this.enemies.getLength() < spawnTestEnemiesNumber && this.players && this.players.getLength() > 0) {
      if (spawnTime === 0 || (time - spawnTime > 5000)) {
        spawnTime = time;
        enemyIdCounter++;
        //io.emit('doorOpen');
        newDoor.doorOpenSpawnBandit(time, this, enemyIdCounter);

      }



    }

  }


  if (onePlayerSkeletonTest) {
    if (this.enemies.getLength() < spawnTestEnemiesNumber && this.players && this.players.getLength() > 0) {
      if (spawnTime === 0 || (time - spawnTime > 2000)) {
        enemyIdCounter++;

        x = Math.floor(Math.random() * 700) + 50;
        y = Math.floor(Math.random() * 500) + 50;

        let newEnemySkeleton = new SkeletonEnemy(this, x, y, enemyIdCounter);
        // findTarget(this,newEnemy,time);
        this.enemies.add(newEnemySkeleton);

        enemiesArray[newEnemySkeleton.id] = {
          x: newEnemySkeleton.x,
          y: newEnemySkeleton.y,
          id: newEnemySkeleton.id,
          type: newEnemySkeleton.type
        }

        io.emit('createEnemy', enemiesArray[newEnemySkeleton.id]);
        spawnTime = time;



      }


    }



  }



  if (twoPlayerTest) {

    if (this.enemies.getLength() < 10 && this.players && this.players.getLength() > 1) {

      if (spawnTime === 0 || (time - spawnTime > 2000)) {


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
        y = Math.floor(Math.random() * 500) + 50;

        let newEnemySkeleton = new SkeletonEnemy(this, x, y, enemyIdCounter);
        // findTarget(this,newEnemy,time);
        this.enemies.add(newEnemySkeleton);

        enemiesArray[newEnemySkeleton.id] = {
          x: newEnemySkeleton.x,
          y: newEnemySkeleton.y,
          id: newEnemySkeleton.id,
          type: newEnemySkeleton.type
        }

        io.emit('createEnemy', enemiesArray[newEnemySkeleton.id]);


        enemyIdCounter++;

        x = Math.floor(Math.random() * 700) + 50;
        y = Math.floor(Math.random() * 500) + 50;

        var newEnemySlime = new SlimeEnemy(this, x, y, enemyIdCounter);
        newEnemySlime.setSize(10, 10, true);
        this.enemies.add(newEnemySlime);


        enemiesArray[newEnemySlime.id] = {
          x: newEnemySlime.x,
          y: newEnemySlime.y,
          id: newEnemySlime.id,
          type: newEnemySlime.type
        };

        io.emit('createEnemy', enemiesArray[newEnemySlime.id]);
        spawnTime = time;


      }

    }

  }


