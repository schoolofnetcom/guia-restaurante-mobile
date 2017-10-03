import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppHttpService } from './app-http.service';

import { ProfileComponent } from '../user/components/profile.component';
import { PasswordComponent } from '../user/components/password.component';
import { LoginComponent } from '../user/components/login.component';
import { LogoutComponent } from '../user/components/logout.component';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private appHttpService: AppHttpService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Perfil', component: ProfileComponent },
      { title: 'Senha', component: PasswordComponent },
      { title: 'Login', component: LoginComponent },
      { title: 'Logout', component: LogoutComponent },
    ];

  }

  ngOnInit() {
    this.appHttpService.eventEmitter.subscribe('user', () => {
      this.nav.push(LoginComponent);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
