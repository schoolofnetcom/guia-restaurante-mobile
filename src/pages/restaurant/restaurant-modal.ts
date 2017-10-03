import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppHttpService } from '../../app/app-http.service';

@Component({
    template: `
    <ion-header>
        <ion-navbar>
            <button ion-button menuToggle (click)="back()">
                <ion-icon name="md-arrow-round-back"></ion-icon>
            </button>
            <ion-title>Voltar</ion-title>
        </ion-navbar>
    </ion-header>
    <ion-content>
        <p>Por favor, diga o que achou deste restaurante</p>
        <ion-select [(ngModel)]="vote.points">
            <ion-option value="" disabled selected>Quantas estrelas este restaurante vale?</ion-option>
            <ion-option value="1">1 estrela - Péssimo</ion-option>
            <ion-option value="2">2 estrela - Ruim</ion-option>
            <ion-option value="3">3 estrela - Bom</ion-option>
            <ion-option value="4">4 estrela - Ótimo</ion-option>
            <ion-option value="5">5 estrela - Excelente</ion-option>
        </ion-select>
        <div class="input-field">
            <ion-item>
                <ion-label fixed>Envie sua opinião</ion-label>
                <ion-input type="text" value="" [(ngModel)]="vote.comment"></ion-input>
            </ion-item>
        </div>

        <button ion-button (click)="sendVote()">Avaliar</button>
    </ion-content>
    `
})
export class RestaurantModal {

    vote: any = {points: '', comment: ''};

    constructor(
        private navCtrl: NavController,
        private params: NavParams,
        private appHttpService: AppHttpService
    ) {}

    sendVote() {
        let id = this.params.get('id');

        this.navCtrl.pop();
        this.vote.restaurant_id = id;
        this.appHttpService.builder('restaurants/vote')
            .insert(this.vote)
            .then(() => {
                this.vote = {points: '', comment: ''};
            })
    }

    back() {
        this.navCtrl.pop();
    }
}