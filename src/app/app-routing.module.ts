import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './core/_guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuthenticatedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'rooms',
      },
      {
        path: 'rooms',
        loadChildren: 'app/rooms/rooms.module#RoomsModule',
        canLoad: [IsAuthenticatedGuard],
      },
      {
        path: 'profile',
        loadChildren: 'app/profile/profile.module#ProfileModule',
        canLoad: [IsAuthenticatedGuard],
      },
    ]
  },
  {
    path: 'login',
    loadChildren: 'app/login/login.module#LoginModule',
  },
  {
    path: 'register',
    loadChildren: 'app/register/register.module#RegisterModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
