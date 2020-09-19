class HeartRed extends Phaser.GameObjects.Sprite{
    constructor(config)
    {
    super(config.scene, config.x, config.y,'playerSprites','hearts_hearts_0.png');  
    config.scene.add.existing(this);   
    }
}

function addHearts(scene,player,x,y)
{
//first heart at 30,30    
for (var i=0; i<player.totalHearts; i++)
    {
    newHeart = new HeartRed({scene:scene,x:x,y:y});
    newHeart.setDisplaySize(20,20);
    scene.hearts.add(newHeart);
    x+=(newHeart.displayWidth);
    }
}

//add 3 hearts after respawning
function respawnHearts(scene,player)
{
  var heartgroup=scene.hearts.getChildren(); 
  for (var i=0; i< player.totalHearts; i++)
    {
       heartgroup[i].setTexture('playerSprites','hearts_hearts_0.png');
    }
}

//show grey hearts over red
function updateHearts(scene,player)
{
    var totalHearts = player.totalHearts;
    var heartgroup=scene.hearts.getChildren();
    for (var i=totalHearts-1; i>player.hearts-1;i--)
    {
      if (heartgroup[i])
        {
        heartgroup[i].setTexture('playerSprites','hearts_hearts_1.png');
        }
    }
      
      
    

}