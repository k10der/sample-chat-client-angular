import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoomDialogComponent } from './create-room-dialog.component';

describe('CreateRoomDialogComponent', () => {
  let component: CreateRoomDialogComponent;
  let fixture: ComponentFixture<CreateRoomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRoomDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
