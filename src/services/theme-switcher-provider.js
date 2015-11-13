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

  var addWatcher = function(watcher) {
    if (typeof watcher !== 'function') {
      throw "'addWatcher' expects a function as an argument";
    }

    _watchers.push(watcher);
  };

  var notifyWatchers = function() {
    angular.forEach(_watchers, function(watcher) {
      watcher();
    });
  };

  var changeToTheme = function(theme) {
    if (typeof theme !== 'string') {
      throw "'changeToTheme' expects a string as an argument";
    }
    if (theme !== _activeTheme) {
      _activeTheme = theme;
      notifyWatchers();
    }
  };

  var getActiveTheme = function() {
    for (var i = 0, l = _themes.length; i < l; i++) {
     if (_activeTheme === _themes[i].name) {
       return _themes[i];
     }
    }
  };

  var getActiveThemeName = function() {
    return _activeTheme;
  }

  var getThemes = function() {
    return _themes;
  };

  this.disableAsyncLoad = function() {
    _asyncLoad = !_asyncLoad;
  };

  this.setDefaultTheme = function(theme) {
    if (typeof theme !== 'string') {
      throw "'setDefaultTheme' expects a string as an argument";
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
