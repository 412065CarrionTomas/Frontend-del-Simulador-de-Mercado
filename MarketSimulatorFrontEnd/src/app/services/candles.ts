import { Injectable } from '@angular/core';
import { Time } from 'lightweight-charts';
import { Observable, Subject } from 'rxjs';
import { StompSubscription, Client } from '@stomp/stompjs';

export interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  timeFrame: string;
}

@Injectable({
  providedIn: 'root',
})
export class Candles {
  private candlesSubject = new Subject<CandleData[]>();
  private candleSubscription: StompSubscription | null = null;
  private client!: Client;
  private allCandles: CandleData[] = [];

  private readonly URL = 'http://localhost:8080/getAllCandles';

  getAllCandles(): Observable<CandleData[]> {
    return this.candlesSubject.asObservable();
  }

  constructor() {
    this.initWebSocket();
    this.loadInitialCandles();
  }

  private async loadInitialCandles(): Promise<void> {
    try {
      const response = await fetch(this.URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      this.allCandles = this.transformApiData(data);

      this.candlesSubject.next(this.allCandles);

    } catch (error) {
      console.error('Error loading initial candles:', error);
    }
  }

  private initWebSocket(): void {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('Connected to WebSocket');

        this.candleSubscription = this.client.subscribe('/topic/candles', (message) => {
          const newCandles: CandleData[] = JSON.parse(message.body);

          this.allCandles.push(...newCandles);

          this.candlesSubject.next(this.allCandles);
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      }
    });

    this.client.activate();
  }
  private transformApiData(apiData: any[]): CandleData[] {
    if (!Array.isArray(apiData) || apiData.length === 0) return [];

    return apiData.map(item => ({
      time: item.time as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      timeFrame: item.timeFrame,
    }));
  }

  disconnect(): void {
    this.candleSubscription?.unsubscribe();
    this.client.deactivate();
  }
}

// private readonly URL = 'http://localhost:8080/getAllCandles';

// async getCandles(): Promise<CandleData[]> {
//   try {
//     const response = await fetch(this.URL);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return this.transformApiData(data);

//   } catch (error) {
//     console.error('Error fetching candles:', error);
//     throw error;
//   }
// }

// private transformApiData(apiData: any[]): CandleData[] {
//   if (!Array.isArray(apiData) || apiData.length === 0) {
//     return [];
//   }

//   return apiData.map(item => ({
//     time: item.time as Time,
//     open: item.open,
//     high: item.high,
//     low: item.low,
//     close: item.close,
//     timeFrame: item.timeFrame,
//   }));
// }