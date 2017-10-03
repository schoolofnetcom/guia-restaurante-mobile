import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppHttpService {
    protected url: string;
    protected header: Headers;

    constructor (protected http: Http, private alertCtrl: AlertController, public eventEmitter: Events) {
        this.setAccessToken();
    }

    request() {
        return this.http;
    }

    setAccessToken () {
        let token = this.getCookie('token');
        this.header = new Headers({'Authorization': 'Bearer ' + token, 'Accept': 'application/json'});
    }

    builder (resource: string) {
        this.url = 'https://shrouded-crag-34278.herokuapp.com/api/v1/' + resource;
        return this;
    }

    list (options: any = {}) {
        let url = this.url;

        if (options.filters !== undefined) {
            let filters = options.filters;
            filters.forEach((item, index) => {  
                let field = Object.keys(item)[0];
                let value = item[field];
                url = url + '?where[' + field + ']=' + value;
            });
        }

        let observable = this.http.get(url, {headers: this.header})
        return this.toPromise(observable);
    }

    view (id: number) {
        let observable = this.http.get(this.url + '/' + id, {headers: this.header})
        return this.toPromise(observable);
    }

    update(id: number, data: object) {
        let observable = this.http.put(this.url + '/' + id, data, {headers: this.header})
        return this.toPromise(observable);
    }

    insert (data: Object) {
        let observable = this.http.post(this.url, data, {headers: this.header})
        return this.toPromise(observable);
    }

    delete (id: number) {
        let observable = this.http.delete(this.url + '/' + id, {headers: this.header});
        return this.toPromise(observable);
    }

    protected toPromise(request) {
        return request.toPromise()
            .then((res) => {
                return res.json() || {}
            })
            .catch((err) => {
                let message = 'Algo deu errado no servidor, informe o erro ' + err.status + ' ao administrador';
                if (err.status === 401) {
                    message = 'Você não tem permissão para ver isso, informe um usuário e senha válidos';
                    this.eventEmitter.publish('user');
                }

                if (err.status === 422) {
                    message = 'Falha de validação, verifique os campos';
                }

                if (err.status === 404) {
                    message = 'Impossível se conectar ao servidor, verifique sua conexão ou tente novamente em alguns minutos';
                }

                this.showAlert(message);

                return err;
            });
    }

    public getCookie(name: string) {
        let cookies = document.cookie;
        if (!cookies) {
            return null;
        }

        let cookiesCollection: string[] = cookies.split(';');
        for(let i= 0; i < cookiesCollection.length; i++) {
            let cookieCurrent = cookiesCollection[i].split('=');

            if (cookieCurrent[0].trim() === name) {
                return cookieCurrent[1] || null;
            }
        }

        return null;
    }

    protected showAlert(message) {
        let prompt = this.alertCtrl.create({
            title: 'Algo deu errado',
            message: message,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                        console.log('Btn "ok" in Alert control clicked')
                    }
                }
            ]
        });
        prompt.present();
    }
}