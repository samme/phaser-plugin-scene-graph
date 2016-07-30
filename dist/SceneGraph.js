
/*
  Scene Graph plugin v0.5.1.1 for Phaser
 */

(function() {
  "use strict";
  var SceneGraph, extend, freeze, seal,
    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  freeze = Object.freeze, seal = Object.seal;

  extend = Phaser.Utils.extend;

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
        if (i) {
          _join.push(i);
        }
      }
      return _join.join(str);
    };

    SceneGraph.config = freeze({
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

    SceneGraph.VERSION = "0.5.1.1";

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
      return join([name, join([key, frame], ".")], " ");
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
      hasLess = total && total < length;
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
      var name, ref, style;
      log("Objects are styled:");
      ref = this.config.css;
      for (name in ref) {
        style = ref[name];
        log("%c" + name, style);
      }
    };

    return SceneGraph;

  })(Phaser.Plugin));

}).call(this);

