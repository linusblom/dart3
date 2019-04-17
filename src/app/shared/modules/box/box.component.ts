import { Component, Input } from '@angular/core';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  @Input() header = '';
  @Input() icon = faCaretRight;
}
