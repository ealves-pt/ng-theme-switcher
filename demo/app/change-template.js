(function() {
  'use strict';

  angular.module('changeTheme', ['ngThemeSwitcher'])

  .directive('changeTheme', function() {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'changeTemplate.html',
      controllerAs: 'vm',
      controller: ['themeSwitcher', function(themeSwitcher) {
        return {
          setTheme: function(theme) {
            themeSwitcher.changeToTheme(theme);
          }
        };
      }]
    };
  });
})();
