import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BoxTab } from '../box.models';

@Component({
  selector: 'app-box-tabs',
  templateUrl: './box-tabs.component.html',
  styleUrls: ['./box-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxTabsComponent {
  @Input() activeTab = '';
  @Input() tabs: BoxTab[] = [];

  @Output() activeTabChange = new EventEmitter<string>();
}
