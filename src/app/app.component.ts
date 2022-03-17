import { Component,OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Model, Prediction,Globals } from './Globals';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'flameWeb3';

  constructor(
    public model: Model,
    public globals: Globals
    ) {}

  toxhub: any;
  ngOnInit() {
    
    this.toxhub = ''; // replace with ''
      if (environment.baseUrl.includes('flame.kh.svc')) {
        this.toxhub = '/';
      }


  }

}
