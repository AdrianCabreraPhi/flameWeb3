import { Component, OnInit } from '@angular/core';
import { Model } from '../Globals';

@Component({
  selector: 'app-save-profile-button',
  templateUrl: './save-profile-button.component.html',
  styleUrls: ['./save-profile-button.component.scss']
})
export class SaveProfileButtonComponent implements OnInit {

  constructor(public model: Model) { }

  ngOnInit(): void {
  }

  saveModelProfile(){
    
  }

}
