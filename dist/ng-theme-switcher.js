(function() {
  'use strict';

  angular.module('ngThemeSwitcher', ['ngCookies'])

  .run(['themeSwitcher', function(themeSwitcher) {
    themeSwitcher.init();
  }])

  .directive('ngThemeSwitcher', ['themeSwitcher', function(themeSwitcher) {
    return {
      restrict: 'A',
      link: ThemeSwitcherLnk,
      scope: true,
      priority: 9999
    };

    function ThemeSwitcherLnk($scope, element, attributes, controller) {
      var themesLoaded = [];

      var isThemeLoaded = function(theme) {
        if (typeof theme !== 'string') {
          throw new Error("'isThemeLoaded' expects a string as an argument");
        }

        return themesLoaded.indexOf(theme) !== -1;
      };

      var createMeta = function() {
        var themeName = themeSwitcher.getActiveThemeName();
        if (themeName) {
          return '<meta http-equiv="Default-Style" content="' + themeName + '" />';
        }
      }

      var createLink = function(title, href, enabled) {
        enabled = enabled || false;
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'alternate stylesheet';
        link.title = title;
        link.href = href;
        link.disabled = !enabled;

        return link;
      }

      var loadStylesheets = function(title, hrefs, enabled) {
        if (typeof title !== 'string') {
          throw new Error("'load' expects 'title' to be a string");
        }
        if (typeof hrefs !== 'string' && typeof hrefs !== 'object' && !Array.isArray(hrefs)) {
          throw new Error("'load' expects 'hrefs' to be a string or array");
        }
        if (typeof enabled !== 'boolean') {
          throw new Error("'load' expects 'enabled' to be a boolean");
        }

        if (!isThemeLoaded(title)) {
          if (typeof hrefs === 'string') {
            element.append(createLink(title, hrefs, enabled));
          } else {
            angular.forEach(hrefs, function(href) {
              loadStylesheets(title, href, enabled);
            });
          }
        }
      };

      var loadTheme = function(theme, enabled) {
        loadStylesheets(theme.name, theme.href, enabled);
        themesLoaded.push(theme.name);
      }

      var init = function() {
        // Create the meta element with the default style name
        var meta = createMeta();
        if (meta) {
          element.append(meta);
        } else {
          throw new Error("A default style name must be specified.");
        }

        var themes = themeSwitcher.getThemes();
        var activeThemeName = themeSwitcher.getActiveThemeName();

        // NOTE: this will load all the stylesheets passed for each theme name
        if (!themeSwitcher.isAsyncLoad()) {
          // Load all themes if async load is disabled
          angular.forEach(themes, function(theme) {
            loadTheme(theme, (theme.name === activeThemeName));
          });
        } else {
          // Load only the stylesheets for the default theme
          angular.forEach(themes, function(theme) {
            if (theme.name === activeThemeName) {
              loadTheme(theme, true);
            }
          });
        }
      };

      var switchToTheme = function(theme) {
        // The theme is loaded as disabled
        loadTheme(theme, false);

        // Now we enable the active theme and disable all the other ones
        var linkTag = document.getElementsByTagName("link");
        for (var i = 0, l = linkTag.length; i < l; i++) {
          if ((linkTag[i].rel.indexOf( "stylesheet" ) != -1) && linkTag[i].title) {
            if (linkTag[i].title == theme.name) {
              linkTag[i].disabled = false ;
            } else {
              linkTag[i].disabled = true ;
            }
          }
        }
      };

      if (element[0].nodeName === 'HEAD') {
        init();
        themeSwitcher.addWatcher(function(theme) {
          switchToTheme(theme);
        });
      } else {
        throw new Error("'ng-theme-switcher' must be appended to the HEAD");
      }
    }
  }]);
})();

