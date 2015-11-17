(function() {
  describe('Test ng-theme-switcher-provider', function() {

    describe('with default initialization', function() {
      var themeSwitcher;

      // Setup test app before running tests
      beforeEach(function() {
        angular
          .module('testApp', ['ngThemeSwitcher'])
          .config(['themeSwitcherProvider', function(themeSwitcherProvider) {
            themeSwitcherProvider.setDefaultTheme('live');
          }]);
      });

      beforeEach(module('testApp'));

      beforeEach(inject(function(_themeSwitcher_) {
        themeSwitcher = _themeSwitcher_;
      }));

      it("should have the active theme set to 'live'", function() {
        expect(themeSwitcher.getActiveThemeName()).toBe('live');
      });

      it("should load stylesheets asynchronously by default", function() {
        expect(themeSwitcher.isAsyncLoad()).toBeTruthy();
      });

      it("should not have any themes defined", function() {
        expect(themeSwitcher.getThemes().length).toBe(0);
      });
    });

    describe("with two themes declared", function() {
      var themeSwitcher;
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
            themeSwitcherProvider.setDefaultTheme('live');
            themeSwitcherProvider.setThemes(themes);
          }]);
      });

      beforeEach(module('testApp'));

      beforeEach(inject(function(_themeSwitcher_) {
        themeSwitcher = _themeSwitcher_;
      }));

      it("should load stylesheets asynchronously by default", function() {
        expect(themeSwitcher.isAsyncLoad()).toBeTruthy();
      });

      it("should have the correct number of themes", function() {
        expect(themeSwitcher.getThemes().length).toBe(themes.length);
      });

      it("should have the active theme set to 'live' and the correct theme object set", function() {
        expect(themeSwitcher.getActiveThemeName()).toBe('live');
        expect(themeSwitcher.getActiveTheme()).toEqual(themes[0]);
      });

      describe("when we change to theme that is not of type string", function() {
        it("should throw an error and maintain the previous active theme name and object", function() {
          var previousThemeName = themeSwitcher.getActiveThemeName();
          var previousThemeObject = themes[0];

          expect(function() {
            themeSwitcher.changeToTheme(false);
          }).toThrowError();

          expect(themeSwitcher.getActiveThemeName()).toBe(previousThemeName);
          expect(themeSwitcher.getActiveTheme()).toBe(previousThemeObject);
        });
      });

      describe("when we change to a theme that does not exist in the themes array", function() {
        it("should throw an error and maintain the previous active theme name and object", function() {
          var previousThemeName = themeSwitcher.getActiveThemeName();
          var previousThemeObject = themes[0];

          expect(function() {
            themeSwitcher.changeToTheme('contest');
          }).toThrowError();

          expect(themeSwitcher.getActiveThemeName()).toBe(previousThemeName);
          expect(themeSwitcher.getActiveTheme()).toBe(previousThemeObject);
        });
      });

      describe("when we change to the 'demo' theme", function() {
        var cb;
        var newThemeName = 'demo';
        var expectedThemeObject = themes[1];

        beforeEach(function() {
          cb = {
            watcher: function(themeName) {}
          };

          spyOn(cb, 'watcher');

          themeSwitcher.addWatcher(cb.watcher);

          themeSwitcher.changeToTheme(newThemeName);
        });

        it("should have the active theme set to 'demo' and the correct theme object set", function() {
          expect(themeSwitcher.getActiveThemeName()).toBe(newThemeName);
          expect(themeSwitcher.getActiveTheme()).toEqual(expectedThemeObject);
        });

        it("should call the registered watcher with the right theme object", function() {
          expect(cb.watcher).toHaveBeenCalledWith(expectedThemeObject);
        });
      });
    });
  });
})();
