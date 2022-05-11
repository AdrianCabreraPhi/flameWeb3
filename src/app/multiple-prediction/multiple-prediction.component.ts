import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Prediction, Globals, Model } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
import 'datatables.net-bs4';
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
  constructor(
    private service: PredictorService,
    public prediction: Prediction,
    public commonService: CommonService,
    public commonFunctions: CommonFunctions,
    public globals: Globals,
    private model: Model
  ) { }


  ngOnInit(): void {
    this.getProfileSummary();
  }

  generateTooltip(event, compound, value) {
    const column = event.target._DT_CellIndex.column - 1;
    const val = this.castValue(value);
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

    
    this.service.profileItem(this.prediction.name, column).subscribe(result => {
      if(result) {
        this.prediction.predictionSelected = result;
        setTimeout(() => {
          this.commonService.molIndex$.emit(molIndex);
        }, 10)
      }
    }, error => {
      alert('Not found this item:'+column)
      console.log(error);
    })

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
    this.service.profileSummary(this.prediction.name).subscribe(
      (res) => {
        if (res) {
          this.prediction.profileSummary = res;
          this.globals.dtPredictionVisible = true;
          setTimeout(() => {
            $('#dataTablePrediction').DataTable({
              paging: false,
              ordering: false,
              searching: false,
              info: false,
            });
          }, 10)
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  castValue(value:number) {
    return value == 1 ? 'Positive' : value == 0 ? 'Negative' : 'Uncertain';
  }

}
