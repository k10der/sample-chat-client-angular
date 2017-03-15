import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  templateUrl: 'create-room-dialog.component.html',
  styleUrls: ['create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent {
  newRoom: {} = {};

  constructor(private dialogRef: MdDialogRef<CreateRoomDialogComponent>) {
  }

  onNewRoomFormSubmit(form) {
    this.dialogRef.close(form.value);
  }
}
