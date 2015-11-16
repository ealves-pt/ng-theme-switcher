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
