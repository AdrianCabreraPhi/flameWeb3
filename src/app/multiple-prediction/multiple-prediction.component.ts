import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Prediction,Globals } from '../Globals';
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
  beforeSelection: any = undefined;
  constructor(
    private service: PredictorService,
    private prediction: Prediction,
    public commonService: CommonService,
    public commonFunctions: CommonFunctions,
    public globals: Globals
  ) {}


  ngOnInit(): void {
    this.getSummary();


  }
  generateTooltip(event,compound,value){
    const column = event.target._DT_CellIndex.column - 1 ;
    const val = value == 1 ? 'Positive' : value == -1 ? 'Undefined': 'Negative';
    const text = compound +"\n"+this.result['endpoint'][column]+"\n"+val;
    event.target.setAttribute('title',text)
  }

  showPrediction(event){


    this.selectionStyle(event);
    
  }

  /**
   * Function to add specific styles to the selected prediction
   * @param event 
   */
  selectionStyle(event){
    if (this.beforeSelection) this.beforeSelection.classList.remove('selected');   
    this.beforeSelection = event.target
    event.target.classList.add('selected')

  }

  getSummary() {
    this.service.profileSummary(this.prediction.name).subscribe(
      (res) => {
        if(res){
          this.result = res;
          this.globals.dtPredictionVisible = true;
          setTimeout(() => {
           $('#dataTablePrediction').DataTable({
              paging: false,
              ordering: false,
              searching: true,
              info: false,
            });
          },10)
        }  
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
