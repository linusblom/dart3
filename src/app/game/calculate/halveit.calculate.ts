import { Injectable } from '@angular/core';

import { Round, Score } from '@game/models';

import { Calculate } from './calculate';

const roundText = [
  'Round 19',
  'Round 18',
  'Round Double',
  'Round 17',
  'Round 41',
  'Round Triple',
  'Round 20',
  'Round Bullseye',
];

@Injectable()
export class HalveIt extends Calculate {
  calculate(rounds: Round[]) {
    const playerRounds = this.mapToPlayerRounds(rounds);
    const roundScores = this.mapRounds(playerRounds);
    const total = this.countTotal(roundScores);

    return { roundScores, total, roundText };
  }

  private mapRounds(rounds: Score[][][]) {
    return rounds.map((players, index) => this.mapPlayers(players, index));
  }

  private mapPlayers(players: Score[][], round: number) {
    return players.map(scores => this.mapScores(scores, round));
  }

  private mapScores(scores: Score[], round: number) {
    if (scores.filter(score => score.score === -1).length === 3) {
      return -1;
    }

    switch (round) {
      case 0:
        return this.checkScore(scores, [19]);
      case 1:
        return this.checkScore(scores, [18]);
      case 2:
        return this.checkMultiplier(scores, [2]);
      case 3:
        return this.checkScore(scores, [17]);
      case 4:
        return this.checkTotal(scores, 41);
      case 5:
        return this.checkMultiplier(scores, [3]);
      case 6:
        return this.checkScore(scores, [20]);
      case 7:
        return this.checkScore(scores, [25]);
    }
  }

  private checkScore(scores: Score[], allowedScores: number[]) {
    return scores.reduce(
      (total, score) =>
        allowedScores.includes(score.score) ? total + this.getHitTotal(score) : total,
      0,
    );
  }

  private checkMultiplier(scores: Score[], allowedMultipliers: number[]) {
    return scores.reduce(
      (total, score) =>
        allowedMultipliers.includes(score.multiplier) ? total + this.getHitTotal(score) : total,
      0,
    );
  }

  private checkTotal(scores: Score[], allowedTotal: number) {
    const total = this.getRoundTotal(scores);
    return total === allowedTotal ? total : 0;
  }

  private countTotal(rounds: number[][]) {
    const total = {};

    rounds.forEach(round =>
      round.forEach((score, index) => {
        const playerTotal = total[index] || 0;

        if (score === -1) {
          total[index] = playerTotal;
        } else if (score === 0) {
          total[index] = Math.ceil(playerTotal / 2);
        } else {
          total[index] = playerTotal + score;
        }
      }),
    );

    return total;
  }
}
