class Coin extends Phaser.Physics.Arcade.Sprite{
    constructor(config)
    {
        super(config.scene, config.x, config.y,'coin');
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);
        this.spin=true;
        this.touched=false;
        this.inPlay=true;
        this.id=config.id;
       
    }
}

function coinPickup(coins,player)
{
    
   coins.disableBody(true,true);
   coins.spin=false;
   coins.touched=true;
  
   player.coins++;
    player.setUpdateCoins=true;
  
  coinArray[coins.id].touched=coins.touched;
  coinArray[coins.id].spin=coins.spin;
  
  io.emit('coinTouched', coinArray[coins.id]);
  
   delete coinArray[coins.id];  
   coins.destroy();
  

   /*
  
   if (coins.touched)
   {
   let coinPickupAnim=this.add.sprite(coins.x,coins.y,'playerSprites','Pick Up_pickup_0.png');    
   coinPickupAnim.anims.play('coinPickup',false).once('animationcomplete', ()=>{
  //

  
  coinPickupAnim.destroy();
  //spawn new coin
  spawnCoin(this,this.children.list[1]);
 });
 coins.destroy();
   }
  */
  
  

}


function spawnCoin(scene,wallLayer,coinId)
{
  
    const x = Phaser.Math.RND.between(0,800);
    const y = Phaser.Math.RND.between(0,800);
  
    var newCoin = new Coin({scene:scene,x:x,y:y,id:coinId});
    var wall=wallLayer.getTileAtWorldXY(newCoin.x,newCoin.y);
   
    scene.coins.getChildren().forEach((coin) =>{
       
       if (coin.getBounds().contains(newCoin.x, newCoin.y))
       {
           //console.log('destryoing coin '+newCoin.x, newCoin.y+' '+ coin.x, coin.y);
          newCoin.inPlay=false; 
        
       }   
    });
    //check overlap with walls and with other coins
    if (wall==null && newCoin.inPlay)
    {
    return newCoin;
    }
    else{
        //destroy coin and spawn coin again
        //console.log('destroying coin');
        newCoin.destroy();
        spawnCoin(scene,wallLayer,coinId);
        
    }
}