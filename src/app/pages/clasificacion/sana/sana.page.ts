import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { SanaService } from 'src/app/services/sana.service';

import { Router } from '@angular/router';
import { PredecirService } from 'src/app/services/predecir.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sana',
  templateUrl: './sana.page.html',
  styleUrls: ['./sana.page.scss'],
})
export class SanaPage implements OnInit {

  parcelas: any;
  imgURL: any;
  estado: any;
  // Seleccionamos o iniciamos el valor '0' del <select>
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  //para bd
  tratamientoBd= 4;
  parcelaBd: any;
  observacionBd: any;
  prescripcionBd: any;
  estadoBd=0;

  constructor(
    private sanaService: SanaService,
    private imageService: ImageService,
    private router: Router, 
    private predecirService: PredecirService,
    public toastController: ToastController
    ) { }

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
  }

  //guardar
  guardar(){
    if(this.verSeleccion==undefined || this.verSeleccion==""){
      this.presentToast("Datos incompletos.","danger");
    }else{
      var user = JSON.parse(localStorage.getItem('ingresado'));
      //let user = localStorage.getItem('ingresado');
      let array = {
        "id_usuario": user.data['id_usuario'],
        "id_parcela":this.verSeleccion,
        "id_tratamiento":this.tratamientoBd,
        "fase2":this.estadoBd,
        "prescripcion_tratamiento":this.prescripcionBd,
        "observacion_tratamiento":this.observacionBd
      }
      console.log(array);
      this.predecirService.guardarTratamientosP(array).then(data =>{
        if(data['code']==200){
          this.presentToast("Datos guardados.","success");
          
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
