module.exports =
  files:
    javascripts:
      joinTo:
        'SceneGraph.js': 'app/plugin.coffee',
        'example.js': 'app/example.coffee',
        'example/vendor.js': 'bower_components/phaser/build/phaser.js'
  modules:
    definition: no
    wrapper: no
  npm:
    enabled: no
  overrides:
    production:
      optimize: no
  paths:
    public: 'dist'
  plugins:
    coffeescript:
      bare: no
    version:
      fileRegExp: /\.(js|html)$/
  sourceMaps: no
