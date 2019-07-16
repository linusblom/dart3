import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BoxListItem } from '../box.models';

@Component({
  selector: 'app-box-list-view',
  templateUrl: './box-list-view.component.html',
  styleUrls: ['./box-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxListViewComponent {
  @Input() items: BoxListItem[] = [];
  @Input() loading = true;
  @Input() selected = '';
  @Input() header = '';

  @Output() selectId = new EventEmitter<string>();
}
