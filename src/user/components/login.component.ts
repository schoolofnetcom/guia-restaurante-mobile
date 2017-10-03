import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        #loginForm {
            margin-top: 50px;
        }
    `]
})
export class LoginComponent {
    user: any = {
        username: null,
        password: null,
    };

    constructor(private AuthService: AuthService, private alertCtrl: AlertController, private navCtrl: NavController) {}

    login() {
        if (!this.user.username || !this.user.password) {
            this.showAlert();
            return;
        }

        let data = {
            grant_type: 'password',
            client_id: '1',
            client_secret: 'ij9w0GDsMrmsZC2K5Cmu7XkGiinfCRKNJdfiux09',
            username: this.user.username,
            password: this.user.password,
            scope: ''
        };

        this.AuthService.login(data).then((res) => {
            document.cookie = "token=" + res.access_token + "; expires=" + res.expires_in;
            this.AuthService.setAccessToken();
            this.navCtrl.setRoot(HomePage);
        })
    }

    private showAlert()
    {
        let prompt = this.alertCtrl.create({
            title: 'Verifique seus dados',
            message: 'Preencha o email e a senha',
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