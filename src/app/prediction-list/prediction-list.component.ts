import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Model, Prediction, Profile } from '../Globals';

@Component({
  selector: 'app-prediction-list',
  templateUrl: './prediction-list.component.html',
  styleUrls: ['./prediction-list.component.scss']
})
export class PredictionListComponent implements OnInit {
  objectKeys = Object.keys;
  constructor(
    private func: CommonFunctions,
    public prediction: Prediction,
    private model: Model,
    private profile: Profile,
    private service: CommonService

  ) { }

  ngOnInit(): void {
    this.prediction.name = undefined;
    this.model.name = undefined;
    this.model.version = undefined;
    this.model.trained = false;
    this.func.getPredictionList();

  }

  selectPrediction(name: string, modelName: string, modelVersion: string, date: any, modelID: string) {
    this.profile.summary = undefined
    this.prediction.name = name;
    this.prediction.modelName = modelName;
    this.prediction.modelVersion = modelVersion;
    this.prediction.date = date;
    this.prediction.modelID = modelID;
    this.service.setPredictName(name);
    
  }


}
