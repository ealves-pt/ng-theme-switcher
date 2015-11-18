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
