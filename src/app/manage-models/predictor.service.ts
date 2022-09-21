import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredictorService {

  constructor(private http:HttpClient) { }

  getPrediction(predictionName: string): Observable<any> {
    const url: string = environment.baseUrl_manage + 'prediction/' + predictionName;
    return this.http.get(url);
  }
  getPredictionList(): Observable<any> {
    const url: string = environment.baseUrl_manage + 'predictions';
    return this.http.get(url);
  }
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
  return this.http.put(url,formData);
  }

  predictInputList(profileName:string,smiles:any,name:string,endpoints:any,versions:any){
    const formData = new FormData();
    formData.append("smiles_list",smiles)
    formData.append("name",name)
    formData.append("endpoints",endpoints)
    formData.append("versions",versions)
    const url: string = environment.baseUrl_predict + 'profile/profileName/' + profileName +'/smiles_list'
    return this.http.put(url,formData)
    
  }
  getBasketList(): Observable<any>{
    const url = environment.baseUrl_manage + "baskets"
    return this.http.get(url);
  }

  getBasket(num): Observable<any> {
    const url = environment.baseUrl_manage + "basket/"+ num
    return this.http.get(url);
  }
  deleteCollection(name: string){
    const url = environment.baseUrl_manage + "collection/"+name
    return this.http.delete(url); 

  }

  collection(name:string,endpoints,versions){
    const url = environment.baseUrl_manage + "collection/"+name
    const formData = new FormData();
    formData.append("endpoints",endpoints)
    formData.append("versions",versions)
    return this.http.put(url,formData)
  }
  getCollections(): Observable<any> {
    const url = environment.baseUrl_manage + "collections"
    return this.http.get(url);
  }
  
}