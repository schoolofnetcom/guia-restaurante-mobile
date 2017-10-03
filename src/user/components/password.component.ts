import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html'
})
export class PasswordComponent{
    constructor(private authservice: AuthService, private alertCtrl: AlertController) {}

    user: any = {
        password: null,
        password_confirmation:null
    }

    save() {
        if (this.user.password && this.user.password === this.user.password_confirmation) {
            this.authservice.builder().changePassword(this.user)
                .then(() => {
                    this.showAlert('Salvo cm sucesso');
                });
        } else {
            this.showAlert('Verifique a senha');
        }
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