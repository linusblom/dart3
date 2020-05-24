import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Match } from 'dart3-sdk';

@Component({
  selector: 'game-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.scss'],
})
export class MatchesComponent {
  @Input() color = '#ffffff';
  @Input() matches: Match[] = [];

  @Output() close = new EventEmitter<void>();
}
