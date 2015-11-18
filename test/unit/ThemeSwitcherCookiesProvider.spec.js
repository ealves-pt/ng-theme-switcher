(function() {
  'use strict';

  describe('Test ThemeSwitcherCookiesProvider', function() {
    var themeSwitcherCookies;

    beforeEach(function() {
      angular
        .module('test', ['ngThemeSwitcher']).
        config(['themeSwitcherProvider', function(themeSwitcherProvider) {
          // Required to skip validation done at themeSwitcherProvider.init()
          themeSwitcherProvider.allowUndefinedDefaultTheme();
        }]);
    });

    beforeEach(module('test'));

    beforeEach(inject(function(_themeSwitcherCookies_) {
      themeSwitcherCookies = _themeSwitcherCookies_;
    }));

    describe("when no cookies are stored", function() {
      beforeEach(function() {
        themeSwitcherCookies.clear();
      });
      
      it("it should return undefined cookie", function() {
        expect(themeSwitcherCookies.getCookie()).toBeUndefined();
      });
    });

    describe("when a cookie was previously stored", function() {
      var existingCookieValue = 'live';
      var newCookieValue = 'demo';

      beforeEach(function() {
        themeSwitcherCookies.setCookie(existingCookieValue);
      });

      it("it should detect the stored cookie correctly", function() {
        expect(themeSwitcherCookies.getCookie()).toBe(existingCookieValue);
      });

      it("should detect correctly if we update the cookie value", function() {
        themeSwitcherCookies.setCookie(newCookieValue);
        expect(themeSwitcherCookies.getCookie()).toBe(newCookieValue);
      });

      afterEach(function() {
        themeSwitcherCookies.clear();
      });
    });
  });
})();
