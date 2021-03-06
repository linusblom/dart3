import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePlayer } from 'dart3-sdk';

@Component({
  selector: 'app-player-create',
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.scss'],
})
export class PlayerCreateComponent {
  @Output() create = new EventEmitter<CreatePlayer>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    consent: new FormControl(false),
  });

  onCreate() {
    this.create.emit(this.form.value);
    this.form.reset();
  }
}
