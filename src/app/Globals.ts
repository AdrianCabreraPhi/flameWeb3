import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';


@Injectable()
export class Model {
    name: string = undefined;   // Name of the model selected in the first step
    version: any = undefined; // Version of the model selected in the first step
    modelID: string = undefined;
    type: string;
    input_type: string = undefined;
    trained = false; // Model is already trained
    quantitative: boolean = undefined;
    conformal: boolean = undefined;
    confidential: boolean = undefined;
    secret: boolean = undefined;
    ensemble: boolean = undefined;
    incremental = false;
    error: string = undefined;
    /*
    Delta parameters, empty by default, fills on clicking the parameters tab.
    When you change anything on the formulary, automatically changes the value for that key
    */
    parameters: any = undefined;
    delta: any = {};
    trainig_models = [];
    listModels = {};
    listLabels = {};
    trained_models = [];
    selectedItems = [];
    page:number = 0;
    pagelen:number = 10;
    listModelsSelected = [];
  }
  @Injectable()
  export class Compound{
    file_info = undefined; // Info file ej. num mols, variables
    file_fields = undefined;
    sketchstructure: {} = undefined;
    input_list: {} = undefined;
    input_file = undefined;
    listCompoundsSelected = [];
  }

@Injectable()
export class Prediction {
    profileName: string = undefined;   
    modelName: string = undefined;
    modelVersion: string = undefined;
    modelParameters: any;
    modelDocumentation: any = undefined;
    predictions = [];
    profileSummary: any = undefined;
    predicting = {};
    conformal = false;
    file: any = undefined;  // Name of file uploaded in the second step
    result = undefined;
    date = undefined;
    modelID = undefined;
    profileItem = undefined;
    molSelected = undefined;
    profileList: any  = [];
}


@Injectable()
export class Globals {
    tableModelVisible = false;
    tablePredictionVisible = false;
    tableSpaceVisible = false;
    mainTabActive: string = undefined;
    read_only = environment.read_only;
    compoundTabActive: string = undefined;
}
@Injectable()
export class CustomHTMLElement extends HTMLElement {
    constructor() {
      super();
    }
    on(event_type, cb) {
    }
}