(function() {
  'use strict';

  angular.module('ngThemeSwitcher')

  .provider('themeSwitcherCookies', function() {
    var _cookieDuration = new Date((new Date()).getTime() + 1*24*60*60*1000);
    var _cookieKey = 'ngThemeSwitcher';

    this.setCookieDuration = function(cookieDuration) {
      if (typeof cookieDuration !== 'number') {
        throw new Error('\'setCookieDuration\' expects argument to be a number');
      }

      _cookieDuration = new Date((new Date()).getTime() + cookieDuration);
    };

    this.setCookieKey = function(cookieKey) {
      if (typeof cookieKey !== 'string') {
        throw new Error('\'setCookieKey\' expects argument to be a string');
      }

      _cookieKey = cookieKey;
    }

    this.$get = ['$cookies', function($cookies) {
      var setCookie = function(value) {
        if (typeof value !== 'string') {
          throw new Error('\'setCookie\' expects argument to be a string');
        }

        $cookies.put(_cookieKey, value);
      };

      var getCookie = function() {
        return $cookies.get(_cookieKey);
      };

      var clear = function() {
        $cookies.remove(_cookieKey);
      };

      return {
        setCookie: setCookie,
        getCookie: getCookie,
        clear: clear
      };
    }];
  });
})();

(function() {
  'use strict';

  angular.module('ngThemeSwitcher')

  .provider('themeSwitcher', function() {
    var _allowUndefinedDefaultTheme = false;
    var _asyncLoad = true;
    var _activeTheme;
    var _themes = [];

    // NOTE should only be used for testing purposes
    this.allowUndefinedDefaultTheme = function() {
      _allowUndefinedDefaultTheme = true;
    }

    this.disableAsyncLoad = function() {
      _asyncLoad = !_asyncLoad;
    };

    this.setDefaultTheme = function(theme) {
      if (typeof theme !== 'string') {
        throw new Error("'setDefaultTheme' expects a string as an argument");
      }
      _activeTheme = theme;
    };

    this.setThemes = function(themes) {
      _themes = themes;
    };

    var themeExists = function(themeName) {
      for (var i = 0, l = _themes.length; i < l; i++) {
        if (_themes[i].name === themeName) {
          return true;
        }
      }

      return false;
    }

    this.$get = ['themeSwitcherCookies', function(themeSwitcherCookies) {
      var initialized = false;
      var _watchers = [];

      var init = function() {
        if (!_activeTheme && !_allowUndefinedDefaultTheme) {
          throw new Error("A default style name must be specified.");
        }

        if (!initialized) {
          initialized = !initialized;
          var storedTheme = themeSwitcherCookies.getCookie();

          if (storedTheme && themeExists(storedTheme)) {
            _activeTheme = (storedTheme !== _activeTheme) ? storedTheme : _activeTheme;
          } else if (!_allowUndefinedDefaultTheme) {
            themeSwitcherCookies.setCookie(_activeTheme);
          }
        }
      }

      var isAsyncLoad = function() {
        return _asyncLoad;
      };

      var getThemes = function() {
        return _themes;
      };

      var getActiveThemeName = function() {
        return _activeTheme;
      }

      var getActiveTheme = function() {
        for (var i = 0, l = _themes.length; i < l; i++) {
         if (_activeTheme === _themes[i].name) {
           return _themes[i];
         }
        }
      };

      var addWatcher = function(watcher) {
        if (typeof watcher !== 'function') {
          throw new Error("'addWatcher' expects a function as an argument");
        }

        _watchers.push(watcher);
      };

      var notifyWatchers = function() {
        var theme = getActiveTheme();
        angular.forEach(_watchers, function(watcher) {
          watcher(theme);
        });
      };

      var changeToTheme = function(themeName) {
        if (typeof themeName !== 'string') {
          throw new Error("'changeToTheme' expects a string as an argument");
        }

        if (themeName !== _activeTheme) {
          if (themeExists(themeName)) {
            _activeTheme = themeName;
            themeSwitcherCookies.setCookie(_activeTheme);
            notifyWatchers();
          } else {
            throw new Error("'changeToTheme' can only change to an existing theme");
          }
        }
      };

      return {
        init: init,
        isAsyncLoad: isAsyncLoad,
        addWatcher: addWatcher,
        changeToTheme: changeToTheme,
        getActiveTheme: getActiveTheme,
        getActiveThemeName: getActiveThemeName,
        getThemes: getThemes
      };
    }];
  });
})();
