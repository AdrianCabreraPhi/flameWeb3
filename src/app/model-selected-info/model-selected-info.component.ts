import { Component, OnInit } from '@angular/core';
import { Model} from '../Globals';

@Component({
  selector: 'app-model-selected-info',
  template: `<div class="selected-list">
  <div *ngFor="let model of this.model.listModelsSelected">
      <span>* {{model.name}} v.{{model.version}} {{model.quantitative}} |</span> {{model.type}} |<span>{{model.endpoint}} </span>
  </div> 
</div>`,
  // templateUrl: './model-selected-info.component.html',
  styleUrls: ['./model-selected-info.component.scss']
})
export class ModelSelectedInfoComponent implements OnInit {

  constructor(public model: Model) { }

  ngOnInit(): void {
  }

}
