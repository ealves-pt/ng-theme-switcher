module.exports = function(config) {
  config.set({
    basePath: '../',

    files: [
      // Include relevant angular files and libs
      './bower_components/angular/angular.js',
      './bower_components/angular-mocks/angular-mocks.js',
      './bower_components/angular-cookies/angular-cookies.js',

      // Include js src files
      './src/ThemeSwitcherDirective.js',
      './src/services/*.js',

      // Include unit test specs
      './test/unit/**/*.spec.js'
    ],

    autoWatch: false,

    frameworks: ['jasmine'],

    browsers: ['Chrome', 'PhantomJS'],

    reporters: ['progress'],

    preprocessors: {},

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ]
  });
};
