import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Model, Prediction,Globals } from './Globals';
declare var $: any;

@Injectable({
    providedIn: 'root'
  })

export class CommonFunctions {
    constructor(private commonService: CommonService,
        public model: Model,
        public globals: Globals,
        public prediction: Prediction,){

    }
    objectKeys = Object.keys;
    selectModel(name: string, version: string, modelID: string, trained: boolean, type: string, quantitative: boolean,
        conformal: boolean, confidential: boolean, secret: boolean, ensemble: boolean, error: any) {
    
        if (version === '-' || version === 'dev') {
          version = '0';
        }
        this.model.name = name;
        this.model.version = version;
        this.model.modelID = modelID;
        this.model.type = type;
        this.model.trained = trained;
        this.model.conformal = conformal;
        this.model.confidential = confidential;
        this.model.secret = secret;
        this.model.quantitative = quantitative;
        this.model.ensemble = ensemble;
        this.model.error = error;
        this.model.file = undefined;
        this.model.file_info = undefined;
        this.model.file_fields = undefined;
        this.model.parameters = undefined;
      }

      selectModelID(index:any) {
        this.model.name = this.model.listModels[index].name;
        this.model.version = this.model.listModels[index].version;
        this.model.modelID = this.model.listModels[index].modelID;
        this.model.type = this.model.listModels[index].type;
        this.model.trained = this.model.listModels[index].trained;
        this.model.conformal = this.model.listModels[index].conformal;
        this.model.confidential = this.model.listModels[index].confidential;
        this.model.secret = this.model.listModels[index].secret;
        this.model.quantitative = this.model.listModels[index].quantitative;
        this.model.ensemble = this.model.listModels[index].ensemble;
        this.model.error = this.model.listModels[index].error;
      }

