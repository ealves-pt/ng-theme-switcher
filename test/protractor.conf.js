exports.config = {
  framework: 'jasmine2',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: './e2e/**/*.spec.js',

  baseUrl: 'http://localhost:9000/',

  multiCapabilities: [
    {
      'browserName': 'phantomjs',
      'phantomjs.binary.path': require('phantomjs').path,
      // 'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG'] // See https://github.com/detro/ghostdriver#faq
    },
    {
      'browserName': 'chrome'
    }
  ]
};
