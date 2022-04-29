import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictorService {

  constructor(private http:HttpClient) { }

  predictInputFile(profileName: string, file: any, endpoints: any,versions: any ): Observable<any> {

    const formData = new FormData();
    formData.append('SDF', file);
    formData.append('endpoints', endpoints);
    formData.append('versions',versions);
    const url: string = environment.baseUrl_predict + 'profile/profileName/' +profileName;
    return this.http.put(url, formData);

  }

 predictSketchStructure(profileName: string,smiles: string,name:string, endpoints:any,versions:any){

  const formData = new FormData();
  formData.append('SMILES',smiles);
  formData.append('name',name);
  formData.append('endpoints',endpoints);
  formData.append('versions',versions);
  const url: string = environment.baseUrl_predict + 'profile/profileName/' + profileName + '/smiles';
  return this.http.put(url,formData)


  }


profileSummary(profileName: string){
  const url = environment.baseUrl_manage + 'profile/'+profileName+'/summary';
  return this.http.get(url)

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