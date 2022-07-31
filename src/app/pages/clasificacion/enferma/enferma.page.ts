import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { SanaService } from 'src/app/services/sana.service';
import { EnfermaService } from 'src/app/services/enferma.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PredecirService } from 'src/app/services/predecir.service';

@Component({
  selector: 'app-enferma',
  templateUrl: './enferma.page.html',
  styleUrls: ['./enferma.page.scss'],
})
export class EnfermaPage implements OnInit {

  parcelas: any;
  tratamientos: any;
  imgURL: any;
  estado: any;
  radioValue;
  //datos
  // Seleccionamos o iniciamos el valor '0' del <select>
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  //para bd
  tratamientoBd: any;
  parcelaBd: any;
  observacionBd: any;
  prescripcionBd: any;
  estadoBd=1;

  constructor(
    private sanaService: SanaService,
    private imageService: ImageService,
    private enfermaService: EnfermaService,
    private router: Router,
    public toastController: ToastController,
    public alertController: AlertController, 
    private predecirService: PredecirService
    ) { }

    capturar() {
      // Pasamos el valor seleccionado a la variable verSeleccion
      this.verSeleccion = this.opcionSeleccionado;
    }

  ngOnInit() {
    //parcelas
    this.sanaService.obtenerParcelas().then(data => {
      if(data['code'] == "204"){
        console.log("Sin datos");
      }else{
        this.parcelas = data['data'];
      }
    }).catch(error =>{
      console.log(error);
    });

    //imagen
    this.imageService.$getObjectSource.subscribe(data =>{
      this.imgURL = data['imgB64'];
      this.estado = data['estado']
    }).unsubscribe();

    //tratamientos
    this.enfermaService.obtenerTratamiento().then(data =>{
      if(data['code'] != "200"){
        console.log("Sin datos");
      }else{
        this.tratamientos = data['data'];
      }
    }).catch(error =>{
      console.log(error);
    });
  }

  //enferma-routing.module.ts
  //function to print what is inputed in the form that is declared above
checkValue(event) { 
  console.log(event.detail.value);

  for (let a of this.tratamientos) {
    if (a['tipo_tratamiento']==this.radioValue){
      this.tratamientoBd = a;
      this.presentAlert(a['descripcion_tratamiento'],a['tipo_tratamiento']);
      break;
    } 
  }
//console.log(this.tratamientos[0]);
}

async presentAlert(msj, trata) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Procedimiento',
    subHeader: "Tratamiento: "+trata,
    message: msj,
    buttons: ['OK'],
  });

  await alert.present();

  const { role } = await alert.onDidDismiss();
  console.log('onDidDismiss resolved with role', role);
}

print(event) {
  console.log('Selected value: ', this.radioValue);
}

  //guardar
  guardar(){
    if(this.tratamientoBd==undefined || this.verSeleccion==undefined || this.verSeleccion==""){
      this.presentToast("Datos incompletos!!!","danger");
    }else{
      var user = JSON.parse(localStorage.getItem('ingresado'));
      //let user = localStorage.getItem('ingresado');
      let array = {
        "id_usuario": user.data['id_usuario'],
        "id_parcela":this.verSeleccion,
        "id_tratamiento":this.tratamientoBd['id_tratamiento'],
        "fase2":this.estadoBd,
        "prescripcion_tratamiento":this.prescripcionBd,
        "observacion_tratamiento":this.observacionBd
      }
      console.log(array);
      this.predecirService.guardarTratamientosP(array).then(data =>{
        if(data['code']==200){
          this.presentToast("Datos guardados!!!","success");
          
          this.router.navigate(['/tabs']);
        }
      }).catch(error =>{
        console.log(error);
      });
    }
  }

  //mensaje
  async presentToast(msj, cl) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000,
      color: cl
    });
    toast.present();
  }

}
