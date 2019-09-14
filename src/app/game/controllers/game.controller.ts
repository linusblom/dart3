import { Game, GamePlayer, Score } from '@game/models';

export abstract class GameController {
  abstract endTurn(scores: Score[], game: Game): Partial<GamePlayer>;
  abstract shouldGameEnd(players: GamePlayer[]): boolean;
  abstract roundHeader(round: number): string;
  abstract totalHeader(): string;
  abstract turnText(game: Game): string;

  protected getPlayerById(id: string, players: GamePlayer[]) {
    return players.find(player => player.id === id);
  }

  protected getCurrentPlayer(game: Game) {
    return this.getPlayerById(game.playerIds[game.currentTurn], game.players);
  }

  protected getPreviousPlayerScores(game: Game) {
    if (game.currentRound === 1 && game.currentTurn === 0) {
      return Array(3).fill({ score: 1, multiplier: -1 });
    }

    const getPreviousTurn = (turn: number, round: number) => {
      if (--turn === -1) {
        turn = game.players.length - 1;
        round--;
      }

      const prevPlayerTurn = this.getPlayerById(game.playerIds[turn], game.players).rounds[round];

      return prevPlayerTurn ? prevPlayerTurn.scores : getPreviousTurn(turn, round);
    };

    return getPreviousTurn(game.currentTurn, game.currentRound);
  }

  protected getActivePlayers(players: GamePlayer[]) {
    return players.filter(player => player.position === 0).length;
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
