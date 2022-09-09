import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProfilingService {

constructor(private http:HttpClient) { }



deleteProfile(profileName: string){
  const url: string = environment.baseUrl_manage + 'profile/' + profileName;
  return this.http.delete(url);

}

profileList(){
  const url = environment.baseUrl_manage + 'profiles'
  return this.http.get(url);
}


profileItem(profileName:string, indxModel: number){
const url = environment.baseUrl_manage + 'profile/'+profileName+ '/' + indxModel
return this.http.get(url)
}

profileSummary(profileName: string){
const url = environment.baseUrl_manage + 'profile/'+profileName+'/summary';
return this.http.get(url);
}

}