    getModelList() {
        this.globals.tableModelVisible = false;
        let num_models = 0;
        this.commonService.getModelList().subscribe(
            result => {
              if (result[0]) {
                this.model.trained_models = [];
                for (const model of result[1]) {
    
                  // get listModels key elements
                  const modelName = model.modelname;
                  const version = model.version;
                  
                  // INFO OF EACH MODEL
                  num_models++;
    
                  // // fallback
                  // this.model.listModels[modelName + '-' + version] = {name: modelName, version: version, trained: false, numMols: '-',
                  //     variables: '-', type: '-', quality: {}, quantitative: false, conformal: false, ensemble: false, error: model.info};
    
                  // model.info should be 
                  // (a) dictionay with a code 0 or 1 and an error message
                  // (b) an array of tuples of three elements 
                  if (typeof(model.info) !== 'string') { // this should never happen, only in very old Flame versions
    
                    // process labels or assign default values
                    var dict_label = {};
    
                    if ('label' in model){
                      dict_label = model.label;
                    }
                    else {
                      dict_label = {  'maturity' : 'dev',
                      'type' : 'unk',
                      'subtype' : 'unk',
                      'endpoint' : 'unk',
                      'species' : 'unk' }
                    };
                    
                    // (a) the info file was not found
                    if (model.info['code'] == 0 || model.info['code'] == 1 ){
    
                      this.model.listModels[modelName + '-' + version] = {
                        error: model.info['message'],
                        trained: false,
                        name: modelName, 
                        version: version, 
                        numMols: '-',
                        variables: '-', 
                        type: '-', 
                        quality: {}, 
                        quantitative: false, 
                        conformal: false, 
                        confidential: false, 
                        secret: false, 
                        ensemble: false, 
                        maturity : dict_label['maturity'],
                        bio_type : dict_label['type'],
                        bio_subtype : dict_label['subtype'],
                        bio_endpoint : dict_label['endpoint'],
                        bio_species : dict_label['species'],
                      };
                    }
                    // (b) healthy 
                    else {
                      
                      if (!(this.globals.read_only==true && (dict_label['maturity']=='dev' || version==0))) {
                        // info
                        const dict_info = {};
                        for (const aux of model.info) {
                          dict_info[aux[0]] = aux[2];
                        }
    
                        // quality
                        const quality = {};
                        for (const info of (Object.keys(dict_info))) {
                          if (typeof(dict_info[info]) === 'number') {
                            quality[info] =  parseFloat(dict_info[info].toFixed(3));
                          }
                        }
    
                        this.model.listModels[modelName + '-' + version] = {
                          name: modelName, 
                          version: version, 
                          modelID: dict_info['modelID'],
                          trained: true,
                          numMols: dict_info['nobj'], 
                          variables: dict_info['nvarx'], 
                          type: dict_info['model'], 
                          quality: quality,
                          quantitative: dict_info['quantitative'], 
                          conformal: dict_info['conformal'], 
                          confidential: dict_info['confidential'], 
                          secret: dict_info['secret'], 
                          ensemble: dict_info['ensemble'], 
                          maturity : dict_label['maturity'],
                          bio_type : dict_label['type'],
                          bio_subtype : dict_label['subtype'],
                          bio_endpoint : dict_label['endpoint'],
                          bio_species : dict_label['species'],
                          error: undefined
                        };
                        this.model.trained_models.push(modelName + ' .v' + version);
                      }
                      // else {
                      //   console.log ('model not shown');
                      // }
                    }
                  }
                  else {
                    alert('Unexpected result: ' + model.info );
                  } 
                  num_models--;
                }
    
                // console.log(this.model.listModels);
    
                const intervalId = setInterval(() => {
                  
                  // if list reading was correct num_models == 0
                  if (num_models <= 0) {
    
                    // compile a list of labels, required for the selectors
                    let labelCollection = {
                      bio_type : [''],
                      bio_subtype : [''],
                      bio_endpoint : [''],
                      bio_species : [''],
                    };
                    for (const imodel of Object.keys(this.model.listModels)){
                      const modelIndex = this.model.listModels[imodel];
                      if (labelCollection.bio_type.indexOf(modelIndex.bio_type) == -1){
                        labelCollection.bio_type.push(modelIndex.bio_type);
                      } 
                      if (labelCollection.bio_subtype.indexOf(modelIndex.bio_subtype) == -1){
                        labelCollection.bio_subtype.push(modelIndex.bio_subtype);
                      } 
                      if (labelCollection.bio_endpoint.indexOf(modelIndex.bio_endpoint) == -1){
                        labelCollection.bio_endpoint.push(modelIndex.bio_endpoint);
                      } 
                      if (labelCollection.bio_species.indexOf(modelIndex.bio_species) == -1){
                        labelCollection.bio_species.push(modelIndex.bio_species);
                      } 
                    }
                    labelCollection.bio_type.sort();
                    labelCollection.bio_subtype.sort();
                    labelCollection.bio_endpoint.sort();
                    labelCollection.bio_species.sort();
    
                    this.model.listLabels = labelCollection;
    
                    let currentPage = 0;
                    // console.log ('rendering: ', this.model.name, this.model.version);
                    
                    if (this.objectKeys(this.model.listModels).length > 0) {
    
                      // a is the sorted list of modelkeys
                      const a = this.objectKeys(this.model.listModels).sort();
    
                      // if no model selected, select the first one
                      if (this.model.name == undefined) {
                          this.selectModelID(a[0]);
                      }
                      else {
                        var modelIndex = a.indexOf(this.model.name+'-'+this.model.version);
                        this.selectModelID(a[modelIndex]);
                        currentPage = Math.floor(modelIndex/this.model.pagelen);
                      }
                    }
    
                    // console.log('refresh')
                    let me = this;
                    const table = $('#dataTableModels').DataTable({
                      autoWidth: false,
                      destroy: true,
                      pageLength: this.model.pagelen,
    
                      // this code adds selectors to all columns
                      initComplete: function () {
                        var icol = 0;
                        this.api().columns().every( function () {
                            var column = this;
                            // example on how you can remove col 0 (quali/cuanti)
                            if (icol>0) {
                              // class "model_selector" was used to customize font size
                              var select = $('<select class="model_selector" ><option value=""></option></select>')
                                  .appendTo( $(column.footer()).empty() )
                                  .on( 'change', function () {
                                      var val = $.fn.dataTable.util.escapeRegex(
                                          $(this).val()
                                      );
                                      column
                                          .search( val ? '^'+val+'$' : '', true, false )
                                          .draw();
                                  } );
                              column.data().unique().sort().each( function ( d, j ) {
                                  select.append( '<option value="'+d+'">'+d+'</option>' )
                              } );
                            }
                            icol++;
                        });
                      }
                    })
                    .on( 'length.dt', function () {
                      me.model.pagelen =table.page.len()
                    });
    
                    // table.$('td').tooltip( {
                    //   "delay": 0,
                    //   "track": true,
                    //   "fade": 100
                    // } );
                    
                    if (currentPage != 0) {
                      table.page(currentPage).draw('page');
                    }
    
                    this.globals.tableModelVisible = true;
                    clearInterval(intervalId);
                  }
                }, 10);
            
              }
              else {
                alert(result[1]);
              }
            },
            error => {
              alert('Unable to retrieve model list');
            }
          );
      }



}