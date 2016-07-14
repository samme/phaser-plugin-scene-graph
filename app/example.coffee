###
  http://phaser.io/examples/v2/games/tanks

  Plugin v{!major!}.{!minor!}.{!maintenance!}.{!build!}
###

land = undefined
shadow = undefined
tank = undefined
turret = undefined
enemies = undefined
enemyBullets = undefined
enemiesTotal = 0
enemiesAlive = 0
explosions = undefined
logo = undefined
currentSpeed = 0
cursors = undefined
bullets = undefined
fireRate = 500
nextFire = 0

init = ->
  game.plugins.add Phaser.Plugin.SceneGraph
  return

preload = ->
  game.load.baseURL = 'tanks/'
  game.load.atlas 'tank', 'tanks.png', 'tanks.json'
  game.load.atlas 'enemy', 'enemy-tanks.png', 'tanks.json'
  game.load.image 'logo', 'logo.png'
  game.load.image 'bullet', 'bullet.png'
  game.load.image 'earth', 'scorched_earth.png'
  game.load.spritesheet 'kaboom', 'explosion.png', 64, 64, 23
  return

create = ->
  {world} = game
  #  Our tiled scrolling background
  land = game.add.tileSprite(0, 0, world.width, world.height, 'earth')
  land.fixedToCamera = true
  #  The base of our tank
  tank = game.add.sprite(0, 0, 'tank', 'tank1')
  tank.anchor.setTo 0.5, 0.5
  tank.animations.add 'move', [
    'tank1'
    'tank2'
    'tank3'
    'tank4'
    'tank5'
    'tank6'
  ], 20, true
  #  This will force it to decelerate and limit its speed
  game.physics.enable tank, Phaser.Physics.ARCADE
  tank.body.drag.set 0.5
  tank.body.maxVelocity.setTo 100, 100
  tank.body.collideWorldBounds = true
  #  Finally the turret that we place on-top of the tank body
  turret = game.add.sprite(0, 0, 'tank', 'turret')
  turret.anchor.setTo 0.3, 0.5
  #  The enemies bullet group
  enemyBullets = game.add.group(game.world, 'enemyBullets')
  enemyBullets.enableBody = true
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE
  enemyBullets.createMultiple 30, 'bullet'
  enemyBullets.setAll 'anchor.x', 0.5
  enemyBullets.setAll 'anchor.y', 0.5
  enemyBullets.setAll 'outOfBoundsKill', true
  enemyBullets.setAll 'checkWorldBounds', true
  #  Create some baddies to waste :)
  enemies = []
  enemiesAlive = enemiesTotal = 3
  for i in [1..enemiesTotal]
    enemies.push new EnemyTank(i, game, tank, enemyBullets)
    i++
  #  A shadow below our tank
  shadow = game.add.sprite(0, 0, 'tank', 'shadow')
  shadow.anchor.setTo 0.5, 0.5
  #  Our bullet group
  bullets = game.add.group(game.world, 'bullets')
  bullets.enableBody = true
  bullets.physicsBodyType = Phaser.Physics.ARCADE
  bullets.createMultiple 10, 'bullet', 0, false
  bullets.setAll 'anchor.x', 0.5
  bullets.setAll 'anchor.y', 0.5
  bullets.setAll 'outOfBoundsKill', true
  bullets.setAll 'checkWorldBounds', true
  #  Explosion pool
  explosions = game.add.group(game.world, 'explosions')
  i = 0
  while i < 10
    explosionAnimation = explosions.create(0, 0, 'kaboom', [ 0 ], false)
    explosionAnimation.alpha = 0.75
    explosionAnimation.anchor.setTo 0.5, 0.5
    explosionAnimation.animations.add 'kaboom'
    i++
  tank.bringToTop()
  turret.bringToTop()
  logo = game.add.sprite(0, 200, 'logo')
  logo.fixedToCamera = true
  game.input.onDown.add removeLogo, this
  game.camera.follow tank
  game.camera.deadzone = new (Phaser.Rectangle)(150, 150, 500, 300)
  game.camera.focusOnXY 0, 0
  cursors = game.input.keyboard.createCursorKeys()
  game.debug.graph()
  return

