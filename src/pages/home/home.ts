import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppHttpService } from '../../app/app-http.service';
import { Geolocation } from '@ionic-native/geolocation';

import { RestaurantPage } from '../restaurant/restaurant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  address: string;
  restaurants: any[] = [];
  status: string;
  list = [];

  constructor(
    public navCtrl: NavController,
    private appHttpService: AppHttpService,
    private geolocation: Geolocation,
  ) {}

  ngOnInit() {
    let coords = JSON.parse(window.localStorage.getItem('coords')) || null;
    coords = {
      latitude: -23.6194693,
      longitude: -45.4096306
    };
    if (coords) {
      this.makeRequest(coords);
    }

    let options = {
      enableHighAccuracy: true,
      imeout: 5000,
      maximumAge: 0
    };
    this.geolocation.getCurrentPosition(options).then((res) => {
      coords = {
        latitude: res.coords.latitude,
        longitude: res.coords.longitude
      }
      window.localStorage.setItem('coords', JSON.stringify(coords));
      this.makeRequest(coords);
    })

    let list = window.localStorage.getItem('list') || '[]';
    this.list = JSON.parse(list);
  }

  protected makeRequest(coords) {
    console.log(coords);
    this.appHttpService.builder('restaurants/by-coords?latitude=' + coords.latitude + '&longitude=' + coords.longitude)
      .list()
      .then((res) => {
        console.log(res);
        this.restaurants = res.restaurants;
        this.status = res.status;
      })
  }

  touch(data) {
    this.navCtrl.push(RestaurantPage, {
      id: data.restaurant.id
    })
  }

}
