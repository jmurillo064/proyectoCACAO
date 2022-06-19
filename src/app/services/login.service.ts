import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validarLogin(cedula:string, clave:string) {
    let  url = 'https://shrouded-gorge-69430.herokuapp.com/api/login/'+cedula+'/'+clave;
    return new Promise ((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

}
