import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrdersBook } from '../../services/orders-book';
import { from, Subscription } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Random } from '../../services/random';

@Component({
  selector: 'app-order-book',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './order-book.html',
  styleUrl: './order-book.scss',
})
export class OrderBook implements OnInit, OnDestroy {
  ordersBids: Order[] = [];
  ordersAsks: Order[] = [];

  private bidsSubscription?: Subscription;
  private asksSubscription?: Subscription;
  private intervalId?: any;

  intervalControl = new FormControl(1000); // Intervalo inicial de 1000ms
  isAutoSending = false;
  readonly MIN_INTERVAL = 2; // Mínimo 2ms

  constructor(
    private orders: OrdersBook,
    private cdr: ChangeDetectorRef,
    private randomService: Random
  ) { }

  ngOnInit() {
    this.bidsSubscription = this.orders.getBidsUpdates().subscribe(bids => {
      this.ordersBids = [...bids];
      this.cdr.detectChanges();
    });

    this.asksSubscription = this.orders.getAsksUpdates().subscribe(asks => {
      this.ordersAsks = [...asks];
      this.cdr.detectChanges();
    });
  }

  sendRandomRequest() {
    this.randomService.sendRequestRandom().subscribe({
      error: (error) => {
        console.error('Error sending random request:', error);
      }
    });
  }

  toggleAutoSend() {
    if (this.isAutoSending) {
      this.stopAutoSend();
    } else {
      this.startAutoSend();
    }
  }

  startAutoSend() {
    const interval = Math.max(this.intervalControl.value || this.MIN_INTERVAL, this.MIN_INTERVAL);
    this.isAutoSending = true;

    this.intervalId = setInterval(() => {
      this.sendRandomRequest();
    }, interval);
  }

  stopAutoSend() {
    this.isAutoSending = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  updateInterval() {
    if (this.isAutoSending) {
      this.stopAutoSend();
      this.startAutoSend();
    }
  }

  ngOnDestroy() {
    this.bidsSubscription?.unsubscribe();
    this.asksSubscription?.unsubscribe();
    this.stopAutoSend();
  }
}