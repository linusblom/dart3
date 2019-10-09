import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() header = '';

  @Input()
  @HostBinding('style.width')
  width = '900px';
}
