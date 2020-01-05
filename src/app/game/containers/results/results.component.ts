import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { GamePlayer, Permission } from 'dart3-sdk';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { createGame } from '@game/models';
import { getLoading, getSelectedGame, State } from '@game/reducers';
import { getGameNiceName } from '@game/utils/game-nice-name';
import { hasPermission } from '@root/reducers';
import { BoxTab } from '@shared/modules/box/box.models';
import { boardLabels, colors } from '@utils/chart';
import { MEDAL_1ST, MEDAL_2ND, MEDAL_3RD } from '@utils/emojis';

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
  game = createGame();
  positionSortedPlayers: GamePlayer[] = [];
  activeTab = '';
  tabs: BoxTab[] = [{ name: 'All', value: '' }];
  medalEmojiHex = [MEDAL_1ST, MEDAL_2ND, MEDAL_3RD];

  getGameNiceName = getGameNiceName;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const id = this.route.snapshot.params.gameId;
    const navigationExtras = this.router.getCurrentNavigation().extras;

    this.store.dispatch(GameActions.get({ id }));

    this.store
      .pipe(
        select(getSelectedGame),
        takeUntil(this.destroy$),
        map(game => ({
          game: {
            ...game,
            players: [
              ...game.players.sort(
                (a, b) => game.playerIds.indexOf(a.id) - game.playerIds.indexOf(b.id),
              ),
            ],
          },
          positionSortedPlayers: [
            ...game.players.sort((a, b) => (a.position > b.position ? 1 : -1)),
          ],
        })),
      )
      .subscribe(({ game, positionSortedPlayers }) => {
        this.game = game;
        this.positionSortedPlayers = positionSortedPlayers;
        this.tabs = [
          { name: 'All', value: '' },
          ...game.players.map(player => ({ name: player.base.name, value: player.id })),
        ];
      });

    this.store
      .pipe(
        select(getLoading),
        takeUntil(this.destroy$),
        filter(loading => !loading),
        take(1),
      )
      .subscribe(() => {
        this.barChart = this.getBarChart();
        this.pieChart = this.getPieChart();
      });

    this.store
      .pipe(
        select(hasPermission(Permission.CoreMusicPlay)),
        takeUntil(this.destroy$),
        filter(play => play && navigationExtras.state && navigationExtras.state.play),
        take(1),
      )
      .subscribe(() => this.playAnthem());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
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

  playAnthem() {
    const anthem = new Audio('../../../../assets/darts-anthem.mp3');
    anthem.load();
    anthem.play();
  }
}
