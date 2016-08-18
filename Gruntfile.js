'use strict';

var paths = {
  js: ['*.js', 'test/**/*.js', '!test/coverage/**', '!bower_components/**', 'packages/**/*.js', '!packages/**/node_modules/**'],
  html: ['packages/**/public/**/views/**', 'packages/**/server/views/**'],
  css: ['!bower_components/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    assets: grunt.file.readJSON('config/assets.json'),
    clean: ['bower_components/build'],
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: paths.html,
        options: {
          livereload: true,
          interval: 500
        }
      },
      css: {
        files: paths.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    uglify: {
      core: {
        options: {
          mangle: false
        },
        files: '<%= assets.core.js %>'
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      src: paths.css
    },
    cssmin: {
      core: {
        files: '<%= assets.core.css %>'
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname,
          debug:true
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
        require: [
          'server.js',
          function() {
            require('meanio/lib/util').preload(__dirname + '/packages/**/server', 'model');
          }
        ]
      },
      src: ['packages/**/server/tests/**/*.js']
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    compress: {
        main: {
            options: {
                mode: 'zip',
                archive: 'backlog.zip'
            },
            files: [
                {
                    expand: true,
                    cwd: '/var/www/html/wp-content/plugins/',
                    src: ['*'],
                    dest: 'public/'
                }
            ]
        }
    },
    'start-selenium-server': {
      dev: {
        options: {
          autostop: true,
          downloadUrl: 'https://selenium-release.storage.googleapis.com/2.53/selenium-server-standalone-2.53.0.jar',
          downloadLocation: '/Users/nicolasrameaux/Documents/sources/temp',
          serverOptions: {},
          systemProperties: {
            'webdriver.chrome.driver':'/Users/nicolasrameaux/Documents/dev/webdriverio-test/chromedriver'

          }
        }
      }
    },
    'stop-selenium-server': {
      dev: {}
    },
    webdriver: {
      test: {
        configFile: './wdio.conf.js'
      }
    },
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-selenium-server');
  grunt.loadNpmTasks('grunt-webdriver');


  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'concurrent']);
  } else {
    grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'concurrent']);
  }

  //Test task.
  //grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'webdriver']);

 grunt.registerTask('e2e', 'run selenium server and e2e test', function() {
    grunt.task.run('start-selenium-server:dev','webdriver', 'stop-selenium-server:dev');
  });

  //packaging task
  grunt.registerTask('mypackaging', ['cssmin', 'uglify','compress']);

};
