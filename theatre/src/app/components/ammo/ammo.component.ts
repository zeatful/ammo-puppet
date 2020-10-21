import { AmmoService } from './../../services/ammo.service';
import { Component, OnInit} from '@angular/core';
import { interval, Subscription } from 'rxjs';

export interface AmmoElement {  
  id: string;
  availability: boolean;
  count: string;
  price: string;
  url: string;
  found: string;
  caliber: string;
  grain: string;
  model: string;  
}

@Component({
  selector: 'app-ammo',
  templateUrl: './ammo.component.html',
  styleUrls: ['./ammo.component.css']
})
export class AmmoComponent implements OnInit {
  displayedColumns: string[] = ['model', 'caliber', 'grain', 'count', 'price', 'url', 'availability', 'found'];
  dataSource;
  subscription: Subscription;

  source = interval(300000);
  
  constructor(private ammoService: AmmoService) {
    this.subscription = this.source.subscribe(val => this.fetchAmmo());
  }

  fetchAmmo() {
    this.dataSource = this.ammoService.fetchAmmo();
  }

  ngOnInit(): void {
    this.fetchAmmo();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}