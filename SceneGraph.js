
/*
  Scene Graph plugin v0.0.1.3 for Phaser
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

    SceneGraph.version = version = "0.0.1.3";

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

/* jshint ignore:start */
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel=stylesheet]'))
        .filter(function(link) {
          var val = link.getAttribute('data-autoreload');
          return link.href && val != 'false';
        })
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    },

    javascript: function(){
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function(script) { return script.text }).filter(function(text) { return text.length > 0 });
      var srcScripts = scripts.filter(function(script) { return script.src });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function(script) { eval(script); });
        }
      }

      srcScripts
        .forEach(function(script) {
          var src = script.src;
          script.remove();
          var newScript = document.createElement('script');
          newScript.src = cacheBuster(src);
          newScript.async = true;
          newScript.onload = onLoad;
          document.head.appendChild(newScript);
        });
    }
  };
  var port = ar.port || 9486;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */

;(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jade = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

var jade_encode_html_rules = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};
var jade_match_html = /[&<>"]/g;

function jade_encode_char(c) {
  return jade_encode_html_rules[c] || c;
}

exports.escape = jade_escape;
function jade_escape(html){
  var result = String(html).replace(jade_match_html, jade_encode_char);
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

exports.DebugItem = function DebugItem(lineno, filename) {
  this.lineno = lineno;
  this.filename = filename;
}

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
