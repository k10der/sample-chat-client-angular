import {LoginPage} from './login.po';

describe('Application login', function () {
  let page: LoginPage;
  let loginButton;
  let passwordInput;
  let usernameInput;

  beforeEach(() => {
    page = new LoginPage();
    loginButton = page.getLoginButton();
    passwordInput = page.getPasswordInput();
    usernameInput = page.getUsernameInput();
  });

  it('should have username, password input fields and login button', () => {
    page.navigateTo();
    expect(loginButton).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(usernameInput).toBeDefined();
  });

  it('should have login button disabled if the form is empty', () => {
    page.navigateTo();
    expect(loginButton.isEnabled()).toBe(false);
  });

});
