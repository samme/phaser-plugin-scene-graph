{Phaser} = this

{ADD} = Phaser.blendModes

aliens = undefined
bullets = undefined
bulletTime = 0
cursors = undefined
enemyBullet = undefined
enemyBullets = undefined
explosions = undefined
fireButton = undefined
firingTimer = 0
lives = undefined
livingEnemies = []
player = undefined
score = 0
scoreString = ""
scoreText = undefined
starfield = undefined
stateText = undefined

init = ->
  {debug} = game
  debug.font = "16px monospace"
  debug.lineHeight = 25
  game.clearBeforeRender = no
  unless game.sceneGraphPlugin
    game.sceneGraphPlugin = game.plugins.add Phaser.Plugin.SceneGraph
  return

preload = ->
  game.load.path = "invaders/"
  game.load.image "bullet", "bullet.png"
  game.load.image "enemyBullet", "enemy-bullet.png"
  game.load.spritesheet "invader", "invader32x32x4.png", 32, 32
  game.load.image "ship", "player.png"
  game.load.spritesheet "kaboom", "explode.png", 128, 128
  game.load.image "starfield", "starfield.png"
  return

create = ->
  {debug, world} = game
  world.setBounds 0, 0, 800, 600
  debug.bounds = new Phaser.Rectangle 800, 0, game.width - world.width, game.height
  #  The scrolling starfield background
  starfield = game.add.tileSprite(0, 0, 800, 600, "starfield")
  #  Our bullet group
  bullets = game.add.group world, "bullets"
  bullets.enableBody = true
  bullets.physicsBodyType = Phaser.Physics.ARCADE
  bullets.createMultiple 10, "bullet"
  bullets.setAll "anchor.x", 0.5
  bullets.setAll "anchor.y", 1
  bullets.setAll "blendMode", ADD
  bullets.setAll "outOfBoundsKill", true
  bullets.setAll "checkWorldBounds", true
  # The enemy's bullets
  enemyBullets = game.add.group world, "enemyBullets"
  enemyBullets.enableBody = true
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE
  enemyBullets.createMultiple 10, "enemyBullet"
  enemyBullets.setAll "anchor.x", 0.5
  enemyBullets.setAll "anchor.y", 1
  enemyBullets.setAll "blendMode", ADD
  enemyBullets.setAll "outOfBoundsKill", true
  enemyBullets.setAll "checkWorldBounds", true
  #  The hero!
  player = game.add.sprite(400, 500, "ship")
  player.anchor.setTo 0.5, 0.5
  game.physics.enable player, Phaser.Physics.ARCADE
  #  The baddies!
  aliens = game.add.group world, "aliens"
  aliens.enableBody = true
  aliens.physicsBodyType = Phaser.Physics.ARCADE
  createAliens()
  style = align: "center", fill: "white", font: "24px monospace"
  #  The score
  scoreString = "Score: "
  scoreText = game.add.text(10, 10, scoreString + score, style)
  scoreText.name = "scoreText"
  #  Lives
  lives = game.add.group world, "lives"
  livesText = game.add.text game.world.width - 100, 10, "Lives", style
  livesText.name = "livesText"
  #  Text
  stateText = game.add.text(game.world.centerX, game.world.centerY, " ", style)
  stateText.name = "stateText"
  stateText.anchor.setTo 0.5, 0.5
  stateText.visible = false
  i = 0
  while i < 3
    ship = lives.create(game.world.width - 100 + 30 * i, 60, "ship")
    ship.anchor.setTo 0.5, 0.5
    ship.angle = 90
    ship.alpha = 0.5
    i++
  #  An explosion pool
  explosions = game.add.group world, "explosions"
  explosions.createMultiple 10, "kaboom"
  explosions.setAll "blendMode", ADD
  explosions.forEach setupInvader, this
  #  Caption
  caption = game.stage.addChild game.make.text 0, 0,
    "Phaser v#{Phaser.VERSION}
    Plugin v#{Phaser.Plugin.SceneGraph.VERSION}", {
      fill: "white"
      font: "12px monospace"
    }
  caption.alignIn game.camera.view, Phaser.BOTTOM_LEFT, -5, -5
  #  And some controls to play the game with
  cursors = game.input.keyboard.createCursorKeys()
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  return

