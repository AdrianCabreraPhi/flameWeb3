import { Component, OnInit, ViewChild } from '@angular/core';
import { Model, Prediction, Globals, Compound } from '../Globals';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import 'datatables.net-bs4';
declare var $: any;
@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss'],
})
export class ModelListComponent implements OnInit {
  models: Array<any>;
  objectKeys = Object.keys;
  modelsDocumentation: Array<any> = [];

  constructor(
    public model: Model,
    public globals: Globals,
    public prediction: Prediction,
    public func: CommonFunctions,
    private commonService: CommonService,
    public compound: Compound
  ) {}

  ngOnInit(): void {
    this.commonService.loadCollection$.subscribe(res => {
      this.checkCollection(res);
    })
    this.model.name = undefined;
    this.model.version = undefined;
    this.func.getModelList();
    // preload the documentation of the models to avoid multiple requests to the api.
    setTimeout(() => {
      this.getAllDocumentation();
    }, 200);
  }
  getAllDocumentation() {
    for (let key of Object.keys(this.model.listModels)) {
      this.commonService
        .getDocumentation(
          this.model.listModels[key].name,
          this.model.listModels[key].version,
          'JSON'
        )
        .subscribe(
          (result) => {
            this.modelsDocumentation.push({ name: key, result: result });
          },
          (error) => {
            console.log('documentation file not found:', key);
          }
        );
    }
  }
  checkCollection(collect: Object){
       var notFound = []
       for (let i = 0; i < collect['endpoints'].length; i++) {
         var found = false
         const element = collect['endpoints'][i]+'-'+collect['versions'][i]
         for (let key in this.model.listModels){
             if(element == key){
               found = true
             }
         }
         if(!found) notFound.push(element)
       }    

       if(notFound.length > 0){
         alert("Tu colección contiene modelos que no existen en el repositorio actual")
         console.log(notFound)
       }else{
         this.loadCollection(collect);
       }

  }

  loadCollection(collect: Object){
    let checkboxes = []
    $('#dataTableModels').DataTable().rows().every( function ( idx, tableLoop, rowLoop ) {
      var data = this.data();
      var node = this.node()
      let checkbox =  node.childNodes[0].childNodes[0]
      for (let i = 0; i < collect['endpoints'].length; i++) {
          if(data[2] == collect['endpoints'][i] && data[3] == collect['versions'][i] ){
              checkbox.checked = true;
          }
      }  
  } );
  }

  onChange(name, version, quantitative, type, event): void {
    const documentation = this.modelsDocumentation.find(
      (el) => el.name == name + '-' + version
    ); //get documentation of model
    const endpoint = documentation.result['Endpoint'].value || 'na'; //get endpoint values

    const obj = {
      name: name,
      quantitative: quantitative,
      type: type,
      version: version,
      endpoint: endpoint,
    };

    const isChecked = event.target.checked;
    if (isChecked) {
      this.model.listModelsSelected.push(obj);
    } else {
      this.model.listModelsSelected.splice(
        this.model.listModelsSelected.findIndex(
          (model) => model.name === name && model.version === version
        ),
        1
      );
    }
  }

  selectAll(event) {
    //pending comment
    const isChecked = event.target.checked;
    var lastPage = false;

    let ctxPage = document.getElementsByClassName('page-link');
    let startPage = <HTMLElement>ctxPage[1];
    startPage.click();

    while (!lastPage) {
      let checkBoxes = document.querySelectorAll<HTMLElement | any>(
        '.form-check-input'
      );
      checkBoxes.forEach((chckbox) => {
        if (chckbox.checked != isChecked) chckbox.click();
      });
      let nextPage = document.getElementById('dataTableModels_next');

      lastPage = nextPage.className.includes('disabled');
      nextPage.click();
    }
  }
}
