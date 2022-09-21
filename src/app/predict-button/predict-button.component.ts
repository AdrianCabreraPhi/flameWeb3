import { ComponentFactoryResolver } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Globals, Model, Prediction, Profile } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
import { ProfilingService } from '../profiling.service';
declare var $: any;
@Component({
  selector: 'predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.scss'],
})
export class PredictButtonComponent implements OnInit {
  objectKeys = Object.keys;
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  predictName: string = '';
  isvalidPrediction: boolean = false;
  predictionsNames = {};
  constructor(
    public commonService: CommonService,
    public compound: Compound,
    private service: PredictorService,
    public prediction: Prediction,
    private toastr: ToastrService,
    public model: Model,
    public profile: Profile,
    private profiling : ProfilingService,
  ) {
  }
  ngOnInit(): void {
    this.defaultPredictionName();
    
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
    }

    selectOption() {
      if (this.compound.input_file) {
        // this.predict();
      }
      if (this.compound.sketchstructure) {
        // this.predictStructure();
      }
      if (this.compound.input_list) {
        // this.predictInputList();
      }
      setTimeout(() => {
        this.defaultPredictionName();
      },3000)
    }
    defaultPredictionName(){
      this.service.getPredictionList().subscribe(
        result => {
          if(result[0]){
            this.prediction.predictions = result[1]
          }
        }
      )
      setTimeout(() => {
        for (const name of this.prediction.predictions) {
          this.predictionsNames[name[0]] = true;
        }
        let i=1;
        let nameFound = false;
        while (!nameFound) {
          this.predictName = 'Prediction_' + i;
          if (!this.objectKeys(this.predictionsNames).includes(this.predictName)) {
            nameFound = true;
            this.isvalidPrediction = true;
          }
          i=i+1;
        }
        
      }, 200);
    }
    predictNameChange() {
      this.isvalidPrediction = true;
      const letters = /^[A-Za-z0-9_]+$/;
      if (!(this.predictName.match(letters)) || this.predictName in this.predictionsNames || this.predictName.startsWith('ensemble')) {
        this.isvalidPrediction = false;
      }
    }
}
