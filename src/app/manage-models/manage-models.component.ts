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
    private prediction: Prediction,
    private service: PredictorService
  ) {
    this.prediction.name = 'postman';
  }

  ngOnInit(): void {
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
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
        if(result) this.commonService.dtPredictionVisible.emit(true);
          
         
      
      })
  }
  predict() {
   this.filterModels();
    this.service.predictInputFile(this.prediction.name,this.compound.input_file['result'],JSON.stringify(this.endpoints),JSON.stringify(this.versions)).subscribe(
      result =>{
        if(result) this.commonService.dtPredictionVisible.emit(true);
      },
      error =>{
        console.log("error");  
      }
    )
  }

// TO DO
predictInputList(profileName:string){

}

}
