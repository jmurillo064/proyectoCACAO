import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-procedimiento',
  templateUrl: './procedimiento.page.html',
  styleUrls: ['./procedimiento.page.scss'],
})
export class ProcedimientoPage implements OnInit {

  imgURL: any;
  base;

  constructor(private camera: Camera, private router: Router, public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'SALIR',
      message: '¿Deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Salir',
          id: 'confirm-button',
          handler: () => {
            this.router.navigate(['login']);
          }
        }
      ]
    });

    await alert.present();
  }

  salir(){
    this.presentAlertConfirm();
  }

  tomarFoto(){
    const options: CameraOptions = {
      // quality: 100,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,
      // mediaType: this.camera.MediaType.PICTURE
      quality : 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,

    }
    
    this.camera.getPicture(options)
    .then((imageData) => {
      this.base = imageData;
      this.imgURL='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  async presentAlert(err) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      subHeader: 'Campos inválidos!!!',
      message: err,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  subirFoto(){
    const options2: CameraOptions = {
      quality : 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    
    this.camera.getPicture(options2)
    .then((imageData) => {
      this.imgURL='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.presentAlert(err);
    });
  }

}
