import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

import { Hit } from 'dart3-sdk';

@Component({
  selector: 'game-round-score',
  templateUrl: './round-score.component.html',
  styleUrls: ['./round-score.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundScoreComponent {
  @Input() set hits(hits: Hit[]) {
    // this.total = hits.reduce((acc, { total }) => acc + total, 0);
    this.background = this.total > 0 ? '#daf2dc' : '#f2dada';
  }

  @HostBinding('style.background') background = '#daf2dc';

  total = 0;
}
