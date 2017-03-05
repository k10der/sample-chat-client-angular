import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ProfileService } from '../core/profile.service';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    ProfileService,
  ],
  declarations: [
    ProfileComponent,
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
