import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { StringConstants } from 'src/app/constants/string-constants';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    var expectedTitleText = 'Welcome to ' + StringConstants.app_Title + '!';
    expect(page.getTitleText()).toEqual(expectedTitleText);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
