import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Match } from 'dart3-sdk';

@Component({
  selector: 'game-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchesComponent {
  @Input() color = '#ffffff';
  @Input() matches: Match[] = [];

  @Output() close = new EventEmitter<void>();
}
