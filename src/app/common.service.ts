import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../environments/environment";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // events implemented to control which compound tab we are in and if the selected compound is valid. 
  currentCompoundTab = new EventEmitter<string>();
  isValidCompound$ = new EventEmitter<boolean>();
  currentSelection$ = new EventEmitter<{}>();

constructor(private http: HttpClient) {}
   /**
   * Retrives the list of all models form the server
   */
    getModelList(): Observable<any> {
      const url: string = environment.baseUrl_manage + "models";
      return this.http.get(url);
    }

    getValidation(model: string, version: string): Observable<any> {
      const url: string =
        environment.baseUrl_manage +
        "model/" +
        model +
        "/version/" +
        version +
        "/validation";
      return this.http.get(url);
    }
    getDocumentation(
      modelName: string,
      modelVersion: string,
      oformat: string
    ): Observable<any> {
      const url: string =
        environment.baseUrl_manage +
        "model/" +
        modelName +
        "/version/" +
        modelVersion +
        "/oformat/" +
        oformat +
        "/documentation";
      return this.http.get(url);
    }


    getParameters(model: string, version: string): Observable<any> {
      const url: string =
        environment.baseUrl_manage +
        "model/" +
        model +
        "/version/" +
        version +
        "/parameters";
      return this.http.get(url);
    }
}
