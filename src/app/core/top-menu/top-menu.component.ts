import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'ca-top-menu',
  templateUrl: 'top-menu.component.html',
  styleUrls: ['top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }
}