createAliens = ->
  y = 0
  while y < 4
    x = 0
    while x < 10
      alien = aliens.create(x * 48, y * 50, "invader")
      alien.anchor.setTo 0.5, 0.5
      alien.animations.add "fly", [0, 1, 2, 3], 20, true
      alien.play "fly"
      alien.body.moves = false
      x++
    y++
  aliens.x = 100
  aliens.y = 50
  #  All this does is basically start the invaders moving. Notice we"re moving the Group they belong to, rather than the invaders directly.
  tween = game.add.tween(aliens).to({ x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true)
  #  When the tween loops it calls descend
  tween.onLoop.add descend, this
  return

setupInvader = (invader) ->
  invader.anchor.x = 0.5
  invader.anchor.y = 0.5
  invader.animations.add "kaboom"
  return

descend = ->
  aliens.y += 10
  return

update = ->
  #  Scroll the background
  starfield.tilePosition.y += 1
  if player.alive
    #  Reset the player, then check for movement keys
    player.body.velocity.setTo 0, 0
    if cursors.left.isDown
      player.body.velocity.x = -200
    else if cursors.right.isDown
      player.body.velocity.x = 200
    #  Firing?
    if fireButton.isDown
      fireBullet()
    if game.time.now > firingTimer
      enemyFires()
    #  Run collision
    game.physics.arcade.overlap bullets, aliens, collisionHandler, null, this
    game.physics.arcade.overlap enemyBullets, player, enemyHitsPlayer, null, this
  return

render = ->
  {debug} = game
  x = debug.bounds.left
  y = debug.bounds.top
  lineHeight = 25
  debug.text "game.debug.renderGraph()", x, y += lineHeight, "white", debug.font
  debug.text "------------------------", x, y += lineHeight, "white", debug.font
  debug.renderGraph game.world,          x, y += lineHeight, debug.font, 25
  y = 375
  game.sceneGraphPlugin.renderColors     x, y              , debug.font, 25
  return

collisionHandler = (bullet, alien) ->
  #  When a bullet hits an alien we kill them both
  bullet.kill()
  alien.kill()
  #  Increase the score
  score += 20
  scoreText.text = scoreString + score
  #  And create an explosion :)
  explosion = explosions.getFirstExists(false)
  explosion.reset alien.body.x, alien.body.y
  explosion.play "kaboom", 30, false, true
  if aliens.countLiving() == 0
    score += 1000
    scoreText.text = scoreString + score
    enemyBullets.callAll "kill", this
    stateText.text = "VICTORY\n\n[restart]"
    stateText.visible = true
    #the "click to restart" handler
    game.input.onTap.addOnce restart, this
  return

enemyHitsPlayer = (_player, bullet) ->
  bullet.kill()
  live = lives.getFirstAlive()
  if live
    live.kill()
  #  And create an explosion :)
  explosion = explosions.getFirstExists(false)
  explosion.reset _player.body.x, _player.body.y
  explosion.play "kaboom", 30, false, true
  # When the player dies
  if lives.countLiving() < 1
    _player.kill()
    enemyBullets.callAll "kill"
    stateText.text = "GAME OVER\n\n[restart]"
    stateText.visible = true
    #the "click to restart" handler
    game.input.onTap.addOnce restart, this
  return

enemyFires = ->
  #  Grab the first bullet we can from the pool
  enemyBullet = enemyBullets.getFirstExists(false)
  livingEnemies.length = 0
  aliens.forEachAlive (alien) ->
    # put every living enemy in an array
    livingEnemies.push alien
    return
  if enemyBullet and livingEnemies.length > 0
    random = game.rnd.integerInRange(0, livingEnemies.length - 1)
    # randomly select one of them
    shooter = livingEnemies[random]
    # And fire the bullet from this enemy
    enemyBullet.reset shooter.body.x, shooter.body.y
    game.physics.arcade.moveToObject enemyBullet, player, 120
    firingTimer = game.time.now + 2000
  return

fireBullet = ->
  #  To avoid them being allowed to fire too fast we set a time limit
  if game.time.now > bulletTime
    #  Grab the first bullet we can from the pool
    bullet = bullets.getFirstExists(false)
    if bullet
      #  And fire it
      bullet.reset player.x, player.y + 8
      bullet.body.velocity.y = -400
      bulletTime = game.time.now + 200
  return

restart = ->
  # A new level starts
  # resets the life count
  lives.callAll "revive"
  # and brings the aliens back from the dead :)
  aliens.removeAll()
  createAliens()
  # revives the player
  player.revive()
  # hides the text
  stateText.visible = false
  return

game = new (Phaser.Game)(1200, 600, Phaser.CANVAS, "phaser-example",
  init: init
  preload: preload
  create: create
  update: update
  render: render)
