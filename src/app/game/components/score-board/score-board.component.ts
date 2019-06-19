import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GameType, Player, ScoreBoard } from '@game/models';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreBoardComponent {
  @Input() scoreboard: ScoreBoard;
  @Input() players: Player[] = [];
  @Input() type: GameType;
  @Input() currentTurn = 0;
  @Input() currentRound = 0;
  @Input() disableAnimation = false;

  GameType = GameType;
  halveItRounds = ['19', '18', 'D', '17', '41', 'T', '20', 'B'];

  getPlayerRoundScore(roundIndex: number, playerIndex: number) {
    const roundScore =
      this.scoreboard.roundScores.length > roundIndex
        ? this.scoreboard.roundScores[roundIndex]
        : [];
    const playerScore = roundScore.length > playerIndex ? roundScore[playerIndex] : '';
    return playerScore;
  }
}
