import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Prediction, Globals, Model } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
import 'datatables.net-bs4';
import chroma from "chroma-js";
declare var $: any;
@Component({
  selector: 'app-multiple-prediction',
  templateUrl: './multiple-prediction.component.html',
  styleUrls: ['./multiple-prediction.component.scss'],
})
export class MultiplePredictionComponent implements OnInit {
  result: any;
  prevSelection: any = undefined;
  Smodel: number = undefined;
  Smol:number = undefined;
  gamaColor = undefined;
  constructor(
    private service: PredictorService,
    public prediction: Prediction,
    public commonService: CommonService,
    public commonFunctions: CommonFunctions,
    public globals: Globals,
    private model: Model
  ) { }


  ngOnInit(): void {
    this.commonService.predictionExec$.subscribe(() => {
      setTimeout(() => {
        this.getProfileSummary(); 
      },2000)  
    })
  }
  generateTooltip(event, compound, value) {
    const column = event.target._DT_CellIndex.column - 1;
    const val = this.castValue(value,column);
    const text = compound + "\n" + this.prediction.profileSummary['endpoint'][column] + "\n" + val;
    event.target.setAttribute('title', text);
  }


  showPrediction(event, molIndex) {
    const column = event.target._DT_CellIndex.column - 1;
    this.selectedClass(event);
    const modelName = this.prediction.profileSummary['endpoint'][column] + '-' + this.prediction.profileSummary['version'][column];
    const modelObj = this.model.listModels[modelName];
    this.prediction.modelName = this.prediction.profileSummary['endpoint'][column];
    this.prediction.modelVersion = this.prediction.profileSummary['version'][column];
    this.prediction.modelID = modelObj['modelID'];    
    this.commonService.setMolAndModelIndex(molIndex,column);
      
      }

  /**
   * Function to add specific styles to the selected prediction.
   * @param event 
   */
  selectedClass(event) {
    if((this.Smodel,this.Smol)!=undefined){
      $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'white');
      $("#dataTablePrediction tr:eq("+this.Smol+") td:first").css("background", "white");
    }
    this.Smodel = event.target._DT_CellIndex.column;
    this.Smol = event.target._DT_CellIndex.row +1;
    $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'#f7f9ea');
    $("#dataTablePrediction tr:eq("+this.Smol+") td:first").css("background", "#f7f9ea");
    
    if (this.prevSelection) this.prevSelection.classList.remove('selected');
    this.prevSelection = event.target;
    event.target.classList.add('selected');
  }
  getProfileSummary() {
    this.prediction.profileSummary = undefined;
    this.service.profileSummary(this.prediction.name).subscribe(
      (res) => {
        if (res) {
          this.prediction.profileSummary = res;
          this.escaleColor()
          $('#dataTablePrediction').DataTable().destroy();
          $('#dataTablePrediction').DataTable().clear().draw();
          setTimeout(() => {
            $('#dataTablePrediction').DataTable({
              autoWidth: false,
              destroy: true,
              paging: false,
              ordering: false,
              searching: false,
              info: false,
              })
          }, 20)
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  escaleColor(){
    var chr = chroma.scale('RdBu').domain([10,0]);
    var globalArr = []
    for (let i = 0; i < this.prediction.profileSummary.values.length; i++) {
      var arrValues = []
      for (let y = 0; y < this.prediction.profileSummary.endpoint.length; y++) {
        if(this.prediction.profileSummary.quantitative[y]){
          arrValues[y] = chr(this.prediction.profileSummary.values[i][y])._rgb
        }else {
          arrValues[y] = -1
        }
      }
      globalArr[i] = arrValues
    }
    this.prediction.profileSummary['escaleColor'] = globalArr
  }

  castValue(value:number,column?:number) {
    if(this.prediction.profileSummary['quantitative'][column]) return value.toFixed(1);
    return value == 1 ? 'Positive' : value == 0 ? 'Negative' : 'Uncertain';
  }

}
