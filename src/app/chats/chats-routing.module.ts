import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ChatsComponent} from './chats.component';
import {ChatComponent} from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChatsComponent,
      },
      {
        path: ':chatId',
        component: ChatComponent,
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
    ChatComponent,
    ChatsComponent,
  ],
  exports: [RouterModule],
})
export class ChatsRoutingModule {
}
