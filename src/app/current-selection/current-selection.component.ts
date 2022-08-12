import { Component, OnInit } from '@angular/core';
import { Compound, Model } from '../Globals';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.scss']
})
export class CurrentSelectionComponent implements OnInit {

  constructor( public model: Model,public compound: Compound) { }

  ngOnInit(): void {
  }

}
