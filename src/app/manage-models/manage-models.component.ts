import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction } from '../Globals';
import { PredictorService } from './predictor.service';

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.scss'],
})
export class ManageModelsComponent implements OnInit {
  isValidCompound: boolean = false;
  currentSelection: {} = undefined;
  endpoints = [];
  versions = [];
  constructor(
    public model: Model,
    public compound: Compound,
    public commonService: CommonService,
    public prediction: Prediction,
    public service: PredictorService
  ) {
    this.prediction.name = 'postman';
  }

  ngOnInit(): void {
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
    this.commonService.currentSelection$.subscribe(
      (result) => (this.currentSelection = result)
    );
  }

  select_prediction() {
    
    if(this.compound.input_file){
      this.predict()
    }
    if(this.compound.sketchstructure){
      this.predictStructure();

    }
    if(this.compound.input_list){
      console.log("input list")

    }
  }

  filterModels(){
    this.model.listModelsSelected.filter(model => this.endpoints.push(model.name))
    this.model.listModelsSelected.filter(model => this.versions.push(model.version))
  }

  predictStructure(){
    this.filterModels();
    console.log(this.compound.sketchstructure)
    this.service.predictSketchStructure(this.prediction.name,this.compound.sketchstructure['result'],this.compound.sketchstructure['name'],JSON.stringify(this.endpoints),JSON.stringify(this.versions)).subscribe(
      result => {
        console.log(result)
      })
      this.service.profileSummary(this.prediction.name).subscribe(result =>{
        console.log(result)
      })
  }
  predict() {
   this.filterModels();
    this.service.predictInputFile(this.prediction.name,this.compound.input_file['result'],JSON.stringify(this.endpoints),JSON.stringify(this.versions)).subscribe(
      result =>{
        console.log(result)
      //   for (var i = 0; i < this.model.listModelsSelected.length; i++) {
      //     console.log(i)
      //  }

      },
      error =>{
        console.log("error");  
      }
    )

    this.service.profileSummary(this.prediction.name).subscribe(result =>{
      console.log(result)
    })

  }

predictInputList(profileName:string,){

}

}
