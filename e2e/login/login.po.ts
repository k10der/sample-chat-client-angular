import {browser, element, by} from 'protractor';

export class LoginPage {
  navigateTo() {
    return browser.get('/login');
  }

  getLoginButton() {
    return element(by.css('button'));
  }

  getPasswordInput() {
    return element(by.css('#password'));
  }

  getUsernameInput() {
    return element(by.css('#username'));
  }
}
