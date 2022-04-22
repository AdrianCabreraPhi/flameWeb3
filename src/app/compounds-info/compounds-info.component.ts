import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Model,Compound} from '../Globals';

@Component({
  selector: 'app-compounds-info',
  templateUrl: './compounds-info.component.html',
  styleUrls: ['./compounds-info.component.scss']
})
export class CompoundsInfoComponent implements OnInit {
  currentTab: string = "input-file"
  objectKeys = Object.keys;
  constructor(private commonService : CommonService, public model:Model,public compound:Compound) { }

  ngOnInit(): void {
    this.commonService.currentCompoundTab.subscribe(result => {
      this.currentTab = result;
    })
  }
}
