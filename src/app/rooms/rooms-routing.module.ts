import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { RoomComponent } from './room/room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomsComponent } from './rooms.component';
import { RoomsService } from './rooms.service';
import { reducer as messagesReducer } from './_reducers/messages.reducer';
import { reducer as roomUsersReducer } from './_reducers/room-users.reducer';
import { reducer as roomsReducer } from './_reducers/rooms.reducer';
import { RoomUsersEffectsService } from './_effects/room-users-effects.service';
import { RoomsEffectsService } from './_effects/rooms-effects.service';
import { MessagesService } from './messages.service';
import { MessagesEffectsService } from './_effects/messages-effects.service';

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    children: [
      {
        path: '',
        component: RoomListComponent,
      },
      {
        path: ':roomId',
        component: RoomComponent,
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    StoreModule.provideStore({
      messages: messagesReducer,
      rooms: roomsReducer,
      roomUsers: roomUsersReducer,
    }),
    EffectsModule.run(MessagesEffectsService),
    EffectsModule.run(RoomUsersEffectsService),
    EffectsModule.run(RoomsEffectsService),
  ],
  providers: [
    MessagesService,
    MessagesEffectsService,
    RoomsService,
    RoomUsersEffectsService,
    RoomsEffectsService,
  ],
  declarations: [
    RoomComponent,
    RoomListComponent,
    RoomsComponent,
  ],
  exports: [RouterModule],
})
export class RoomsRoutingModule {
}
