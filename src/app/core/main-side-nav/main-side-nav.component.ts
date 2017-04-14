import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Profile } from '../_models/profile.model';

@Component({
  selector: 'ca-main-side-nav',
  templateUrl: './main-side-nav.component.html',
  styleUrls: ['./main-side-nav.component.scss'],
})
export class MainSideNavComponent implements OnInit, OnDestroy {

  @Input() joinedRooms: any;
  @Input() profile: Profile;
  @Input() sidenav: any;

  @Output() logoutClick: EventEmitter<any> = new EventEmitter();

  sidenavMode = 'main';

  private sidenavClose$: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // Always set main mode on sidenav close
    this.sidenavClose$ = this.sidenav.onClose
      .subscribe(() => this.setSidenavMode('main'));
  }

  ngOnDestroy(): void {
    this.sidenavClose$.unsubscribe();
  }

  /**
   * Go to profile edit page
   */
  goToProfile(): void {
    this.router.navigate(['/profile'])
      .then(() => {
        // Close the sidenav if a route transition was successful
        this.sidenav.close();
      });
  }

  /**
   * Go to a room with the specified id
   *
   * @param {string} roomId
   */
  goToRoom(roomId: string): void {
    this.router.navigate(['/rooms', roomId])
      .then(() => {
        // Close the sidenav if a route transition was successful
        this.sidenav.close();
      });
  }

  /**
   * Go to room list
   */
  goToRoomList(): void {
    this.router.navigate(['/rooms'])
      .then(() => {
        // Close the sidenav if a route transition was successful
        this.sidenav.close();
      });
  }

  /**
   * Set side nav mode (which side nave content to show)
   *
   * @param {string} modeName
   */
  setSidenavMode(modeName: string) {
    this.sidenavMode = modeName;
  }

  /**
   * Toggle side nav mode (which side nave content to show)
   */
  toggleSidenavMode(): void {
    this.sidenavMode = this.sidenavMode === 'main' ? 'profile' : 'main';
  }
}
