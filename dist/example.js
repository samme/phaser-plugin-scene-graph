
/*
  http://phaser.io/examples/v2/games/tanks
 */

(function() {
  "use strict";
  var EnemyTank, bulletHitEnemy, bulletHitPlayer, bullets, create, currentSpeed, cursors, enemies, enemiesAlive, enemiesTotal, enemyBullets, explosions, fire, fireRate, game, graphWorld, init, land, logo, nextFire, preload, removeLogo, render, restart, shadow, tank, turret, update;

  land = void 0;

  shadow = void 0;

  tank = void 0;

  turret = void 0;

  enemies = void 0;

  enemyBullets = void 0;

  enemiesTotal = 0;

  enemiesAlive = 0;

  explosions = void 0;

  logo = void 0;

  currentSpeed = 0;

  cursors = void 0;

  bullets = void 0;

  fireRate = 500;

  nextFire = 0;

  init = function() {
    game.plugins.add(Phaser.Plugin.SceneGraph);
  };

  preload = function() {
    game.load.baseURL = 'tanks/';
    game.load.atlas('tank', 'tanks.png', 'tanks.json');
    game.load.atlas('enemy', 'enemy-tanks.png', 'tanks.json');
    game.load.image('logo', 'logo.png');
    game.load.image('bullet', 'bullet.png');
    game.load.image('earth', 'scorched_earth.png');
    game.load.spritesheet('kaboom', 'explosion.png', 64, 64, 23);
  };

  create = function() {
    var events, explosionAnimation, i, j, keyboard, ref, world;
    world = game.world;
    land = game.add.tileSprite(0, 0, world.width, world.height, 'earth');
    land.fixedToCamera = true;
    tank = game.add.sprite(0, 0, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    tank.body.drag.set(0.5);
    tank.body.maxVelocity.setTo(100, 100);
    tank.body.collideWorldBounds = true;
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);
    enemyBullets = game.add.group(game.world, 'enemyBullets');
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(30, 'bullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);
    enemies = [];
    enemiesAlive = enemiesTotal = 3;
    for (i = j = 1, ref = enemiesTotal; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      enemies.push(new EnemyTank(i, game, tank, enemyBullets));
      i++;
    }
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);
    bullets = game.add.group(game.world, 'bullets');
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    explosions = game.add.group(game.world, 'explosions');
    i = 0;
    while (i < 10) {
      explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.alpha = 0.75;
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
      i++;
    }
    tank.bringToTop();
    turret.bringToTop();
    logo = game.add.sprite(0, 200, 'logo');
    logo.fixedToCamera = true;
    game.input.onDown.add(removeLogo, this);
    game.camera.follow(tank);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);
    cursors = game.input.keyboard.createCursorKeys();
    keyboard = game.input.keyboard;
    keyboard.addKey(Phaser.KeyCode.G).onDown.add(graphWorld, this);
    keyboard.addKey(Phaser.KeyCode.R).onDown.add(restart, this);
    events = game.time.events;
    events.add(1000, function() {
      console.log("Example: graph w/ defaults:");
      return game.debug.graph();
    });
    events.add(2000, function() {
      console.log("Example: graph w/ `filter`: include only named objects");
      return game.debug.graph(game.world, {
        filter: function(obj) {
          return obj.name;
        }
      });
    });
    events.add(3000, function() {
      console.log("Example: graph w/ `map`: name only");
      return game.debug.graph(game.world, {
        map: function(obj) {
          var ref1;
          return "" + (obj.name || obj.key || ((ref1 = obj.constructor) != null ? ref1.name : void 0));
        }
      });
    });
  };

  graphWorld = function() {
    return game.debug.graph(game.world, {
      collapse: false
    });
  };

  removeLogo = function() {
    game.input.onDown.remove(removeLogo, this);
    logo.kill();
  };

  restart = function() {
    return game.state.restart();
  };

  update = function() {
    var enemy, j, len;
    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
    enemiesAlive = 0;
    for (j = 0, len = enemies.length; j < len; j++) {
      enemy = enemies[j];
      if (!enemy.alive) {
        continue;
      }
      enemiesAlive++;
      game.physics.arcade.collide(tank, enemy.tank);
      game.physics.arcade.overlap(bullets, enemy.tank, bulletHitEnemy, null, this);
      enemy.update();
    }
    if (cursors.left.isDown) {
      tank.angle -= 3;
    } else if (cursors.right.isDown) {
      tank.angle += 3;
    }
    if (cursors.up.isDown) {
      currentSpeed = 300;
    } else if (currentSpeed > 0) {
      currentSpeed -= 4;
    }
    if (currentSpeed > 0) {
      game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }
    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;
    turret.x = tank.x;
    turret.y = tank.y;
    turret.rotation = game.physics.arcade.angleToPointer(turret);
    if (game.input.activePointer.isDown) {
      fire();
    }
  };

  bulletHitPlayer = function(tank, bullet) {
    bullet.kill();
  };

  bulletHitEnemy = function(tank, bullet) {
    var destroyed, explosionAnimation, size;
    bullet.kill();
    destroyed = tank._parent.damage();
    size = destroyed ? 2 : 1;
    explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(tank.x, tank.y);
    explosionAnimation.scale.setTo(game.rnd.realInRange(0.5 * size, 1.5 * size));
    explosionAnimation.play('kaboom', 30, false, true);
  };

  fire = function() {
    var bullet;
    if (game.time.now > nextFire && bullets.countDead() > 0) {
      nextFire = game.time.now + fireRate;
      bullet = bullets.getFirstExists(false);
      bullet.reset(turret.x, turret.y);
      bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }
  };

  render = function() {
    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    game.debug.text("Plugin v" + Phaser.Plugin.SceneGraph.VERSION + " | (G)raph to the browser console (R)estart", 32, game.camera.height - 32);
  };

  EnemyTank = function(index, game, player, bullets) {
    var x, y;
    x = game.world.randomX;
    y = game.world.randomY;
    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;
    this.name = "enemyTank" + index;
    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');
    this.shadow.anchor.set(0.5);
    this.tank.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);
    this.tank.name = "tank" + index;
    this.tank._parent = this;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    this.tank.body.immovable = false;
    this.tank.body.collideWorldBounds = true;
    this.tank.body.bounce.setTo(1, 1);
    this.tank.angle = game.rnd.angle();
    game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
  };

  EnemyTank.prototype.damage = function() {
    this.health -= 1;
    if (this.health <= 0) {
      this.alive = false;
      this.shadow.kill();
      this.tank.kill();
      this.turret.kill();
      return true;
    }
    return false;
  };

  EnemyTank.prototype.update = function() {
    var bullet;
    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;
    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300) {
      if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
        this.nextFire = this.game.time.now + this.fireRate;
        bullet = this.bullets.getFirstDead();
        bullet.reset(this.turret.x, this.turret.y);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
      }
    }
  };

  this.game = game = new Phaser.Game(800, 800, Phaser.AUTO, 'phaser-example', {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);

