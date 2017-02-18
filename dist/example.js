(function() {
  var ADD, Phaser, aliens, bulletTime, bullets, collisionHandler, create, createAliens, cursors, descend, enemyBullet, enemyBullets, enemyFires, enemyHitsPlayer, explosions, fireBullet, fireButton, firingTimer, game, init, lives, livingEnemies, player, preload, render, restart, score, scoreString, scoreText, setupInvader, starfield, stateText, update;

  Phaser = this.Phaser;

  ADD = Phaser.blendModes.ADD;

  aliens = void 0;

  bullets = void 0;

  bulletTime = 0;

  cursors = void 0;

  enemyBullet = void 0;

  enemyBullets = void 0;

  explosions = void 0;

  fireButton = void 0;

  firingTimer = 0;

  lives = void 0;

  livingEnemies = [];

  player = void 0;

  score = 0;

  scoreString = "";

  scoreText = void 0;

  starfield = void 0;

  stateText = void 0;

  init = function() {
    var debug;
    debug = game.debug;
    debug.font = "16px monospace";
    debug.lineHeight = 25;
    game.clearBeforeRender = false;
    if (!game.sceneGraphPlugin) {
      game.sceneGraphPlugin = game.plugins.add(Phaser.Plugin.SceneGraph);
    }
  };

  preload = function() {
    game.load.path = "invaders/";
    game.load.image("bullet", "bullet.png");
    game.load.image("enemyBullet", "enemy-bullet.png");
    game.load.spritesheet("invader", "invader32x32x4.png", 32, 32);
    game.load.image("ship", "player.png");
    game.load.spritesheet("kaboom", "explode.png", 128, 128);
    game.load.image("starfield", "starfield.png");
  };

  create = function() {
    var caption, debug, i, livesText, ship, style, world;
    debug = game.debug, world = game.world;
    world.setBounds(0, 0, 800, 600);
    debug.bounds = new Phaser.Rectangle(800, 0, game.width - world.width, game.height);
    starfield = game.add.tileSprite(0, 0, 800, 600, "starfield");
    bullets = game.add.group(world, "bullets");
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10, "bullet");
    bullets.setAll("anchor.x", 0.5);
    bullets.setAll("anchor.y", 1);
    bullets.setAll("blendMode", ADD);
    bullets.setAll("outOfBoundsKill", true);
    bullets.setAll("checkWorldBounds", true);
    enemyBullets = game.add.group(world, "enemyBullets");
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(10, "enemyBullet");
    enemyBullets.setAll("anchor.x", 0.5);
    enemyBullets.setAll("anchor.y", 1);
    enemyBullets.setAll("blendMode", ADD);
    enemyBullets.setAll("outOfBoundsKill", true);
    enemyBullets.setAll("checkWorldBounds", true);
    player = game.add.sprite(400, 500, "ship");
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    aliens = game.add.group(world, "aliens");
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;
    createAliens();
    style = {
      align: "center",
      fill: "white",
      font: "24px monospace"
    };
    scoreString = "Score: ";
    scoreText = game.add.text(10, 10, scoreString + score, style);
    scoreText.name = "scoreText";
    lives = game.add.group(world, "lives");
    livesText = game.add.text(game.world.width - 100, 10, "Lives", style);
    livesText.name = "livesText";
    stateText = game.add.text(game.world.centerX, game.world.centerY, " ", style);
    stateText.name = "stateText";
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
    i = 0;
    while (i < 3) {
      ship = lives.create(game.world.width - 100 + 30 * i, 60, "ship");
      ship.anchor.setTo(0.5, 0.5);
      ship.angle = 90;
      ship.alpha = 0.5;
      i++;
    }
    explosions = game.add.group(world, "explosions");
    explosions.createMultiple(10, "kaboom");
    explosions.setAll("blendMode", ADD);
    explosions.forEach(setupInvader, this);
    caption = game.stage.addChild(game.make.text(0, 0, "Phaser v" + Phaser.VERSION + " Plugin v" + Phaser.Plugin.SceneGraph.VERSION, {
      fill: "white",
      font: "12px monospace"
    }));
    caption.alignIn(game.camera.view, Phaser.BOTTOM_LEFT, -5, -5);
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  };

  createAliens = function() {
    var alien, tween, x, y;
    y = 0;
    while (y < 4) {
      x = 0;
      while (x < 10) {
        alien = aliens.create(x * 48, y * 50, "invader");
        alien.anchor.setTo(0.5, 0.5);
        alien.animations.add("fly", [0, 1, 2, 3], 20, true);
        alien.play("fly");
        alien.body.moves = false;
        x++;
      }
      y++;
    }
    aliens.x = 100;
    aliens.y = 50;
    tween = game.add.tween(aliens).to({
      x: 200
    }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
    tween.onLoop.add(descend, this);
  };

  setupInvader = function(invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add("kaboom");
  };

  descend = function() {
    aliens.y += 10;
  };

  update = function() {
    starfield.tilePosition.y += 1;
    if (player.alive) {
      player.body.velocity.setTo(0, 0);
      if (cursors.left.isDown) {
        player.body.velocity.x = -200;
      } else if (cursors.right.isDown) {
        player.body.velocity.x = 200;
      }
      if (fireButton.isDown) {
        fireBullet();
      }
      if (game.time.now > firingTimer) {
        enemyFires();
      }
      game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
      game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
    }
  };

  render = function() {
    var debug, lineHeight, x, y;
    debug = game.debug;
    x = debug.bounds.left;
    y = debug.bounds.top;
    lineHeight = 25;
    debug.text("game.debug.renderGraph()", x, y += lineHeight, "white", debug.font);
    debug.text("------------------------", x, y += lineHeight, "white", debug.font);
    debug.renderGraph(game.world, x, y += lineHeight, debug.font, 25);
    y = 375;
    game.sceneGraphPlugin.renderColors(x, y, debug.font, 25);
  };

  collisionHandler = function(bullet, alien) {
    var explosion;
    bullet.kill();
    alien.kill();
    score += 20;
    scoreText.text = scoreString + score;
    explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play("kaboom", 30, false, true);
    if (aliens.countLiving() === 0) {
      score += 1000;
      scoreText.text = scoreString + score;
      enemyBullets.callAll("kill", this);
      stateText.text = "VICTORY\n\n[restart]";
      stateText.visible = true;
      game.input.onTap.addOnce(restart, this);
    }
  };

  enemyHitsPlayer = function(_player, bullet) {
    var explosion, live;
    bullet.kill();
    live = lives.getFirstAlive();
    if (live) {
      live.kill();
    }
    explosion = explosions.getFirstExists(false);
    explosion.reset(_player.body.x, _player.body.y);
    explosion.play("kaboom", 30, false, true);
    if (lives.countLiving() < 1) {
      _player.kill();
      enemyBullets.callAll("kill");
      stateText.text = "GAME OVER\n\n[restart]";
      stateText.visible = true;
      game.input.onTap.addOnce(restart, this);
    }
  };

  enemyFires = function() {
    var random, shooter;
    enemyBullet = enemyBullets.getFirstExists(false);
    livingEnemies.length = 0;
    aliens.forEachAlive(function(alien) {
      livingEnemies.push(alien);
    });
    if (enemyBullet && livingEnemies.length > 0) {
      random = game.rnd.integerInRange(0, livingEnemies.length - 1);
      shooter = livingEnemies[random];
      enemyBullet.reset(shooter.body.x, shooter.body.y);
      game.physics.arcade.moveToObject(enemyBullet, player, 120);
      firingTimer = game.time.now + 2000;
    }
  };

  fireBullet = function() {
    var bullet;
    if (game.time.now > bulletTime) {
      bullet = bullets.getFirstExists(false);
      if (bullet) {
        bullet.reset(player.x, player.y + 8);
        bullet.body.velocity.y = -400;
        bulletTime = game.time.now + 200;
      }
    }
  };

  restart = function() {
    lives.callAll("revive");
    aliens.removeAll();
    createAliens();
    player.revive();
    stateText.visible = false;
  };

  game = new Phaser.Game(1200, 600, Phaser.CANVAS, "phaser-example", {
    init: init,
    preload: preload,
    create: create,
    update: update,
    render: render
  });

}).call(this);

