import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { FullGraphic } from './pages/full-graphic/full-graphic';
import { OrderBook } from './pages/order-book/order-book';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'About', component: About },
    { path: 'Graphic', component: FullGraphic },
    { path: 'OrderBook', component: OrderBook },
    { path: '**', redirectTo: '' }
];
