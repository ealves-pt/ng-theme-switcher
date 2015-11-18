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
