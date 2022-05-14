import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction, Globals } from '../Globals';
import { PredictorService } from './predictor.service';
@Component({
  selector: 'app-manage-models',
  templateUrl: './manage-models.component.html',
  styleUrls: ['./manage-models.component.scss'],
})
export class ManageModelsComponent implements OnInit {
  constructor(
    public model: Model,
    public compound: Compound,
    public commonService: CommonService,
    private globals:Globals,
    private prediction: Prediction,
    private service: PredictorService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {

  }
}
