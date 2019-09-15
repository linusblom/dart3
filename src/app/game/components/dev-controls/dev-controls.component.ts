import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dev-controls',
  templateUrl: './dev-controls.component.html',
  styleUrls: ['./dev-controls.component.scss'],
})
export class DevControlsComponent {
  @Output() abortGame = new EventEmitter<void>();
}
