import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@Component({
    selector: 'logout-dashboard',
    template: ''
})
export class LogoutComponent implements OnInit {

    constructor( private navCtrl: NavController, private authService: AuthService) {}

    ngOnInit() {
        this.authService.builder().logout()
            .then(() => {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:01 GMT";
                this.navCtrl.setRoot(HomePage);
            });
    }
}