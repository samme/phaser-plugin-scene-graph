###
  Scene Graph plugin v{!major!}.{!minor!}.{!maintenance!}.{!build!} for Phaser
###

"use strict"

{freeze, seal} = Object

Phaser.Plugin.SceneGraph = freeze class SceneGraph extends Phaser.Plugin

  {group, groupCollapsed, groupEnd, log} = console
  none = ->

  log            = log.bind console
  group          = if group          then group.bind(console)          else log
  groupEnd       = if group          then groupEnd.bind(console)       else none
  groupCollapsed = if groupCollapsed then groupCollapsed.bind(console) else group

  @types = types = { 0: "SPRITE", 1: "BUTTON", 2: "IMAGE", 3: "GRAPHICS", 4: "TEXT", 5: "TILESPRITE", 6: "BITMAPTEXT", 7: "GROUP", 8: "RENDERTEXTURE", 9: "TILEMAP", 10: "TILEMAPLAYER", 11: "EMITTER", 12: "POLYGON", 13: "BITMAPDATA", 14: "CANVAS_FILTER", 15: "WEBGL_FILTER", 16: "ELLIPSE", 17: "SPRITEBATCH", 18: "RETROFONT", 19: "POINTER", 20: "ROPE", 21: "CIRCLE", 22: "RECTANGLE", 23: "LINE", 24: "MATRIX", 25: "POINT", 26: "ROUNDEDRECTANGLE", 27: "CREATURE", 28: "VIDEO"}

  @version = version = "{!major!}.{!minor!}.{!maintenance!}.{!build!}"

  @addTo = (game) ->
    game.plugins.add this

  config:
    css:
      dead:          "text-decoration: line-through"
      nonexisting:   "color: gray"
      nonrenderable: "background: rgba(255, 255, 255, 0.125)"
      invisible:     "background: rgba(0, 0, 0, 0.25)"

  name: "Phaser SceneGraph Plugin"
  version: version

  # Hooks

  init: ->
    console.log "%s v%s 👾", @name, version
    console.log "Use `game.debug.graph()` or `game.debug.graph(obj)`"
    @printStyles()
    Phaser.Utils.Debug::graph = @graph.bind this
    return

  # Helpers

  css: (obj) ->
    {css} = @config
    [
       css.invisible     if obj.visible    is false
       css.nonexisting   if obj.exists     is false
       css.nonrenderable if obj.renderable is false
       css.dead          if obj.alive      is false
    ].join ";"

  getKey: getKey = (obj) ->
    {key} = obj
    switch
      when !key    then null
      when key.key then getKey key
      else key

  getName: getName = (obj) ->
    {frame, frameName, name} = obj
    key = getKey obj
    join [name, join [key, frameName or frame], "."], " "

  graph: (obj = @game.stage, options = {
    collapse:        yes
    showParent:      no  # TODO
    skipDead:        no,
    skipNonexisting: no
  }) ->
    {collapse, skipDead, skipNonExisting} = options
    {alive, children, constructor, exists, name, total, type, visible} = obj
    longName = getName obj

    length      = children?.length or 0
    hasChildren = length > 0
    hasLength   = obj.length?
    hasLess     = total and total < length
    type        = types[type] or '?'
    count       = if hasLength then (if hasLess then "(#{total}/#{length})" else
                                                     "(#{length})")         else
                                                     ""
    desc        = "#{constructor?.name or type} #{longName} #{count}"
    method      = if hasChildren then (if collapse then groupCollapsed else group) else log

    method "%c#{desc}", @css obj
    @graph child, options for child in children if hasChildren
    groupEnd() if hasChildren
    return

  join: join = (arr, str) ->
    (i for i in arr when i).join str

  printStyles: ->
    log "Objects are styled:"
    for name, style of @config.css
      log "%c#{name}", style
    return
