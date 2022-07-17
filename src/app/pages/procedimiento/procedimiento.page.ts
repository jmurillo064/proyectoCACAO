import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PredecirService } from 'src/app/services/predecir.service';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
//import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-procedimiento',
  templateUrl: './procedimiento.page.html',
  styleUrls: ['./procedimiento.page.scss'],
})
export class ProcedimientoPage implements OnInit {

  imgURL: any;
  nombre: any;
  Imagen_U;

  constructor(public toastController: ToastController, private camera: Camera, private router: Router, public alertController: AlertController, private predecirService:PredecirService) { }

  ngOnInit() {
  }

  public onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      
      let tipoImagen = event.target.files[0].type;
      if( tipoImagen == "image/jpeg"  || tipoImagen == "image/png" || tipoImagen == "image/jpg"){

        this.Imagen_U = event.target.files[0];
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          this.imgURL = event.target.result;
        }
      
      }else{
        Swal.fire({
          icon: 'error',
          title: '¡No es una Imagen..!',
          text: 'Selecciones una imagen con formato jpg/jpeg/png.',
          confirmButtonColor: '#f86c6b'
        })
        this.Imagen_U = "";
      }
      
    }
  }

  GuardarImagen(){
    
        let dataI={
          "nombre_imagen":this.Imagen_U,
        }
        this.predecirService.Post_Imagen(dataI).then(dataIR =>{

        }).catch(error =>{
          console.log(error);
        });
      }

  procesarImg(){
    var dataToSend = {base64img:this.nombre,}

    this.predecirService.predecirMonillia(dataToSend).then(data => {
      this.mensaje(data['Descripción']);
    }).catch(error =>{
      this.mensaje("Hubo muchos errores");
    });
  }

  async mensaje(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000
    });
    toast.present();
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

  // async tomarFoto(){
  //     const image = await Camera.getPhoto({
  //       quality: 100,
  //       allowEditing: true,
  //       resultType: CameraResultType.Uri,
  //       source: CameraSource.Camera
  //     });
    
  //     image.webPath will contain a path that can be set as an image src.
  //     You can access the original file using image.path, which can be
  //     passed to the Filesystem API to read the raw data of the image,
  //     if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  //     this.imgURL = image.webPath;
  //   };
  

    // async subirFoto(){
    // const image = await Camera.getPhoto({
    //   quality: 100,
    //   allowEditing: false,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Photos
    //   });
    
      
    //   this.imgURL =  image.dataUrl;
    // };
  

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
      this.nombre = imageData;
      this.Imagen_U=this.nombre;
      this.imgURL='data:image/jpeg;base64,' + imageData;
      this.onSelectFile(event);
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
      this.nombre = imageData;
      this.imgURL='data:image/jpeg;base64,' + imageData;
    }, (err) => {
      this.presentAlert(err);
    });
  }

}

