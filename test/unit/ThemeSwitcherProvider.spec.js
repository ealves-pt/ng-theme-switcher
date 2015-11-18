(function() {
  'use strict';

  describe('Test ThemeSwitcherProvider', function() {

    describe('with default initialization', function() {
      var themeSwitcher;
      var themeSwitcherCookies;
      var defaultTheme = 'live';

      // Setup test app before running tests
      beforeEach(function() {
        angular
          .module('test', ['ngThemeSwitcher'])
          .config(['themeSwitcherProvider', function(themeSwitcherProvider) {
            themeSwitcherProvider.setDefaultTheme(defaultTheme);
          }]);
      });

      beforeEach(module('test'));

      beforeEach(inject(function(_themeSwitcher_, _themeSwitcherCookies_) {
        themeSwitcher = _themeSwitcher_;
        themeSwitcherCookies = _themeSwitcherCookies_;
      }));

      it("it should have the active theme set to default theme and the correct cookie should be set", function() {
        expect(themeSwitcher.getActiveThemeName()).toBe(defaultTheme);
        expect(themeSwitcherCookies.getCookie()).toBe(defaultTheme);
      });

      it("it should load stylesheets asynchronously by default", function() {
        expect(themeSwitcher.isAsyncLoad()).toBeTruthy();
      });

      it("it should not have any themes defined", function() {
        expect(themeSwitcher.getThemes().length).toBe(0);
      });

      afterAll(function() {
        themeSwitcherCookies.clear();
      });
    });

    describe("with two themes declared", function() {
      var themeSwitcher;
      var themeSwitcherCookies;
      var defaultTheme = 'live';
      var themes = [
        {
          name: 'live',
          href: 'app.live.css'
        },
        {
          name: 'demo',
          href: 'app.demo.css'
        }
      ];

      // Setup test app before running tests
      beforeEach(function() {
        angular
          .module('testApp', ['ngThemeSwitcher'])
          .config(['themeSwitcherProvider', function(themeSwitcherProvider) {
            themeSwitcherProvider.setDefaultTheme(defaultTheme);
            themeSwitcherProvider.setThemes(themes);
          }]);
      });

      beforeEach(module('testApp'));

      beforeEach(inject(function(_themeSwitcher_, _themeSwitcherCookies_) {
        themeSwitcher = _themeSwitcher_;
        themeSwitcherCookies = _themeSwitcherCookies_;
      }));

      it("it should load stylesheets asynchronously by default", function() {
        expect(themeSwitcher.isAsyncLoad()).toBeTruthy();
      });

      it("it should have the correct number of themes", function() {
        expect(themeSwitcher.getThemes().length).toBe(themes.length);
      });

      it("it should have the active theme set to default theme, the correct cookie should be set and the correct theme object set", function() {
        expect(themeSwitcher.getActiveThemeName()).toBe(defaultTheme);
        expect(themeSwitcherCookies.getCookie()).toBe(defaultTheme);
        expect(themeSwitcher.getActiveTheme()).toEqual(themes[0]);
      });

      describe("when we change to theme that is not of type string", function() {
        it("it should throw an error and maintain the previous active theme name, cookie and object", function() {
          var previousThemeName = themeSwitcher.getActiveThemeName();
          var previousThemeObject = themes[0];

          expect(function() {
            themeSwitcher.changeToTheme(false);
          }).toThrowError();

          expect(themeSwitcher.getActiveThemeName()).toBe(previousThemeName);
          expect(themeSwitcherCookies.getCookie()).toBe(previousThemeName);
          expect(themeSwitcher.getActiveTheme()).toBe(previousThemeObject);
        });
      });

      describe("when we change to a theme that does not exist in the themes array", function() {
        it("it should throw an error and maintain the previous active theme, cookie and object", function() {
          var previousThemeName = themeSwitcher.getActiveThemeName();
          var previousThemeObject = themes[0];

          expect(function() {
            themeSwitcher.changeToTheme('contest');
          }).toThrowError();

          expect(themeSwitcher.getActiveThemeName()).toBe(previousThemeName);
          expect(themeSwitcherCookies.getCookie()).toBe(previousThemeName);
          expect(themeSwitcher.getActiveTheme()).toBe(previousThemeObject);
        });
      });

      describe("when we change to the 'demo' theme", function() {
        var cb;
        var newThemeName = 'demo';
        var expectedThemeObject = themes[1];

        beforeAll(function() {
          cb = jasmine.createSpy('cb');
          themeSwitcher.addWatcher(cb);
          themeSwitcher.changeToTheme(newThemeName);
        });

        it("it should have a new active theme, correct cookie and the correct theme object set", function() {
          expect(themeSwitcher.getActiveThemeName()).toBe(newThemeName);
          expect(themeSwitcher.getActiveTheme()).toEqual(expectedThemeObject);
          expect(themeSwitcherCookies.getCookie()).toBe(newThemeName);
        });

        it("it should call the registered watcher with the right theme object", function() {
          expect(cb).toHaveBeenCalledWith(expectedThemeObject);
        });
      });
    });
  });
})();
