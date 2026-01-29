import { Component, AfterViewInit, ElementRef, ViewChild, inject, OnDestroy } from '@angular/core';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { Candles, CandleData } from '../../services/candles';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-graphic',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './full-graphic.html',
  styleUrl: './full-graphic.scss',
})

export class FullGraphic implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true })
  chartContainer!: ElementRef<HTMLDivElement>;

  private chart!: IChartApi;
  private candleSeries!: ISeriesApi<'Candlestick'>;
  private candleSubscription?: Subscription;
  private allCandles: CandleData[] = [];

  selectedInterval = new FormControl<string>('M1');

  constructor(private candle: Candles) { }

  ngAfterViewInit(): void {
    this.initChart();

    this.candleSubscription = this.candle.getAllCandles().subscribe(candles => {
      this.allCandles = [...candles];
      this.applyInterval();
    });

    this.selectedInterval.valueChanges.subscribe(() => this.applyInterval());
  }

  ngOnDestroy(): void {
    this.chart?.remove();
    this.candleSubscription?.unsubscribe();
  }

  private initChart(): void {
    this.chart = createChart(this.chartContainer.nativeElement, {
      width: this.chartContainer.nativeElement.clientWidth,
      height: 600,
    });

    this.candleSeries = this.chart.addSeries(CandlestickSeries);
  }

  private applyInterval(): void {
    const interval = this.selectedInterval.value || 'M1';

    const filteredCandles = this.allCandles
      .filter(candle => candle.timeFrame === interval)
      .map(({ time, open, high, low, close }) => ({ time, open, high, low, close }));

    if (filteredCandles.length > 0) {
      this.candleSeries.setData(filteredCandles);
      this.chart.timeScale().fitContent();
    }
  }
}

// export class FullGraphic implements AfterViewInit, OnDestroy {
//   @ViewChild('chartContainer', { static: true })
//   chartContainer!: ElementRef<HTMLDivElement>;

//   private chart!: IChartApi;
//   private candleSeries!: ISeriesApi<'Candlestick'>;
//   private candlesService = inject(Candles);
//   private candleSubscription?: Subscription;
//   private updateInterval?: number;
//   private allCandles: CandleData[] = [];

//   selectedInterval = new FormControl<string>('M1');

//   ngAfterViewInit(): void {
//     this.initChart();
//     this.selectedInterval.valueChanges.subscribe(() => this.applyInterval());
//   }

//   ngOnDestroy(): void {
//     if (this.updateInterval) {
//       clearInterval(this.updateInterval);
//     }
//     this.chart?.remove();
//   }

//   private async initChart(): Promise<void> {
//     this.chart = createChart(this.chartContainer.nativeElement, {
//       width: this.chartContainer.nativeElement.clientWidth,
//       height: 600,
//     });

//     this.candleSeries = this.chart.addSeries(CandlestickSeries);

//     await this.loadAllData();

//     this.updateInterval = window.setInterval(() => this.loadAllData(), 5000);
//   }

//   private async loadAllData(): Promise<void> {
//     try {
//       this.allCandles = await this.candlesService.getCandles();
//       this.applyInterval();
//     } catch (error) {
//       console.error('Error loading candles:', error);
//     }
//   }

//   private applyInterval(): void {
//     const interval = this.selectedInterval.value || 'M1';

//     const filteredCandles = this.allCandles
//       .filter(candle => candle.timeFrame === interval)
//       .map(({ time, open, high, low, close }) => ({ time, open, high, low, close }));

//     if (filteredCandles.length > 0) {
//       this.candleSeries.setData(filteredCandles);
//       this.chart.timeScale().fitContent();
//     }
//   }
// }
