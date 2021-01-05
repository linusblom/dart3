import { Component, Input } from '@angular/core';
import { MetaData } from 'dart3-sdk';

@Component({
  selector: 'game-wizard-info',
  templateUrl: './wizard-info.component.html',
  styleUrls: ['./wizard-info.component.scss'],
})
export class WizardInfoComponent {
  @Input() meta = {} as MetaData;
  @Input() bet = 0;
  @Input() players = 0;
  @Input() minPlayers = 0;
  @Input() maxPlayers = 0;
  @Input() evenPlayers = false;
}
