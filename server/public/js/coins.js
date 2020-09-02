class Coin extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,id)
    {
        super(scene, x, y,'coin');
        scene.add.existing(this);
        this.spin=true;
        this.touched=false;
        this.id=id;
       
    }
  
    updateCoin(scene)
  {
    if (this.spin)
      {
        
        this.anims.play('coinSpin',true);
      }
    
    if (this.touched)
      {
          let coinPickupAnim=scene.add.sprite(this.x,this.y,'playerSprites','Pick Up_pickup_0.png');    
          coinPickupAnim.anims.play('coinPickup',false).once('animationcomplete', ()=>{
          coinPickupAnim.destroy();  
      });
        
        this.destroy();
      }

  }

}

/*
function coinPickup(coins)
{
    
   coins.disableBody(true,true);
   coins.spin=false;
   coins.touched=true;

   
   if (coins.touched)
   {
   let coinPickupAnim=this.add.sprite(coins.x,coins.y,'playerSprites','Pick Up_pickup_0.png');    
   coinPickupAnim.anims.play('coinPickup',false).once('animationcomplete', ()=>{
  //

  newPlayer.coins++;
  scoreText.setText(newPlayer.coins);
  
  coinPickupAnim.destroy();
  //spawn new coin
  spawnCoin(this,this.children.list[1]);
 });
 coins.destroy();
   }
  

}


function spawnCoin(scene,wallLayer)
{
  
    const x = Phaser.Math.RND.between(0,800);
    const y = Phaser.Math.RND.between(0,800);
  
    var newCoin = new Coin({scene:scene,x:x,y:y});
    var wall=wallLayer.getTileAtWorldXY(newCoin.x,newCoin.y);
   
    coins.getChildren().forEach((coin) =>{
       
       if (coin.getBounds().contains(newCoin.x, newCoin.y))
       {
           //console.log('destryoing coin '+newCoin.x, newCoin.y+' '+ coin.x, coin.y);
          newCoin.inPlay=false; 
        
       }   
    });
    //check overlap with walls and with other coins
    if (wall==null && newCoin.inPlay)
    {
    coins.add(newCoin);
    }
    else{
        //destroy coin and spawn coin again
        //console.log('destroying coin');
        newCoin.destroy();
        spawnCoin(scene,wallLayer);
        
    }
}
*/