import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BoxListItem } from '../box.models';

@Component({
  selector: 'app-box-list-view',
  templateUrl: './box-list-view.component.html',
  styleUrls: ['./box-list-view.component.scss'],
})
export class BoxListViewComponent {
  @Input() items: BoxListItem[] = [];
  @Input() loading = false;
  @Input() selected = '';

  @Output() select = new EventEmitter<string>();
}
