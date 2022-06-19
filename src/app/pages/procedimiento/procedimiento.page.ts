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

  imgURL: string;

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
      targetWidth: 100,
      targetHeight: 100,
      saveToPhotoAlbum: false
    }
    
    this.camera.getPicture(options)
    .then((imageData) => {
      this.imgURL='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  subirFoto(){
    const options: CameraOptions = {
      quality : 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
    }
    
    this.camera.getPicture(options)
    .then((imageData) => {
      this.imgURL='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

}
