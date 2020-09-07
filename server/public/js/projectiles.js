class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,id)
    {
        
        super(scene,x,y,'bullet');
        this.id=id;
        this.targetX=x;
        this.targetY=y;
        this.lastUpdateTime;
        scene.add.existing(this);

    }
}

class EnemyBulletSkeleton extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,id)
    {
        super(scene,x,y,'skeletonSprites','skeleton-bullet.png');
        this.id=id;
        this.targetX=x;
        this.targetY=y;
        this.lastUpdateTime;
        scene.add.existing(this);
        
        
        this.hit=false;
    }
}