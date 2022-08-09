import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
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
  profileList: any  = [];
  profileSelected = undefined;
  opt = {
    columnDefs: [
      { "width": "20%", "targets": 0 }
    ],
    autoWidth: false,
    destroy: true,
    paging: false,
    ordering: true,
    searching: false,
    info: false,
  }
  constructor(
    private service: PredictorService,
    public prediction: Prediction,
    public commonService: CommonService,
    public commonFunctions: CommonFunctions,
    public globals: Globals,
    private model: Model,
    private renderer2: Renderer2,
  ) { }
  ngOnInit(): void {
    this.getProfileList();
    setTimeout(() => {
      if(this.profileList[1].length){
        this.getProfileSummary();
      }
    },1000)
    this.commonService.predictionExec$.subscribe(() => {
      setTimeout(() => {
        this.getProfileList(); 
      },1000)  
      setTimeout(() => {
        this.getProfileSummary();
      },2000)
    })
  }
  generateTooltip(event, compound, value) {
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
     const column = event.target._DT_CellIndex.column - 1;
     const val = this.castValue(value,column);
     const text = compound + "<br>" + this.prediction.profileSummary['endpoint'][column] + "<br>" + val;
     event.target.setAttribute('data-content', text);  
  }
  
  showPrediction(event, molIndex,td) {
    const column = event.target._DT_CellIndex.column - 1;
    const modelName = this.prediction.profileSummary['endpoint'][column] + '-' + this.prediction.profileSummary['version'][column];
    const modelObj = this.model.listModels[modelName];
    this.prediction.modelName = this.prediction.profileSummary['endpoint'][column];
    this.prediction.modelVersion = this.prediction.profileSummary['version'][column];
    this.prediction.modelID = modelObj['modelID'];    
    this.commonService.setMolAndModelIndex(molIndex,column);
    this.selectedClass(event,td);
    $('#container-pred').show()      
      }

/**
 * Function to add specific styles to the selected prediction.
 * @param event 
 * @param td 
 */
  selectedClass(event,td) {
  if((this.Smol,this.Smodel)!=undefined){
    this.renderer2.setStyle(this.Smol,'background','white')
    $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'white');
  }
    this.Smodel = event.target._DT_CellIndex.column;
    this.Smol = td;
    this.renderer2.setStyle(td,'background','#f7f9ea')
    $('#dataTablePrediction thead th:eq('+this.Smodel+')').css("background",'#f7f9ea');
    
    if (this.prevSelection) this.prevSelection.classList.remove('selected');
    this.prevSelection = event.target;
    event.target.classList.add('selected');
    
  }
  getProfileList(){
    this.service.profileList().subscribe(res => {
      this.profileList = res
      this.profileList = []
        for(let i = 0; i < res[1].length;i++){
          this.profileList.push(res[1][i][0]+","+res[1][i][3])
        }
        this.profileSelected = this.profileList[0]
    },
    error => {
      console.log(error)
    })
  }
  
  getProfileSummary() {
    $('#container-pred').hide()
    this.prediction.profileSummary = undefined;
  
      this.prediction.date = this.profileSelected.match(/([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})/)[0]
      this.prediction.profileName = this.profileSelected.split(',')[0]
    setTimeout(() => {
    
      this.service.profileSummary(this.prediction.profileName).subscribe(
        (res) => {
          if (res) {
            this.prediction.profileSummary = res;
            this.escaleColor();
            $('#dataTablePrediction').DataTable().destroy();
            $('#dataTablePrediction').DataTable().clear().draw();
            setTimeout(() => {
            $('#dataTablePrediction').DataTable(this.opt)
            }, 20);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },1000)
  }
  /**
   * modifies the "profileSummary" array to add a new field 
   * where you set the color that belongs to the field
   */
  escaleColor(){
    var chr = chroma.scale('RdBu').domain([3,9]);
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