removeLogo = ->
  game.input.onDown.remove removeLogo, this
  logo.kill()
  return

update = ->
  game.physics.arcade.overlap enemyBullets, tank, bulletHitPlayer, null, this
  enemiesAlive = 0
  for enemy in enemies when enemy.alive
    enemiesAlive++
    game.physics.arcade.collide tank, enemy.tank
    game.physics.arcade.overlap bullets, enemy.tank, bulletHitEnemy, null, this
    enemy.update()

  if      cursors.left.isDown  then tank.angle -= 3
  else if cursors.right.isDown then tank.angle += 3

  if      cursors.up.isDown    then currentSpeed = 300
  else if currentSpeed > 0     then currentSpeed -= 4

  if currentSpeed > 0
    game.physics.arcade.velocityFromRotation tank.rotation, currentSpeed, tank.body.velocity

  land.tilePosition.x = -game.camera.x
  land.tilePosition.y = -game.camera.y

  #  Position all the parts and align rotations
  shadow.x = tank.x
  shadow.y = tank.y
  shadow.rotation = tank.rotation

  turret.x = tank.x
  turret.y = tank.y
  turret.rotation = game.physics.arcade.angleToPointer(turret)

  if game.input.activePointer.isDown
    fire() # Boom!
  return

bulletHitPlayer = (tank, bullet) ->
  bullet.kill()
  return

bulletHitEnemy = (tank, bullet) ->
  bullet.kill()
  destroyed = tank._parent.damage()
  size = if destroyed then 2 else 1
  explosionAnimation = explosions.getFirstExists(false)
  explosionAnimation.reset tank.x, tank.y
  explosionAnimation.scale.setTo game.rnd.realInRange(0.5 * size, 1.5 * size)
  explosionAnimation.play 'kaboom', 30, false, true
  return

fire = ->
  if game.time.now > nextFire and bullets.countDead() > 0
    nextFire = game.time.now + fireRate
    bullet = bullets.getFirstExists(false)
    bullet.reset turret.x, turret.y
    bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500)
  return

render = ->
  # game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
  game.debug.text 'Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32
  return

EnemyTank = (index, game, player, bullets) ->
  x = game.world.randomX
  y = game.world.randomY
  @game = game
  @health = 3
  @player = player
  @bullets = bullets
  @fireRate = 1000
  @nextFire = 0
  @alive = true
  @name = "enemyTank#{index}"
  @shadow = game.add.sprite(x, y, 'enemy', 'shadow')
  @tank = game.add.sprite(x, y, 'enemy', 'tank1')
  @turret = game.add.sprite(x, y, 'enemy', 'turret')
  @shadow.anchor.set 0.5
  @tank.anchor.set 0.5
  @turret.anchor.set 0.3, 0.5
  @tank.name = "tank#{index}"
  @tank._parent = this
  game.physics.enable @tank, Phaser.Physics.ARCADE
  @tank.body.immovable = false
  @tank.body.collideWorldBounds = true
  @tank.body.bounce.setTo 1, 1
  @tank.angle = game.rnd.angle()
  game.physics.arcade.velocityFromRotation @tank.rotation, 100, @tank.body.velocity
  return

EnemyTank::damage = ->
  @health -= 1
  if @health <= 0
    @alive = false
    @shadow.kill()
    @tank.kill()
    @turret.kill()
    return true
  false

EnemyTank::update = ->
  @shadow.x = @tank.x
  @shadow.y = @tank.y
  @shadow.rotation = @tank.rotation
  @turret.x = @tank.x
  @turret.y = @tank.y
  @turret.rotation = @game.physics.arcade.angleBetween(@tank, @player)
  if @game.physics.arcade.distanceBetween(@tank, @player) < 300
    if @game.time.now > @nextFire and @bullets.countDead() > 0
      @nextFire = @game.time.now + @fireRate
      bullet = @bullets.getFirstDead()
      bullet.reset @turret.x, @turret.y
      bullet.rotation = @game.physics.arcade.moveToObject(bullet, @player, 500)
  return

@game = game = new (Phaser.Game)(800, 800, Phaser.AUTO, 'phaser-example',
  init:    init
  preload: preload
  create: create
  update: update
  render: render)
