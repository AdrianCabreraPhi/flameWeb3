import { Component, OnInit } from '@angular/core';
import { Model } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';

@Component({
  selector: 'app-save-profile-button',
  templateUrl: './save-profile-button.component.html',
  styleUrls: ['./save-profile-button.component.scss']
})
export class SaveProfileButtonComponent implements OnInit {

  constructor(public model: Model,private service: PredictorService) { }
  endpoints = [];
  versions = [];

  ngOnInit(): void {
  }

  saveCollection(){
  this.filterModels();

    this.service.collection("frontend",JSON.stringify(this.endpoints),JSON.stringify(this.versions)).subscribe(result =>{
      console.log(result)
    } )
    
  }
  filterModels() {
    this.endpoints = [];
    this.versions = [];
    this.model.listModelsSelected.filter((model) =>
      this.endpoints.push(model.name)
    );
    this.model.listModelsSelected.filter((model) =>
      this.versions.push(model.version)
    );
  }
}
