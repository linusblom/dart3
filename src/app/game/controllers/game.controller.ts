import { select, Store } from '@ngrx/store';
import { BoardData, Game, GamePlayer, Score } from 'dart3-sdk';

import { getCurrentGame, State } from '@game/reducers';

export abstract class GameController {
  game: Game;

  constructor(private readonly store: Store<State>) {
    this.store.pipe(select(getCurrentGame)).subscribe(game => (this.game = game));
  }

  abstract endTurn(scores: Score[]): Partial<GamePlayer>;
  abstract shouldGameEnd(): boolean;
  abstract getBoardData(): BoardData;

  protected getPlayerById(id: string) {
    return this.game.players.find(player => player.id === id);
  }

  protected getCurrentPlayer() {
    return this.getPlayerById(this.game.playerIds[this.game.currentTurn]);
  }

  protected getPreviousPlayerScores() {
    if (this.game.currentRound === 1 && this.game.currentTurn === 0) {
      return Array(3).fill({ score: 0, multiplier: 0 });
    }

    const getPreviousTurn = (turn: number, round: number) => {
      if (--turn === -1) {
        turn = this.game.players.length - 1;
        round--;
      }

      const prevPlayerTurn = this.getPlayerById(this.game.playerIds[turn]).rounds[round];

      return prevPlayerTurn ? prevPlayerTurn.scores : getPreviousTurn(turn, round);
    };

    return getPreviousTurn(this.game.currentTurn, this.game.currentRound);
  }

  protected getActivePlayers() {
    return this.game.players.filter(player => player.position === 0).length;
  }

  protected getHitTotal(score: Score) {
    return score.score * score.multiplier;
  }

  protected getTurnTotal(scores: Score[], allowMisses = true) {
    if (!allowMisses && scores.filter(score => score.score === 0).length > 0) {
      return 0;
    }

    return scores.reduce((total, score) => total + this.getHitTotal(score), 0);
  }
}
