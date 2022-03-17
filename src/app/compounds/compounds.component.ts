import { Component, OnInit } from '@angular/core';
import { Model, Globals } from '../Globals';

@Component({
  selector: 'app-compounds',
  templateUrl: './compounds.component.html',
  styleUrls: ['./compounds.component.scss']
})
export class CompoundsComponent implements OnInit {
  file = undefined;
  constructor(public model: Model) { }

  ngOnInit(): void {
  }


  public change(event): void {
    
    const file:File = event.target.files[0];
    if(file) this.file = file;
   
  }

}
