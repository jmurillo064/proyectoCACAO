import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredecirService {

  constructor(private http: HttpClient) { }

  predecirMonillia(data: any){
    let  url = 'http://pamelacb.pythonanywhere.com/predecir';
    var formData = new FormData(); 
    formData.append('base64img',data.base64img);
    let params = new HttpParams();
    params.append('base64img',data.base64img);
    return new Promise((resolve, reject) => {
      this.http.post(url,JSON.stringify(data)).subscribe(res => { 
      resolve(res);
        }, error => { 
          reject(error);
        });
    })
  }

  Post_Imagen(data:any) {
    let  url = 'https://shrouded-gorge-69430.herokuapp.com/api/Imagenes';
    var formData = new FormData();
    formData.append('nombre_imagen', data.nombre_imagen);
    return new Promise ((resolve, reject) => {
      this.http.post(url, formData ).subscribe(res => {
        resolve(res);{
        }
      }, error => {
        reject(error);
      });
    });
  }

  guardarTratamientosP(data: any){
    let  url = 'https://shrouded-gorge-69430.herokuapp.com/api/AnalisisTratamiento';
    var formData = new FormData(); 
    formData.append('id_usuario',data.id_usuario);
    formData.append('id_parcela',data.id_parcela);
    formData.append('id_tratamiento',data.id_tratamiento);
    formData.append('fase2',data.fase2);
    formData.append('prescripcion_tratamiento',data.prescripcion_tratamiento);
    formData.append('observacion_tratamiento',data.observacion_tratamiento);
    return new Promise((resolve, reject) => {
      this.http.post(url,formData).subscribe(res => { 
      resolve(res);
        }, error => { 
          reject(error);
        });
    })
  }
}
