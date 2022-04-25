import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-current-selection',
  templateUrl: './current-selection.component.html',
  styleUrls: ['./current-selection.component.scss']
})
export class CurrentSelectionComponent implements OnInit {

  currentSelection: {} = undefined;
  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    
    this.commonService.currentSelection$.subscribe(result => this.currentSelection = result)
  }

}
