Prints the display tree. [Demo](https://samme.github.io/phaser-plugin-scene-graph/)

Install
-------

If not using `npm` or `bower`, add [SceneGraph.js](dist/SceneGraph.js) after phaser.js.

Use 👾
---

```javascript
game.plugins.add(Phaser.Plugin.SceneGraph);
```

Debug Canvas
------------

![Print on the debug canvas](https://samme.github.io/phaser-plugin-scene-graph/screenshot1.png)

```javascript
game.debug.renderGraph(obj, x, y, font, lineHeight);
```

Console
-------

![Print to the browser console](https://samme.github.io/phaser-plugin-scene-graph/screenshot2.png)

```javascript
game.debug.graph() // everything; or

game.debug.graph(obj) // 1 object & descendants

game.debug.graph(obj, { // options:
    collapse:        true,
    filter:          null, // function (obj) -> true | false
    map:             null, // function (obj) -> "description"
    skipDead:        false,
    skipNonexisting: false
});
```

Configure (optional)
---------

```javascript
game.plugins.add(Phaser.Plugin.SceneGraph, {
  css: {
    dead:          "text-decoration: line-through",
    nonexisting:   "color: gray",
    nonrenderable: "background: rgba(127, 127, 127, 0.125)",
    invisible:     "background: rgba(0, 0, 0, 0.25)"
  },
  quiet: false
});
```

Tips
----

Name your groups and emitters:

```javascript
group.name = "invaders"

emitter.name = "stars"
```

For a quick look at a game in progress, run in the console:

```javascript
(function(game) {
  game.load
    .script(
      "SceneGraph",
      "https://cdn.jsdelivr.net/npm/phaser-plugin-scene-graph@1.1.0/dist/SceneGraph.js",
      function() {
        game.plugins.add(Phaser.Plugin.SceneGraph).graph();
      }
    )
    .start();
})(window.game || Phaser.GAMES[0]);
```
