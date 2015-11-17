module.exports = function(grunt) {
  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt);

  var dirs = {
    src: './src',
    demo: './demo',
    dist: './dist',
    test: './test'
  };

  grunt.initConfig({
    // https://www.npmjs.com/package/grunt-bower-task
    bower: {
      options: {
        targetDir: dirs.demo + '/lib',
        cleanTargetDir: true,
        layout: 'byComponent'
      },
      install: {}
    },

    // https://www.npmjs.com/package/grunt-contrib-clean
    clean: {
      build: dirs.dist + dirs.dist + '/*.min.js'
    },

    // https://www.npmjs.com/package/grunt-contrib-copy
    copy: {
      demo: {
        expand: true,
        cwd: dirs.src,
        src: '**/*.js',
        dest: dirs.demo + '/src'
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-concat
    concat: {
      build: {
        options: {
          stripBanners: true
        },
        src: dirs.src + '/**/*.js',
        dest: dirs.dist + '/ng-theme-switcher.js'
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-uglify
    uglify: {
      build: {
        src: dirs.dist + '/ng-theme-switcher.js',
        dest: dirs.dist + '/ng-theme-switcher.min.js'
      }
    },

    // https://www.npmjs.com/package/grunt-karma
    karma: {
      options: {
        configFile: './test/karma.conf.js',
        port: 9999
      },
      test: {
        singleRun: true
      },
      continuous: {
        background: true
      }
    },

    // https://www.npmjs.com/package/grunt-protractor
    protractor: {
      options: {
        configFile: './test/protractor.conf.js'
      },
      test: {
        keepAlive: false
      },
      continuous: {
        keepAlive: true
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-watch
    watch: {
      options: {
        livereload: true
      },
      karma: {
        files: [dirs.src + '/**/*.js', dirs.test + '/unit/**/*.spec.js'],
        tasks: ['karma:continuous:run']
      },
      protractor: {
        files: [dirs.src + '/**/*.js', dirs.test + '/e2e/**/*.spec.js'],
        tasks: ['protractor:continuous']
      }
    },

    // https://www.npmjs.com/package/grunt-run
    run: {
      mock_server: {
        options: {
          wait: false
        },
        args:[]
      }
    },

    // https://www.npmjs.com/package/grunt-connect
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          livereload: 35729,
          open: true,
          base: './demo'
        }
      },
      test: {
        options: {
          base: './demo'
        }
      }
    }
  });

  // Prepare the demo to be served
  grunt.registerTask('prepare', ['bower:install', 'copy:demo']);

  // Serve the files with livereload and keep karma running during development
  grunt.registerTask('serve', ['prepare', 'karma:continuous:start', 'run:mock_server', 'connect:livereload', 'watch:karma']);

  // Run unit tests continuously
  grunt.registerTask('unit-test', ['bower:install', 'karma:continuous:start', 'watch:karma']);

  // Run e2e tests continuously
  grunt.registerTask('e2e-test', ['prepare', 'connect:test', 'protractor:continuous', 'watch:protractor']);

  // Run all the tests once
  grunt.registerTask('test', ['prepare', 'karma:test:start', 'connect:test', 'run:mock_server', 'protractor:test']);

  // Build the code
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);
};
