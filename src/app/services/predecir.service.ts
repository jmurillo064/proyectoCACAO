import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PredecirService {

  constructor(private http: HttpClient) { }

  predecirMonillia(data: any){
    let  url = 'http://jmurillo064.pythonanywhere.com/predecir';
    var formData = new FormData(); 
    formData.append('base64img',data.nombre);
    return new Promise((resolve, reject) => {
      this.http.post(url,formData).subscribe(res => { 
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
}
