import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Globals, Model, Prediction } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';

@Component({
  selector: 'predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.scss'],
})
export class PredictButtonComponent implements OnInit {
  isValidCompound: boolean;
  endpoints = [];
  versions = [];
  
  constructor(
    public commonService: CommonService,
    public compound: Compound,
    private globals: Globals,
    private service: PredictorService,
    private prediction: Prediction,
    private toastr: ToastrService,
    public model: Model
  ) {
    this.prediction.name = 'postman';
  }

  ngOnInit(): void {
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
  }
  select_prediction() {
    if (this.compound.input_file) {
      this.predict();
    }
    if (this.compound.sketchstructure) {
      this.predictStructure();
    }
    if (this.compound.input_list) {
      console.log('input list');
    }
  }
  predictStructure() {
    console.log(this.compound.sketchstructure['name'])
    this.filterModels();
    console.log(this.endpoints)
    this.service
      .predictSketchStructure(
        this.prediction.name,
        this.compound.sketchstructure['result'],
        this.compound.sketchstructure['name'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        (result) => {
          // I need boolean. not string message
          if (result){
            this.commonService.setPredictionExec(true);
            this.toastr.success(
              this.compound.sketchstructure['name'],
              'PREDICTION COMPLETED',
              {
                timeOut: 4000,
                positionClass: 'toast-top-right',
                progressBar: true,
              }
            );
          } 
        },
        (error) => {
          console.log(error);
        }
      );
  }
  predict() {
    console.log(this.model.listModelsSelected)
    this.filterModels();
    this.service
      .predictInputFile(
        this.prediction.name,
        this.compound.input_file['result'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        (result) => {
          if (result) {
            this.commonService.setPredictionExec(true);
            this.toastr.success(
              this.compound.input_file['name'],
              'PREDICTION COMPLETED',
              {
                timeOut: 4000,
                positionClass: 'toast-top-right',
                progressBar: true,
              }
            );
          }
        },
        (error) => {
          console.log('error');
        }
      );
  }

  // TO DO
  predictInputList(profileName: string) {}
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
