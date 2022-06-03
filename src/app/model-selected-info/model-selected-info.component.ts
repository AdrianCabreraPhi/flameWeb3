import { Component, OnInit } from '@angular/core';
import { CommonFunctions } from '../common.functions';
import { Model} from '../Globals';

@Component({
  selector: 'app-model-selected-info',
  templateUrl: './model-selected-info.component.html',
  styleUrls: ['./model-selected-info.component.scss']
})
export class ModelSelectedInfoComponent implements OnInit {


  constructor(public model: Model, public commonFunctions: CommonFunctions) { }

  ngOnInit(): void {
  }
}
