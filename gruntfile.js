module.exports = function(grunt) {
  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt);

  var dirs = {
    src: './src',
    dist: './dist'
  };

  grunt.initConfig({
    clean: {
      default: [dirs.dist + '/*.js', '!' + dirs.dist + '/*.min.js'],
      build: dirs.dist + dirs.dist + '/*.min.js'
    },
    concat: {
      default: {
        options: {
          stripBanners: true
        },
        src: dirs.src + '/**/*.js',
        dest: dirs.dist + '/ng-theme-switcher.js'
      }
    },
    uglify: {
      build: {
        src: dirs.dist + '/ng-theme-switcher.js',
        dest: dirs.dist + '/ng-theme-switcher.min.js'
      }
    }
  });

  grunt.registerTask('build', ['clean', 'concat', 'uglify']);

  grunt.registerTask('default', ['clean:default', 'concat:default']);
};
