import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'ca-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {


  public chatId: string;
  private routeParameters$: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeParameters$ =
      this.activatedRoute.params
        .subscribe((params: Params) => this.chatId = params['chatId']);
  }

  ngOnDestroy(): void {
    this.routeParameters$.unsubscribe();
  }
}
