import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-group',
  templateUrl: './box-group.component.html',
  styleUrls: ['./box-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxGroupComponent {
  @Input() header = '';
  @Input() styled = true;
}
