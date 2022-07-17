import { Component, OnInit } from '@angular/core';
import { SanaService } from 'src/app/services/sana.service';

@Component({
  selector: 'app-sana',
  templateUrl: './sana.page.html',
  styleUrls: ['./sana.page.scss'],
})
export class SanaPage implements OnInit {

  parcelas: any;

  constructor(private sanaService: SanaService) { }

  ngOnInit() {
    this.sanaService.obtenerParcelas().then(data => {
      if(data['code'] == "204"){
        console.log("Sin datos");
      }else{
        // data['data'].forEach(element => {
        //   this.parcelas.push(element['nombre_parcela']);
        // });
        this.parcelas = data['data'];
      }
    }).catch(error =>{
        console.log(error);
      });
  }

}
