'use strict';

// # Globbing
// For performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// Use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

    // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({

    config: config,

    autoprefixer: {
      options: {
        browsers: ['last 1 version', 'ie 8', 'ie 9']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    clean: {
      server: '.tmp'
    },

    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          base: ['.tmp'],
          middleware: function(connect, options) {
            return [
              connect.static(options.base[0]),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*'
      ]
    },

    nunjucks: {
      options: {
        data: grunt.file.readJSON('data.json')
      },
      render: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['{,*/}*.html', '!templates/*'],
          dest: '.tmp',
          ext: '.html'
        }]
      }
    },

    sass: {
      options: {
        loadPath: [
          'bower_components'
        ]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      html: {
        files: ['<%= config.app %>/{,*/}*.html'],
        tasks: ['nunjucks', 'wiredep'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
    },

    wiredep: {
      app: {
        src: ['.tmp/{,*/}*.html']
      }
    }
  });

  grunt.registerTask('serve', [
    'clean:server',
    'nunjucks',
    'wiredep',
    'sass:server',
    'autoprefixer',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', ['serve']);
};
