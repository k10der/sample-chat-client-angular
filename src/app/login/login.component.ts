import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as profileActions from '../core/_actions/profile.actions';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'ca-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials = {
    username: '',
    password: '',
  };

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<any>) {
  }

  ngOnInit() {
  }

  onLoginFormSubmit(f: NgForm) {
    const {username, password} = f.value;

    this.authService.authenticate(username, password)
      .subscribe(() => {
        this.store.dispatch(new profileActions.SetAuthenticationStateAction({isAuthenticated: true}));
        // TODO wait untill connection available
        this.router.navigate(['']);
      }, err => console.log(err)); // TODO handle auth errors
  }
}
