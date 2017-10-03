import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    user: Object = {}

    constructor(private authService: AuthService, private alertCtrl: AlertController) {}

    ngOnInit () {
        this.authService.getUser()
            .then((user: any) => {
                this.user = user;
            })
    }

    save() {
        this.authService.builder().editProfile(this.user)
            .then(() => {
                this.showAlert('Salvo com sucesso');
            })
    }
    
    private showAlert(message)
    {
        let prompt = this.alertCtrl.create({
            title: 'Verifique seus dados',
            message: message,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        console.log('clicked');
                    }
                }
            ]
        });
        prompt.present();
    }
}