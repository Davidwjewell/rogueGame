
class Door extends Phaser.GameObjects.Sprite{
    constructor(config)
    {
    super(config.scene, config.x, config.y,'doorSprites','door anim_Animation 1_11.png');  
    config.scene.add.existing(this);
    this.open=false; 
    this.doorOpenTime=null;
    this.doorOpenTimer=2000;
    
    }
  
    updateDoor(time)
    {
      
      if (time-this.doorOpenTimer>0)
        {
          if (this.open)
            {
          console.log('close door');
          io.emit('doorClose');
          this.open=false;
            }
          
        }
    
      
    }
  
    doorOpenSpawnBandit(time,self,id)
    {
 
      io.emit('doorOpen');
      this.anims.play('doorOpen',false).once('animationcomplete', ()=>{
        
      let newEnemyBandit = new BanditEnemy(self, self.newDoor.x, self.newDoor.y, id);
   
      self.enemies.add(newEnemyBandit);

        enemiesArray[newEnemyBandit.id] = {
          x: newEnemyBandit.x,
          y: newEnemyBandit.y,
          id: newEnemyBandit.id,
          type: newEnemyBandit.type
          };

       io.emit('createEnemy', enemiesArray[newEnemyBandit.id]);        
          
        
        
      this.open=true;
      this.doorOpenTime=time;  
      });
      
    }
  
  
  
  
}
