import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictorService {

  constructor(private http:HttpClient) { }

  predict(modelName: string, version: string, file: any, predictionName: string): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', file);
    const url: string = environment.baseUrl_predict + 'model/' + modelName + '/version/' + version + '/predictionName/' + predictionName;
    return this.http.put(url, formData);

  }



  getBasketList(): Observable<any>{
    const url = environment.baseUrl_manage + "baskets"
    return this.http.get(url)
  }

  getBasket(num): Observable<any> {
    const url = environment.baseUrl_manage + "basket/"+ num
    return this.http.get(url)
  }
  
}