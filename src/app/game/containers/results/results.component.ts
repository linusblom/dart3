import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, map, shareReplay, takeUntil, tap } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { Game, GameData, GamePlayer, Player } from '@game/models';
import {
  getGame,
  getGameData,
  getGamePlayers,
  getLoadingGame,
  getLoadingPlayers,
  State,
} from '@game/reducers';
import { getLoadingAccount } from '@root/reducers';
import { BoxTab } from '@shared/modules/box/box.models';
import { boardLabels, colors } from '@utils/chart';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnDestroy {
  @ViewChild('barChartRef', { static: true }) barChartRef: ElementRef;
  @ViewChild('pieChartRef', { static: true }) pieChartRef: ElementRef;

  gameData$: Observable<GameData>;

  barChart: Chart;
  pieChart: Chart;
  players: Player[] = [];
  game = {} as Game;
  activeTab = '';
  tabs: BoxTab[] = [{ name: 'All', value: '' }];
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

    this.gameData$ = this.store.pipe(
      select(getGameData),
      shareReplay(1),
    );

    this.store
      .pipe(
        select(getGamePlayers),
        takeUntil(this.destroy$),
      )
      .subscribe(players => {
        this.players = players;
        this.tabs = [
          { name: 'All', value: '' },
          ...players.map(player => ({ name: player.name, value: player.id })),
        ];
      });

    this.store
      .pipe(
        select(getGame),
        takeUntil(this.destroy$),
      )
      .subscribe(game => {
        this.game = game;
      });

    combineLatest([
      this.store.select(getLoadingAccount),
      this.store.select(getLoadingPlayers),
      this.store.select(getLoadingGame),
    ])
      .pipe(
        takeUntil(this.destroy$),
        map(([account, players, game]) => account || players || game),
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

  get sortedGamePlayers() {
    return this.game.players.sort((a, b) => (a.position > b.position ? 1 : -1));
  }

  changeTab(playerId: string) {
    this.activeTab = playerId;
    this.barChart.data.datasets = this.getBarChartDatasets();
    this.barChart.update();
    this.pieChart.data.datasets = this.getPieChartDatasets();
    this.pieChart.update();
  }

  getGamePlayerScores(player: GamePlayer) {
    return Object.values(player.rounds)
      .map(round => round.scores)
      .reduce((accScores, scores) => [...accScores, ...scores], []);
  }

  getBarChartDatasets() {
    return this.game.players.reduce(
      (acc, player) => {
        if (!this.activeTab || this.activeTab === player.id) {
          this.getGamePlayerScores(player).forEach(score => {
            if (score.score !== 0) {
              const scoreIndex = score.score === 25 ? 20 : score.score - 1;
              acc[score.multiplier - 1].data[scoreIndex]++;
            }
          });
        }

        return acc;
      },
      [
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors.single}, 0.4)`,
          borderColor: `rgb(${colors.single})`,
          borderWidth: 1,
          label: 'Single',
        },
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors.double}, 0.4)`,
          borderColor: `rgb(${colors.double})`,
          borderWidth: 1,
          label: 'Double',
        },
        {
          data: Array(21).fill(0),
          backgroundColor: `rgba(${colors.triple}, 0.4)`,
          borderColor: `rgb(${colors.triple})`,
          borderWidth: 1,
          label: 'Triple',
          fill: false,
        },
      ],
    );
  }

  getBarChart() {
    return new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: boardLabels,
        datasets: this.getBarChartDatasets(),
      },
      options: {
        legend: {
          labels: {
            fontColor: colors.font,
            fontSize: 18,
          },
        },
        scales: {
          xAxes: [
            { stacked: true, gridLines: { display: false }, ticks: { fontColor: colors.font } },
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: { color: colors.gridLine, zeroLineColor: colors.gridLine },
              ticks: { fontColor: colors.font, precision: 0 } as Chart.TickOptions,
            },
          ],
        },
      },
    });
  }

  getPieChartDatasets() {
    return this.game.players.reduce(
      (acc, player) => {
        if (!this.activeTab || this.activeTab === player.id) {
          this.getGamePlayerScores(player).forEach(score => {
            acc[0].data[score.score === 0 ? 3 : score.multiplier - 1]++;
          });
        }

        return acc;
      },
      [
        {
          data: [0, 0, 0, 0],
          backgroundColor: [
            `rgba(${colors.single}, 0.4)`,
            `rgba(${colors.double}, 0.4)`,
            `rgba(${colors.triple}, 0.4)`,
            `rgba(${colors.misses}, 0.4)`,
          ],
          borderColor: [
            `rgb(${colors.single})`,
            `rgb(${colors.double})`,
            `rgb(${colors.triple})`,
            `rgb(${colors.misses})`,
          ],
        },
      ],
    );
  }

  getPieChart() {
    return new Chart(this.pieChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Single', 'Double', 'Triple', 'Misses'],
        datasets: this.getPieChartDatasets(),
      },
      options: {
        legend: {
          labels: {
            fontColor: colors.font,
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
