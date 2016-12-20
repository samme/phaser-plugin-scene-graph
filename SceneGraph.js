
/*
  Scene Graph plugin 0.7.0 (3) for Phaser
 */

(function() {
  "use strict";
  var PIXI, Phaser, SceneGraph, extend, freeze, ref, seal,
    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  freeze = Object.freeze, seal = Object.seal;

  ref = this, Phaser = ref.Phaser, PIXI = ref.PIXI;

  extend = Phaser.Utils.extend;

  Phaser.BitmapData.prototype.toString = function() {
    return "[Phaser.BitmapData]";
  };

  Phaser.RenderTexture.prototype.toString = function() {
    return "[Phaser.RenderTexture]";
  };

  Phaser.Video.prototype.toString = function() {
    return "[Phaser.Video]";
  };

  PIXI.Texture.prototype.toString = function() {
    return "[PIXI.Texture]";
  };

  Phaser.Plugin.SceneGraph = freeze(SceneGraph = (function(superClass) {
    var _join, getKey, getName, group, groupCollapsed, groupEnd, join, log, none, types;

    extend1(SceneGraph, superClass);

    function SceneGraph() {
      return SceneGraph.__super__.constructor.apply(this, arguments);
    }

    group = console.group, groupCollapsed = console.groupCollapsed, groupEnd = console.groupEnd, log = console.log;

    none = function() {};

    log = log.bind(console);

    group = group ? group.bind(console) : log;

    groupEnd = group ? groupEnd.bind(console) : none;

    groupCollapsed = groupCollapsed ? groupCollapsed.bind(console) : group;

    _join = [];

    join = function(arr, str) {
      var i, j, len;
      _join.length = 0;
      for (j = 0, len = arr.length; j < len; j++) {
        i = arr[j];
        if ((i != null) && i !== '') {
          _join.push(i);
        }
      }
      return _join.join(str);
    };

    SceneGraph.config = freeze({
      colors: freeze({
        nonexisting: "#808080",
        invisible: "#b0b0b0",
        empty: "#d381c3",
        allExist: "#a1c659",
        someExist: "#fda331",
        noneExist: "#fc6d24",
        nonrenderable: "#505050",
        dead: "#fb0120"
      }),
      css: freeze({
        dead: "text-decoration: line-through",
        nonexisting: "color: gray",
        nonrenderable: "background: rgba(127, 127, 127, 0.125)",
        invisible: "background: rgba(0, 0, 0, 0.25)"
      }),
      quiet: false
    });

    SceneGraph.types = types = {
      0: "SPRITE",
      1: "BUTTON",
      2: "IMAGE",
      3: "GRAPHICS",
      4: "TEXT",
      5: "TILESPRITE",
      6: "BITMAPTEXT",
      7: "GROUP",
      8: "RENDERTEXTURE",
      9: "TILEMAP",
      10: "TILEMAPLAYER",
      11: "EMITTER",
      12: "POLYGON",
      13: "BITMAPDATA",
      14: "CANVAS_FILTER",
      15: "WEBGL_FILTER",
      16: "ELLIPSE",
      17: "SPRITEBATCH",
      18: "RETROFONT",
      19: "POINTER",
      20: "ROPE",
      21: "CIRCLE",
      22: "RECTANGLE",
      23: "LINE",
      24: "MATRIX",
      25: "POINT",
      26: "ROUNDEDRECTANGLE",
      27: "CREATURE",
      28: "VIDEO"
    };

    SceneGraph.VERSION = "0.7.0 (3)";

    SceneGraph.addTo = function(game) {
      return game.plugins.add(this);
    };

    SceneGraph.prototype.name = "Scene Graph Plugin";

    SceneGraph.prototype.init = function(settings) {
      this.config = extend(true, {}, this.constructor.config);
      seal(this.config);
      if (settings) {
        extend(true, this.config, settings);
      }
      if (!this.config.quiet) {
        log("%s v%s 👾", this.name, this.constructor.VERSION);
        log("Use `game.debug.graph()` or `game.debug.graph(obj)`");
        this.printStyles();
      }
      Phaser.Utils.Debug.prototype.graph = this.graph.bind(this);
      Phaser.Utils.Debug.prototype.renderGraph = this.renderGraph.bind(this);
    };

    SceneGraph.prototype.color = function(obj) {
      var colors, hasTotal, length, total;
      colors = this.config.colors;
      length = obj.length, total = obj.total;
      hasTotal = total != null;
      switch (false) {
        case obj.exists !== false:
          return colors.nonexisting;
        case obj.visible !== false:
          return colors.invisible;
        case length !== 0:
          return colors.empty;
        case !(hasTotal && total === length):
          return colors.allExist;
        case total !== 0:
          return colors.noneExist;
        case !hasTotal:
          return colors.someExist;
        case obj.renderable !== false:
          return colors.nonrenderable;
        case obj.alive !== false:
          return colors.dead;
      }
    };

    SceneGraph.prototype.css = function(obj) {
      var css;
      css = this.config.css;
      return [obj.visible === false ? css.invisible : void 0, obj.exists === false ? css.nonexisting : void 0, obj.renderable === false ? css.nonrenderable : void 0, obj.alive === false ? css.dead : void 0].join(";");
    };

    SceneGraph.prototype.getKey = getKey = function(obj) {
      var key;
      key = obj.key;
      switch (false) {
        case !!key:
          return null;
        case !key.key:
          return getKey(key);
        default:
          return key;
      }
    };

    SceneGraph.prototype.getName = getName = function(obj) {
      var frame, frameName, key, name;
      frame = obj.frame, frameName = obj.frameName, name = obj.name;
      key = getKey(obj);
      return join([name, join([key, frameName, frame], ".")], " ");
    };

    SceneGraph.prototype.graph = function(obj, options) {
      var alive, child, children, collapse, description, exists, filter, hasChildren, j, len, map, method, skipDead, skipNonexisting;
      if (obj == null) {
        obj = this.game.stage;
      }
      if (options == null) {
        options = {
          collapse: true,
          filter: null,
          map: null,
          skipDead: false,
          skipNonexisting: false
        };
      }
      collapse = options.collapse, filter = options.filter, map = options.map, skipDead = options.skipDead, skipNonexisting = options.skipNonexisting;
      alive = obj.alive, children = obj.children, exists = obj.exists;
      if ((skipDead && !alive) || (skipNonexisting && !exists) || (filter && !filter(obj))) {
        return;
      }
      hasChildren = (children != null ? children.length : void 0) > 0;
      method = hasChildren ? (collapse ? groupCollapsed : group) : log;
      description = (map ? map : this.map).call(null, obj, options);
      method("%c" + description, this.css(obj));
      if (hasChildren) {
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          this.graph(child, options);
        }
      }
      if (hasChildren) {
        groupEnd();
      }
    };

    SceneGraph.prototype.map = function(obj) {
      var children, constructor, count, hasLength, hasLess, length, longName, total, type;
      children = obj.children, constructor = obj.constructor, total = obj.total, type = obj.type;
      longName = getName(obj);
      length = (children != null ? children.length : void 0) || 0;
      hasLength = obj.length != null;
      hasLess = (total != null) && total < length;
      type = types[type] || '?';
      count = (function() {
        switch (false) {
          case !hasLess:
            return "(" + total + "/" + length + ")";
          case !hasLength:
            return "(" + length + ")";
          default:
            return "";
        }
      })();
      return ((constructor != null ? constructor.name : void 0) || type) + " " + longName + " " + count;
    };

    SceneGraph.prototype.printStyles = function() {
      var name, ref1, style;
      log("Objects are styled:");
      ref1 = this.config.css;
      for (name in ref1) {
        style = ref1[name];
        log("%c" + name, style);
      }
    };

    SceneGraph.prototype.renderColors = function(x, y, font, lineHeight) {
      var color, debug, name, ref1;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (font == null) {
        font = this.game.debug.font;
      }
      if (lineHeight == null) {
        lineHeight = this.game.debug.lineHeight;
      }
      debug = this.game.debug;
      ref1 = this.config.colors;
      for (name in ref1) {
        color = ref1[name];
        debug.text(name, x, y, color, font);
        y += lineHeight;
      }
    };

    SceneGraph.prototype.renderGraph = function(obj, x, y, font, lineHeight) {
      var child, debug, j, len, ref1;
      if (obj == null) {
        obj = this.game.world;
      }
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (font == null) {
        font = this.game.debug.font;
      }
      if (lineHeight == null) {
        lineHeight = this.game.debug.lineHeight;
      }
      debug = this.game.debug;
      this.renderObj(obj, x, y, font);
      x += lineHeight;
      ref1 = obj.children;
      for (j = 0, len = ref1.length; j < len; j++) {
        child = ref1[j];
        y += lineHeight;
        this.renderObj(child, x, y, font);
      }
    };

    SceneGraph.prototype.renderObj = function(obj, x, y, font) {
      this.game.debug.text(this.map(obj), x, y, this.color(obj), font);
    };

    return SceneGraph;

  })(Phaser.Plugin));

}).call(this);

