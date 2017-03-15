import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { RoomComponent } from './room/room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomsService } from './rooms.service';
import { reducer as messagesReducer } from './_reducers/messages.reducer';
import { reducer as roomUsersReducer } from './_reducers/room-users.reducer';
import { reducer as roomsReducer } from './_reducers/rooms.reducer';
import { RoomUsersEffectsService } from './_effects/room-users-effects.service';
import { RoomsEffectsService } from './_effects/rooms-effects.service';
import { MessagesService } from './messages.service';
import { MessagesEffectsService } from './_effects/messages-effects.service';
import { IsJoinedGuard } from './room/is-joined.guard';
import { ReducersService } from '../core/reducers.service';
import { CreateRoomDialogComponent } from './_dialogs/create-room-dialog/create-room-dialog.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RoomListComponent,
      },
      {
        path: ':roomId',
        component: RoomComponent,
        canActivate: [IsJoinedGuard],
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    EffectsModule.run(MessagesEffectsService),
    EffectsModule.run(RoomUsersEffectsService),
    EffectsModule.run(RoomsEffectsService),
  ],
  providers: [
    IsJoinedGuard,
    MessagesService,
    MessagesEffectsService,
    RoomsService,
    RoomUsersEffectsService,
    RoomsEffectsService,
  ],
  declarations: [
    CreateRoomDialogComponent,
    RoomComponent,
    RoomListComponent,
  ],
  exports: [RouterModule],
  entryComponents: [CreateRoomDialogComponent],
})
export class RoomsRoutingModule {
  constructor(private reducersService: ReducersService) {
    this.reducersService.addReducer({
      messages: messagesReducer,
      roomUsers: roomUsersReducer,
      rooms: roomsReducer,
    })
  }
}
