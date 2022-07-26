import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { PredecirService } from 'src/app/services/predecir.service';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ImageService } from '../../services/image.service';
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

  constructor(
    public toastController: ToastController, 
    private camera: Camera, 
    private router: Router, 
    public alertController: AlertController, 
    private predecirService:PredecirService,
    private loadingCtrl: LoadingController,
    private imageService: ImageService
    ) { }

  ngOnInit() {
    this.imgURL = "";
    this.nombre = "";
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

  async procesarImg(){
    let dataToSend = {base64img:this.nombre}
    //console.log(this.nombre);
    const loading = await this.loadingCtrl.create({
      message: 'Procesando imagen...',
    });
    await loading.present();

    this.predecirService.predecirMonillia(dataToSend).then(data => {
      
      loading.dismiss();
      let color;
      //enviar imagen y estado
      let resultado = {
        estado: data['Descripción'],
        imgB64: this.imgURL
      }
      this.imageService.senObjectSource(resultado);

      if(data['Descripción']==='SANA'){
        color='success';
        this.router.navigate(['sana']);
      }else{
        color='danger';
        this.router.navigate(['enferma']);
      }
      this.mensaje('El estado de la imagen es: '+data['Descripción'], color);
    }).catch(error =>{
      loading.dismiss();
      this.mensaje("Hubo muchos errores",'warning');
      this.presentAlert(error.message);
    });
  }

  async mensaje(msj: string, colors: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      color: colors,
      position: 'middle'
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

  tomarFoto(){
    const options: CameraOptions = {
      quality : 100,
      destinationType : this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true,
      targetHeight: 250,
      targetWidth: 250
    }
    
    this.camera.getPicture(options)
    .then((imageData) => {
      this.nombre = imageData;
      this.Imagen_U=this.nombre;
      this.imgURL='data:image/jpeg;base64,' + imageData;
      this.procesarImg();
    }, (err) => {
      this.presentAlert(err.data);
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
      targetHeight: 250,
      targetWidth: 250
    }
    this.camera.getPicture(options2)
    .then((imageData) => {
      this.nombre = imageData;
      this.imgURL='data:image/jpeg;base64,' + imageData;
      this.procesarImg();
    }, (err) => {
      this.presentAlert(err.data);
    });
  }

}

