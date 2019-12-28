import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { GameActions } from '@game/actions';
import { createGame, GamePlayer, GameType } from '@game/models';
import { getLoading, getSelectedGame, State } from '@game/reducers';
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
  sortedGamePlayers: GamePlayer[] = [];
  activeTab = '';
  tabs: BoxTab[] = [{ name: 'All', value: '' }];
  medalEmojiHex = [MEDAL_1ST, MEDAL_2ND, MEDAL_3RD];

  private destroy$ = new Subject<void>();

  constructor(private readonly store: Store<State>, private readonly route: ActivatedRoute) {
    const id = this.route.snapshot.params.gameId;

    this.store.dispatch(GameActions.get({ id }));

    this.store.pipe(select(getSelectedGame), takeUntil(this.destroy$)).subscribe(game => {
      this.game = game;
      this.sortedGamePlayers = game.players.sort((a, b) => (a.position > b.position ? 1 : -1));
      this.tabs = [
        { name: 'All', value: '' },
        ...game.players.map(player => ({ name: player.base.name, value: player.id })),
      ];
    });

    this.store
      .pipe(select(getLoading))
      .pipe(
        filter(loading => !loading),
        take(1),
      )
      .subscribe(() => {
        this.barChart = this.getBarChart();
        this.pieChart = this.getPieChart();
      });
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

  getGameNiceName(type: GameType) {
    switch (type) {
      case GameType.HALVEIT:
        return 'halve it';
      case GameType.THREE_HUNDRED_ONE:
        return '301';
      case GameType.FIVE_HUNDRED_ONE:
        return '501';
      default:
        return type;
    }
  }
}
