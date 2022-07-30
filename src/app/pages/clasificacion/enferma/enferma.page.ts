import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { SanaService } from 'src/app/services/sana.service';
import { EnfermaService } from 'src/app/services/enferma.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(
    private sanaService: SanaService,
    private imageService: ImageService,
    private enfermaService: EnfermaService,
    private router: Router,
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
      console.log(a['descripcion_tratamiento']);
      this.presentToast(a['descripcion_tratamiento']);
      break;
    } 
  }
//console.log(this.tratamientos[0]);
}

print(event) {
  console.log('Selected value: ', this.radioValue);
}

  //guardar
  guardar(){
    console.log(this.tratamientos[0]);
    //this.router.navigate(['tabs']);
  }
  //mensaje
  async presentToast(msj) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }

}
