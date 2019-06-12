import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Player, Round } from '@game/models';
import { HalveItService } from '@game/services';

@Component({
  selector: 'app-score-board-halveit',
  templateUrl: './score-board-halveit.component.html',
  styleUrls: ['../score-board/score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardHalveitComponent {
  @Input() players: Player[] = [];
  @Input() currentTurn = 0;
  @Input() currentRound = 0;
  @Input() loading = false;
  @Input() set rounds(rounds: Round[]) {
    const { roundScores, total } = this.service.calculate(rounds);
    this.roundScores = roundScores;
    this.total = total;
  }

  constructor(private readonly service: HalveItService) {}

  roundScores: number[][] = [];
  total = {};
  halveItRounds = ['19', '18', 'D', '17', '41', 'T', '20', 'B'];

  getPlayerRoundScore(roundIndex: number, playerIndex: number) {
    const roundScore = this.roundScores.length > roundIndex ? this.roundScores[roundIndex] : [];
    console.log(roundScore.length);
    const playerScore = roundScore.length > playerIndex ? roundScore[playerIndex] : '';
    return playerScore;
  }
}
