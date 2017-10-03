import { Injectable } from '@angular/core';
import { AppHttpService } from '../../app/app-http.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService extends AppHttpService {

    builder (resource: string = '') {
        return super.builder('auth' + resource);
    }

    getUser() {
        return this.builder('/me')
            .list();
    }

    changePassword(data) {
        let observable = this.http.post(this.url + '/change-password', data, {headers: this.header});
        return this.toPromise(observable);
    }

    editProfile(data) {
        let observable = this.http.post(this.url + '/edit-profile', data, {headers: this.header});
        return this.toPromise(observable);
    }

    login(data) {
        let observable = this.http.post('https://shrouded-crag-34278.herokuapp.com' + '/oauth/token', data);
        return this.toPromise(observable).then((res) => {
            this.eventEmitter.publish('user');
            return res;
        });
    }

    logout() {
        let observable = this.http.get(this.url + '/logout', {headers: this.header});
        return this.toPromise(observable).then((res) => {
            this.eventEmitter.publish('user');
            return res;
        });
    }
}