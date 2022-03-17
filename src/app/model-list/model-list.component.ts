import { Component, OnInit } from '@angular/core';
import { Model, Prediction, Globals } from '../Globals';
import { CommonFunctions } from '../common.functions';
import 'datatables.net-bs4';
declare var $: any;
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  models: Array<any>;
  objectKeys = Object.keys;

  constructor( public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions) { }

    ngOnInit():void {
      this.prediction.name = undefined;
      this.model.name = undefined;
      this.model.version = undefined;
      this.func.getModelList();
    }

}
