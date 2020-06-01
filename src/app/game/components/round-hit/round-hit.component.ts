import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { RoundHit } from 'dart3-sdk';

@Component({
  selector: 'game-round-hit',
  templateUrl: './round-hit.component.html',
  styleUrls: ['./round-hit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoundHitComponent {
  @Input() set hit(hit: RoundHit) {
    this.score = hit.approvedScore;
    // this.total = hits.reduce((acc, { total }) => acc + total, 0);
    //this.background = this.total > 0 ? '#daf2dc' : '#f2dada';
  }

  @HostBinding('style.background') background = '#daf2dc';

  score = 0;
}
