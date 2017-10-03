import { Component } from '@angular/core';
import { AppHttpService } from '../../app/app-http.service';
import { ModalController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { RestaurantModal } from './restaurant-modal';
import { AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

@Component({
  selector: 'restaurant-descrition',
  templateUrl: 'restaurant.html'
})
export class RestaurantPage {
  id: number;
  restaurant: any = {};
  dishes: any = {data:[]};
  photos: any = [];
  modal: any;

  constructor(
    private appHttpService: AppHttpService,
    private navParams: NavParams,
    private callNumber: CallNumber,
    private photoViewer: PhotoViewer,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private file: File,
    private transfer: FileTransfer
  ) {}

  ngOnInit() {
    let id = this.navParams.get('id');
    let list: any = window.localStorage.getItem('list') || null;
    list = JSON.parse(list);

    if (list) {
      let data = list.find((element) => {
        return element.restaurant.id === id;
      });

      if (data) {
        this.restaurant = data.restaurant;
        this.dishes = data.dishes;
        this.photos = data.photos;
      }
    } else {
      let options = {
        filter: {
          restaurant_id: id
        }
      };
  
      this.appHttpService.builder('restaurants')
        .view(id).then(res => {
          this.restaurant = res;
          this.modal = this.modalCtrl.create(RestaurantModal, {id: res.id});
        });
  
      this.appHttpService.builder('dishes')
        .list(options).then(res => {
          this.dishes = res;
        })
  
      this.appHttpService.builder('restaurants/' + id + '/photos')
        .list().then(res => {
          this.photos = res;
        })
    }
  }

  makeCall() {
    this.callNumber.callNumber(this.restaurant.phone, false).then((res) => {
      console.log(res);
    });
  }

  showImage(url) {
    this.photoViewer.show(url, this.restaurant.title, {share: true});
  }

  addVote() {
    this.modal.present();
  }

  classToVotes(vote) {
    if (this.restaurant.points >= vote) {
      return 'star';
    }
    return 'star-outline';
  }

  addList() {
    let prompt = this.alertCtrl.create({
      title: 'Adicionando aos favoritos',
      message: 'Você tem certeza que quer adicionar este restaurante a sua lista de favoritos? Ele ficará disponívek offline!',
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.addListConfirm();
          }
        },
        {
          text: 'Cancelar',
          handler: data => {
            this.addListCancel();
          }
        }
      ]
    });
    prompt.present();
  }

  async addListConfirm() {
    let fileTransfer = this.transfer.create();

    if (this.restaurant.photo_full_url) {
      let photo_full_url = await this.saveImage(fileTransfer, this.restaurant.photo_full_url);
      this.restaurant.photo_full_url = photo_full_url.toURL();
    }

    await Promise.all(this.dishes.data.map(async (element, key) => {
      let image_url = await this.saveImage(fileTransfer, element.photo_full_url);
      this.dishes.data[key].photo_full_url = image_url.toURL();
    }));

    await Promise.all(this.photos.map(async (element, key) => {
      let image_url = await this.saveImage(fileTransfer, element.full_url);
      this.photos[key].full_url = image_url.toURL();
    }));

    let list: any = window.localStorage.getItem('list') || '[]';
    list = JSON.parse(list);
    list.push({
      restaurant: this.restaurant,
      dishes: this.dishes,
      photos: this.photos,
    });

    let listoToStorage = JSON.stringify(list);
    window.localStorage.setItem('list', listoToStorage);
  }

  addListCancel() {
    console.log('ok, cancelado, não faremos nada');
  }

  protected saveImage(fileTransfer, url) {
    let fileName = url.split('/');
    fileName = fileName.slice(-1).pop();
    return fileTransfer.download(url, this.file.dataDirectory + fileName);
  }
}
