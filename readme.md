![Screenshot](https://samme.github.io/phaser-plugin-scene-graph/screenshot.png)
# Phaser Scene Graph Plugin 👾

Prints Phaser’s display tree in the console.
[Demo](https://samme.github.io/phaser-plugin-scene-graph/).

    game.plugins.add(Phaser.Plugin.SceneGraph);

    // …

    game.debug.graph() // everything; or

    game.debug.graph(obj)

Name your groups and emitters:

    group.name = "invaders"

    emitter.name = "stars"
