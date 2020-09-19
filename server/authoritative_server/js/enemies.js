class SlimeEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, id) {

    super(scene, x, y, 'slimeEnemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.type = 'slime';
    this.health = 150;
    this.id = id;
    this.speed = 50;
    this.death = false;
    this.hit = false;
    this.checkHit = true;
    this.hitTime = 0;
    this.flashTime = 150;
    this.checkTargetTime = 0;
    this.checkTargetAgainTimer = 5000; //check target every 5000 ms 
    this.target;
  }
}


class SkeletonEnemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id) {
    super(scene, x, y);
    scene.add.existing(this);
    this.moveDelay = 1000;
    this.type = 'skeletonEnemy';
    this.id = id;
    this.target;
    this.hit = false;
    this.checkHit = true;
    this.hitTime = 0;
    this.fireTime = 0;
    this.fireDelay = 500;
    this.health = 200; // 4 shots
    this.speed = 40;
    this.shotDistance = 150;
    this.totalShots = 0;
    this.shotGroup = 2;
    this.activeState = false;
    this.projectilespeed = 400;
    this.idle = false;
    this.idleTime = 5000;
    this.idleStart = 0;
    this.angle = 0; // angle to player used to flip sprite / gun
    this.spawning = true; //spawn 
    this.playSpawnAnimation = true; // animation control
    this.inRange = false;
    this.checkTargetTime = 0;
    this.checkTargetAgainTimer = 5000;
    this.setSize(10, 15);
    scene.physics.world.enable(this);

    this.weaponSprite = scene.physics.add.sprite(0, 0, 'skeletonSprites', 'skeleton-weapon.png');
    this.weaponSprite.setSize(10, 15, true);

    //body sprite
    this.bodySprite = scene.physics.add.sprite(0, 0, 'skeletonSprites', 'skeleton-idle-00.png');
    this.bodySprite.setSize(10, 15, true);

    this.add(this.bodySprite);
    this.add(this.weaponSprite);
  }
}



class BanditEnemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y, id) {
    super(scene, x, y);
    scene.add.existing(this);
    this.type = 'banditEnemy';
    this.id = id;
    this.target = null;
    this.hit = false;
    this.checkHit = true;
    this.hitTime = 0;
    this.flashTime = 150;
    this.angle = 0;
    this.moving = true;
    this.death=false;
    this.fireDelay = 400;
    this.shotDistance = 300;
    this.checkTargetTime = 0;
    this.checkTargetAgainTimer = 5000;
    this.distanceCheckTimer=0;
    this.shotGroup = 3;
    this.totalShots = 0;
    this.idle = false;
    this.activeState = true;
    this.idleTime = 2000;
    this.idleStart = 0;
    this.speed = 30;
    this.fireTime = 0;
    this.health = 250; // 5 shots
    this.inRange = false;
    this.projectilespeed = 400;
    this.setSize(10, 15);
    scene.physics.world.enable(this);


    this.weaponSprite = scene.physics.add.sprite(0, 0, 'banditSprites', 'bandit_gun.png');
    this.weaponSprite.setSize(10, 15, true);
    this.bodySprite = scene.physics.add.sprite(0, 0, 'banditSprites', 'bandit_idle_00.png');
    this.bodySprite.setSize(10, 15, true);

    this.add(this.bodySprite);
    this.add(this.weaponSprite);
  }

}

function enemyCollide(bullet, enemy) {
  // bullets.destroy();
  if (!bullet.hit) {
    if (bullet) {
      bullet.hit = true;
      bullet.setVelocityX(0);
      bullet.setVelocityY(0);
      bullet.disableBody(true, true);
      if (bulletArray[bullet.id]) {
        bulletArray[bullet.id].hitX = bullet.x;
        bulletArray[bullet.id].hitY = bullet.y;

      }
    }
    if (!enemy.hit) {
      enemy.hit = true;
      enemy.health -= 50;
      

    }

    if (enemy.health <= 0) {
      enemy.death = true;
    }


  }
}


function setGunAngle(enemy) {

  enemy.angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, enemy.target.x, enemy.target.y);

  enemy.weaponSprite.setRotation(enemy.angle);

}

