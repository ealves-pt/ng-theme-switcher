# ng-theme-switcher

Theme Switcher for Angular.

## Table of contents

* [Quick start](#quick-start)
* [Development](#development)
  * [Global dependencies](#global-dependencies)
  * [Grunt commands](#grunt-commands)
* [Versioning](#versioning)
* [TODO](#todo)
* [License](#license)

## Quick start

Available options:

* [Download the latest release](https://github.com/ealves-pt/ng-theme-switcher/archive/v0.3.0.zip)
* Clone the repo: ```git clone https://github.com/ealves-pt/ng-theme-switcher.git```
* Install with [Bower](http://bower.io/): ```bower install ng-theme-switcher```

## Development

### Global dependencies

To install everything just run:

```
npm install -g bower grunt-cli karma-cli protractor
npm install
```

### Grunt commands

* Build: ```grunt build```
* Serve files with live reload and Karma: ```grunt serve```
* Run unit tests continuously: ```grunt unit-test```
* Run e2e tests continuously: ```grunt e2e-test```
* Run unit and e2e tests: ```grunt test```

## Versioning

ng-theme-switcher is maintained under the [Semantic Versioning guidelines](http://semver.org/).

## TODO

* Detect that all the stylesheets belonging to a theme have been loaded and only then active them;

## License

Code released under the [MIT License](https://github.com/ealves-pt/ng-theme-switcher/blob/master/LICENSE).
