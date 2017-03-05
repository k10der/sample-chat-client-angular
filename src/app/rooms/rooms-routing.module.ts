import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { IsJoinedGuard } from './room/is-joined.guard';
import { RoomComponent } from './room/room.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomsComponent } from './rooms.component';
import { RoomsService } from './rooms.service';

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
  ],
  providers: [
    RoomsService,
    IsJoinedGuard,
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
