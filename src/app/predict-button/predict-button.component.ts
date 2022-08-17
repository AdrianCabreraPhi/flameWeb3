import { ComponentFactoryResolver } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Globals, Model, Prediction } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
declare var $: any;
@Component({
  selector: 'predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.scss'],
})
export class PredictButtonComponent implements OnInit {
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  predictionName: string = '';
  isvalidProfile: boolean = true;
  constructor(
    public commonService: CommonService,
    public compound: Compound,
    private service: PredictorService,
    public prediction: Prediction,
    private toastr: ToastrService,
    public model: Model
  ) {
  }

  ngOnInit(): void {
    this.predictionName = 'Profile'
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
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
      this.predictInputList();
    }
  }

  profileNameChange(){
    this.isvalidProfile = true;
    const letters = /^[A-Za-z0-9_]+$/;
    this.prediction.profileList.forEach(profile => {
      profile = profile.split(',')[0]
      if(profile.toUpperCase() === this.predictionName.toUpperCase()){
        this.isvalidProfile = false;
      }
    });
    if (!this.predictionName.match(letters) || this.predictionName == '') {
      this.isvalidProfile = false;
    }
  }

  predictStructure() {
    this.filterModels();
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictionName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });
    this.service
      .predictSketchStructure(
        this.predictionName,
        this.compound.sketchstructure['result'],
        this.compound.sketchstructure['name'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(()=> {
            if(iter < 500){
              this.checkProfile(result,inserted,intervalId)
            }else{
              clearInterval(intervalId)
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Prediction ' + this.predictionName + ' \n Time Out' , 'Warning', {
                timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter +=1;
          },2000)
        },
        (error) => {
          console.log(error);
        }
      );
  }
  predict() {
    this.filterModels();
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictionName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });

    this.service
      .predictInputFile(
        this.predictionName,
        this.compound.input_file['result'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(()=> {
           if(iter < 500){
          this.checkProfile(result,inserted,intervalId)
           }else {
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Prediction ' + this.predictionName + ' \n Time Out' , 'Warning', {
              timeOut: 10000, positionClass: 'toast-top-right'});
           }
           iter+=1
          },2000)
        },
        error => {
          console.log('error');
        }
      );
  }
  checkProfile(name,inserted,intervalId){
     this.service.profileSummary(name).subscribe(
       result => {
        if (result['aborted']) {
          this.toastr.clear(inserted.toastId);
          this.toastr.error("Prediction \"" + name + "\" task has not completed. Check the browser console for more information", 
            'Aborted', {timeOut: 10000, positionClass: 'toast-top-right'});
          console.log('ERROR report produced by prediction task ', name);
          console.log(result['aborted']);
          clearInterval(intervalId);
          return;
        }
        if (!result ['waiting']) {
          this.toastr.clear(inserted.toastId);
          if (result['error']){
            this.toastr.warning('Profile ' + name + ' finished with error ' + result['error'] , 'PREDICTION COMPLETED', {
              timeOut: 5000, positionClass: 'toast-top-right'});
          }
          else {
             this.toastr.success('Profile ' + name + ' created' , 'PREDICTION COMPLETED', {
              timeOut: 5000, positionClass: 'toast-top-right'});
              this.commonService.setPredictionExec(true);
          }
          clearInterval(intervalId);
          $('#dataTablePredictions').DataTable().destroy();
        }
       }
     )}

  predictInputList() {
    this.filterModels();
    const inserted = this.toastr.info('Running!', 'Prediction ' + this.predictionName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });

    this.service.predictInputList(
      this.predictionName,
      JSON.stringify(this.compound.input_list['result']),
      this.compound.input_list['name'],
      JSON.stringify(this.endpoints),
      JSON.stringify(this.versions)
    ).subscribe(result => {
      let iter = 0;
      const intervalId = setInterval(()=> {
        if(iter < 500){
       this.checkProfile(result,inserted,intervalId)
        }else {
         this.toastr.clear(inserted.toastId);
         this.toastr.warning( 'Prediction ' + this.predictionName + ' \n Time Out' , 'Warning', {
           timeOut: 10000, positionClass: 'toast-top-right'});
        }
        iter+=1
       },2000)
    },error => {
      console.log('error');
    });
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
