import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Client, StompSubscription } from '@stomp/stompjs';

export interface Order {
  id: number;
  price: number;
  typeOrder: number;
  quantity: number;
  time: String;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersBook {
  private bidsSubject = new Subject<Order[]>();
  private asksSubject = new Subject<Order[]>();
  private client: Client;
  private bidsSubscription: StompSubscription | null = null;
  private asksSubscription: StompSubscription | null = null;

  getBidsUpdates(): Observable<Order[]> {
    return this.bidsSubject.asObservable();
  }

  getAsksUpdates(): Observable<Order[]> {
    return this.asksSubject.asObservable();
  }

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('Connected to WebSocket');

        this.bidsSubscription = this.client.subscribe('/topic/bids', (message) => {
          this.bidsSubject.next(JSON.parse(message.body));
        });

        this.asksSubscription = this.client.subscribe('/topic/asks', (message) => {
          this.asksSubject.next(JSON.parse(message.body));
        });
      },

      onStompError: (frame) => {
        console.error('STOMP error: ', frame.headers['message']);
        console.error('Details: ', frame.body);
      },

      onWebSocketError: (error) => {
        console.error('WebSocket error: ', error);
      },

      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },

      debug: (str) => {
        console.log('STOMP Debug: ' + str);
      }
    });

    this.client.activate();
  }

  disconnect(): void {
    this.bidsSubscription?.unsubscribe();
    this.asksSubscription?.unsubscribe();
    this.client?.deactivate();
  }
}



// connect(): void {
//   this.stompClient = new Client({
//     brokerURL: 'ws://localhost:8080/market-websocket',

//     onConnect: (frame) => {
//       console.log('Connected: ', frame);

// this.bidsSubscription = this.stompClient!.subscribe('/orders/bids', (message) => {
//   this.bidsSubject.next(JSON.parse(message.body));
// });

// this.asksSubscription = this.stompClient!.subscribe('/orders/asks', (message) => {
//   this.asksSubject.next(JSON.parse(message.body));
// });
//     },

//     onStompError: (frame) => {
//       console.error('STOMP error: ', frame);
//     },

//     onWebSocketError: (error) => {
//       console.error('WebSocket error: ', error);
//     }
//   });

//   this.stompClient.activate();
// }

// disconnect(): void {
//   this.bidsSubscription?.unsubscribe();
//   this.asksSubscription?.unsubscribe();
//   this.stompClient?.deactivate();
// }