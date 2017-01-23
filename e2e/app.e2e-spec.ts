import { ChatA2Page } from './app.po';

xdescribe('chat-a2 App', function() {
  let page: ChatA2Page;

  beforeEach(() => {
    page = new ChatA2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
