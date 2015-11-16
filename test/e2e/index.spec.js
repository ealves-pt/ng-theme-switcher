describe('ng-theme-switcher', function() {
  browser.get('/');

  describe("index", function() {
    it("should have title", function() {
      expect(browser.getTitle()).toBe('ng-theme-switcher demo');
    });
  });
});
