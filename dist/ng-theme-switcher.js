(function() {
  angular.module('ngThemeSwitcher', [])

  .directive('ngThemeSwitcher', ['themeSwitcher', function(themeSwitcher) {
    'use strict';

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
  angular.module('ngThemeSwitcher')

  .provider('themeSwitcher', function() {
    'use strict';

    var _asyncLoad = true;
    var _activeTheme;
    var _themes = [];
    var _watchers = [];

    var isAsyncLoad = function() {
      return _asyncLoad;
    };

    var getActiveThemeName = function() {
      return _activeTheme;
    }

    var getThemes = function() {
      return _themes;
    };

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
        var exists = false;

        angular.forEach(_themes, function(theme) {
          if (theme.name === themeName) {
            exists = true;
          }
        });

        if (exists) {
          _activeTheme = themeName;
          notifyWatchers();
        } else {
          throw new Error("'changeToTheme' can only change to an existing theme");
        }
      }
    };

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

    this.$get = [function() {
      return {
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
