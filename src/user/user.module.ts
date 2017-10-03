import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicErrorHandler } from 'ionic-angular';

import { PasswordComponent } from './components/password.component';
import { ProfileComponent } from './components/profile.component';
import { LoginComponent } from './components/login.component';
import { LogoutComponent } from './components/logout.component';

import { AuthService } from './services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    declarations: [
        PasswordComponent,
        ProfileComponent,
        LoginComponent,
        LogoutComponent
    ],
    entryComponents: [
        PasswordComponent,
        ProfileComponent,
        LoginComponent,
        LogoutComponent
    ],
    providers: [
        AuthService,
        {provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class UserModule {}