import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MdButtonModule, MdCardModule, MdInputModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  }
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
    RegisterComponent,
  ],
  exports: [RouterModule],
})
export class RegisterRoutingModule {
}
