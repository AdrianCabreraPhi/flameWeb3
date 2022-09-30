import { Component,OnInit, ViewChild } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { Model, Prediction,Globals } from './Globals';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'flameWeb3';
  modelTab = false;

  constructor(
    public model: Model,
    public globals: Globals,
    private commonService: CommonService,
    public prediction: Prediction
    ) {}

  toxhub: any;
  ngOnInit() {
    this.commonService.statusModelTab$.subscribe(status => {
      if(status){
        this.size1 = 30;
        this.size2 = 70;
      }else{
        this.size1 = 100;
        this.size2 = 0;
      }
    })
    this.toxhub = ''; // replace with ''
      if (environment.baseUrl.includes('flame.kh.svc')) {
        this.toxhub = '/';
      }
  }
@ViewChild('mySplit') mySplitEl: SplitComponent
  // area size
  _size1=100;
  _size2=0;
get size1() {
  return this._size1;
}

set size1(value) {
    this._size1 = value;
}
get size2() {
  return this._size2;
}

set size2(value) {
    this._size2 = value;
}
  // gutterClick(e){
  //   if(e.gutterNum === 1) {
  //     if(e.sizes[1] !== 0) {
  //       this.size1 = 100;
  //       this.size2 = 0;
  //     }else{
  //       this.size2 = 50;
  //       this.size1 = 50;
  //     }
  // }
  // }




}
