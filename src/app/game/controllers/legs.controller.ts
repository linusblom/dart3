import { Score, GamePlayer, Game, JackpotDrawType } from '@game/models';

import { GameController } from './game.controller';

export class LegsController extends GameController {
  endTurn(scores: Score[], game: Game): Partial<GamePlayer> {
    const player = this.getCurrentPlayer(game);
    const previousPlayerScores = this.getPreviousPlayerScores(game);
    const activePlayers = this.getActivePlayers(game.players);

    const { round, ...rest } = this.checkScore(player, scores, previousPlayerScores, activePlayers);

    return {
      id: player.id,
      currentRound: game.currentRound,
      xp: player.xp + this.getTurnTotal(scores),
      ...rest,
      rounds: {
        [game.currentRound]: {
          scores,
          jackpotDraw: JackpotDrawType.PENDING,
          ...round,
        },
      },
    };
  }

  shouldEnd(players: GamePlayer[]): boolean {
    return this.getActivePlayers(players) === 1;
  }

  private checkScore(
    currentPlayer: GamePlayer,
    currentPlayerScores: Score[],
    previousPlayerScores: Score[],
    activePlayers: number,
  ) {
    const currentPlayerTotal = this.getTurnTotal(currentPlayerScores);
    const previousPlayerTotal = this.getTurnTotal(previousPlayerScores);

    if (currentPlayerTotal <= previousPlayerTotal) {
      const legsLeft = currentPlayer.total - 1;

      return {
        position: legsLeft === 0 ? activePlayers : 0,
        total: legsLeft,
        totalDisplay: Array(legsLeft)
          .fill('&#x1f9b5;')
          .join(' '),
        round: {
          score: currentPlayerTotal,
          scoreDisplay: `${currentPlayerTotal}`,
          color: '#bf340a',
        },
      };
    }

    return {
      total: currentPlayer.total,
      totalDisplay: currentPlayer.totalDisplay,
      round: {
        score: currentPlayerTotal,
        scoreDisplay: `${currentPlayerTotal}`,
        color: '#9ACB34',
      },
    };
  }
}
