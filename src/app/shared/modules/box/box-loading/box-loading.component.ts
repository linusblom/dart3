import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-box-loading',
  templateUrl: './box-loading.component.html',
  styleUrls: ['./box-loading.component.scss'],
})
export class BoxLoadingComponent {
  @Input() diameter = 75;
}
