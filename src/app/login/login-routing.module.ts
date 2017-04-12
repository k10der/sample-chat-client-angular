import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdButtonModule, MdCardModule, MdInputModule } from '@angular/material';

import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [
    MdButtonModule,
    MdCardModule,
    MdInputModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    LoginComponent,
  ],
  exports: [RouterModule],
})
export class LoginRoutingModule {
}
