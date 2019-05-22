import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-group',
  templateUrl: './box-group.component.html',
  styleUrls: ['./box-group.component.scss'],
})
export class BoxGroupComponent {
  @Input() header = '';
}
