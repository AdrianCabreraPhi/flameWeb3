import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction } from '../Globals';
import { PredictorService } from './predictor.service';

@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.scss']
})
export class ManageModelsComponent implements OnInit {
  isValidCompound: boolean = false;

  constructor(public model: Model,public compound: Compound, public commonService: CommonService, public prediction: Prediction, public predictService: PredictorService) { }

  ngOnInit(): void {
    this.commonService.isValidCompound$.subscribe(value => this.isValidCompound = value)
    this.prediction.name = undefined;
  }

  Predict(){
    if(this.compound.file){
      //guarda los datos principales del modelo
      // this.prediction.predicting[this.predictName] = [this.modelName, this.version, this.file.name];
    //public service: PredictorService
    // this.predictService.predict("test","0",this.compound.file,"testPredict").subscribe(result => {
    //   let iter = 0;

    // })
  }
  }
}
