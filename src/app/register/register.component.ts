import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/finally';

import { ProfileService } from '../core/profile.service';
import { NgForm } from '@angular/forms';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public user: any = {};
  public processingForm: boolean;

  private formProcessing$: Subscription;

  constructor(private profileService: ProfileService) {
  }

  ngOnInit() {
    this.processingForm = false;
  }

  ngOnDestroy(): void {
    if (this.formProcessing$) {
      this.formProcessing$.unsubscribe();
    }
  }

  createAccountAction(f: NgForm) {
    const user = f.value;

    // Setting processing form flag
    this.processingForm = true;
    // Trying to register a user
    this.formProcessing$ =
      this.profileService.createUser(user)
      // Clearing processing form flag
        .finally(() => this.processingForm = false)
        .subscribe(
          (d) => {
            // In case of success
            console.log('send', d);
          },
          (d) => {
            // In case of error
            console.log('error', d);
          }
        );
  }
}
