import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { combineLatest, Subject } from 'rxjs';
import { filter, first, map, takeUntil, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { config } from '@game/game.config';
import { Game, Player } from '@game/models';
import {
  getGame,
  getGamePlayers,
  getLoadingGame,
  getLoadingGamePlayers,
  getLoadingPlayers,
  State,
} from '@game/reducers';
import { getLoadingAccount } from '@root/reducers';
import { boardLabels, colors, fontColor, gridLineColor } from '@utils/chart';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnDestroy {
  @ViewChild('barChartRef', { static: true }) barChartRef: ElementRef;
  @ViewChild('pieChartRef', { static: true }) pieChartRef: ElementRef;

  barChart: Chart;
  pieChart: Chart;
  players: Player[] = [];
  game = {} as Game;
  medalEmojiHex = {
    '1': '1F947',
    '2': '1F948',
    '3': '1F949',
  };

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const gameId = this.route.snapshot.params.gameId;

    this.store.dispatch(GameActions.loadGame({ gameId }));
    this.store.dispatch(GameActions.loadGamePlayers({ gameId }));

    this.store
      .pipe(
        select(getGamePlayers),
        takeUntil(this.destroy$),
      )
      .subscribe(players => (this.players = players));

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(game => (this.game = game));

    combineLatest([
      this.store.select(getLoadingAccount),
      this.store.select(getLoadingPlayers),
      this.store.select(getLoadingGame),
      this.store.select(getLoadingGamePlayers),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(([account, players, game, gamePlayers]) => account || players || game || gamePlayers),
        filter(loading => !loading),
        first(),
        tap(() => {
          this.barChart = this.getBarChart();
          this.pieChart = this.getPieChart();
        }),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(GameActions.loadGameDestroy());
    this.store.dispatch(GameActions.loadGamePlayersDestroy());
  }

  get gameConfig() {
    return config[this.game.type] || config.default;
  }

  get sortedGamePlayers() {
    return this.game.players.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  getBarChart() {
    const datasets = this.game.players.reduce(
      (acc, player) => {
        const playerScores = Object.values(player.rounds)
          .map(round => round.scores)
          .reduce((accScores, scores) => [...accScores, ...scores], []);

        playerScores.forEach(score => {
          if (score.score !== 0) {
            const scoreIndex = score.score === 25 ? 20 : score.score - 1;
            acc[score.multiplier - 1].data[scoreIndex]++;
          }
        });

        return acc;
      },
      [
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors[0]}, 0.4)`,
          borderColor: `rgb(${colors[0]})`,
          borderWidth: 1,
          label: 'Single',
        },
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors[1]}, 0.4)`,
          borderColor: `rgb(${colors[1]})`,
          borderWidth: 1,
          label: 'Double',
        },
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors[2]}, 0.4)`,
          borderColor: `rgb(${colors[2]})`,
          borderWidth: 1,
          label: 'Triple',
          fill: false,
        },
      ],
    );

    return new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: boardLabels,
        datasets,
      },
      options: {
        legend: {
          labels: {
            fontColor,
            fontSize: 18,
          },
        },
        scales: {
          xAxes: [{ stacked: true, gridLines: { display: false }, ticks: { fontColor } }],
          yAxes: [
            {
              stacked: true,
              gridLines: { color: gridLineColor, zeroLineColor: gridLineColor },
              ticks: { fontColor },
            },
          ],
        },
      },
    });
  }

  getPieChart() {
    const datasets = this.game.players.reduce(
      (acc, player) => {
        const playerScores = Object.values(player.rounds)
          .map(round => round.scores)
          .reduce((accScores, scores) => [...accScores, ...scores], []);

        playerScores.forEach(score => {
          acc[0].data[score.score === 0 ? 3 : score.multiplier - 1]++;
        });

        return acc;
      },
      [
        {
          data: [0, 0, 0, 0],
          backgroundColor: [
            `rgba(${colors[0]}, 0.4)`,
            `rgba(${colors[1]}, 0.4)`,
            `rgba(${colors[2]}, 0.4)`,
            `rgba(${colors[6]}, 0.4)`,
          ],
          borderColor: [
            `rgb(${colors[0]})`,
            `rgb(${colors[1]})`,
            `rgb(${colors[2]})`,
            `rgb(${colors[6]})`,
          ],
        },
      ],
    );

    return new Chart(this.pieChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Single', 'Double', 'Triple', 'Misses'],
        datasets,
      },
      options: {
        legend: {
          labels: {
            fontColor,
            fontSize: 18,
          },
        },
      },
    });
  }

  millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  getPlayer(id: string) {
    return this.players.find(player => player.id === id);
  }
}
