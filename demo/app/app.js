(function() {
  angular

  .module('app', ['ngThemeSwitcher', 'changeTheme'])

  .config(['themeSwitcherProvider', function(themeSwitcherProvider) {
    themeSwitcherProvider.setDefaultTheme('live');
  }]);
})();
