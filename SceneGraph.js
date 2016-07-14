
/*
  Scene Graph plugin v0.0.2.4 for Phaser
 */

(function() {
  "use strict";
  var SceneGraph, freeze, seal,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  freeze = Object.freeze, seal = Object.seal;

  Phaser.Plugin.SceneGraph = freeze(SceneGraph = (function(superClass) {
    var getKey, getName, group, groupCollapsed, groupEnd, join, log, none, types, version;

    extend(SceneGraph, superClass);

    function SceneGraph() {
      return SceneGraph.__super__.constructor.apply(this, arguments);
    }

    group = console.group, groupCollapsed = console.groupCollapsed, groupEnd = console.groupEnd, log = console.log;

    none = function() {};

    log = log.bind(console);

    group = group ? group.bind(console) : log;

    groupEnd = group ? groupEnd.bind(console) : none;

    groupCollapsed = groupCollapsed ? groupCollapsed.bind(console) : group;

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

    SceneGraph.version = version = "0.0.2.4";

    SceneGraph.addTo = function(game) {
      return game.plugins.add(this);
    };

    SceneGraph.prototype.config = {
      css: {
        dead: "text-decoration: line-through",
        nonexisting: "color: gray",
        nonrenderable: "background: rgba(255, 255, 255, 0.125)",
        invisible: "background: rgba(0, 0, 0, 0.25)"
      }
    };

    SceneGraph.prototype.name = "Phaser SceneGraph Plugin";

    SceneGraph.prototype.version = version;

    SceneGraph.prototype.init = function() {
      console.log("%s v%s 👾", this.name, version);
      console.log("Use `game.debug.graph()` or `game.debug.graph(obj)`");
      this.printStyles();
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
      return join([name, join([key, frameName || frame], ".")], " ");
    };

    SceneGraph.prototype.graph = function(obj, options) {
      var alive, child, children, collapse, constructor, count, desc, exists, hasChildren, hasLength, hasLess, j, len, length, longName, method, name, skipDead, skipNonExisting, total, type, visible;
      if (obj == null) {
        obj = this.game.stage;
      }
      if (options == null) {
        options = {
          collapse: true,
          showParent: false,
          skipDead: false,
          skipNonexisting: false
        };
      }
      collapse = options.collapse, skipDead = options.skipDead, skipNonExisting = options.skipNonExisting;
      alive = obj.alive, children = obj.children, constructor = obj.constructor, exists = obj.exists, name = obj.name, total = obj.total, type = obj.type, visible = obj.visible;
      longName = getName(obj);
      length = (children != null ? children.length : void 0) || 0;
      hasChildren = length > 0;
      hasLength = obj.length != null;
      hasLess = total && total < length;
      type = types[type] || '?';
      count = hasLength ? (hasLess ? "(" + total + "/" + length + ")" : "(" + length + ")") : "";
      desc = ((constructor != null ? constructor.name : void 0) || type) + " " + longName + " " + count;
      method = hasChildren ? (collapse ? groupCollapsed : group) : log;
      method("%c" + desc, this.css(obj));
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

    SceneGraph.prototype.join = join = function(arr, str) {
      var i;
      return ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = arr.length; j < len; j++) {
          i = arr[j];
          if (i) {
            results.push(i);
          }
        }
        return results;
      })()).join(str);
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

