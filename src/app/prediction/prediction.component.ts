import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Prediction } from '../Globals';
import * as SmilesDrawer from 'smiles-drawer';
import { CommonFunctions } from '../common.functions';
@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
})
export class PredictionComponent implements OnInit {
  objectKeys = Object.keys;
  molIndex: number = undefined;
  molSelected: string = '';
  predResult: any = undefined;
  modelBuildInfo = {};
  submodels = [];
  modelPresent: boolean;
  modelMatch: boolean;
  isQuantitative: any;
  isMajority: boolean;
  plotComboQ = {
    data : [{
      x: [],
      y: [],
      text: [],
      type: 'scatter',
      mode: 'markers', 
      marker: {
        symbol: 'diamond',
        color: 'rgba(0,0,0,0.6)',
        size: 18,
        line: {
          color: 'black',
          width: 2
        },
        textfont: {family: 'Barlow Semi Condensed, sans-serif', 
                  size: 20 },
        texttemplate: '{x:.2f}'
      },
      error_x: {
        type: 'data',
        color: 'rgba(0,0,0,0.6)',
        symmetric: false,
        array: [],
        arrayminus: []
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
      },
      {x: [],
       y: [],
       type: 'scatter',
       mode: 'lines',
       line: {
        color: 'red',
        width: 3
       },
       hovertemplate:'<b>ensemble</b>: %{x:.2f}<extra></extra>'
      },
      {x: [],
       y: [],
       type: "scatter",
       fill: "tozeroy", 
       fillcolor: "rgba(255,0,0,0.2)", 
       line: {color: "transparent"}, 
       hovertemplate:'<b>ensemble CI</b>: %{x:.2f}<extra></extra>'
      },
    ],
    layout : {
      width: 800,
      // height: 600,
      hovermode: 'x',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 20 } },
      xaxis: {
        zeroline: false,
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 800,
        // height: 600,
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }
  plotComboC = {
    data : [{
      x: [],
      y: [],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: "rgba(0,0,255,0.6)",
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
      },
      {
      x: [],
      y: [],
      type: 'bar',
      orientation: 'h',
      marker: {
        color: 'rgba(255,0,0,0.6)',
      },
      hovertemplate:'<b>%{y}</b>: %{x:.2f}<extra></extra>'
      },
    ],
    layout : {
      width: 800,
      // height: 600,
      // margin: {r: 10, t: 30, b:0, pad: 0 },
      barmode: 'relative',
      hovermode: 'closest',
      hoverlabel: { font: {family: 'Barlow Semi Condensed, sans-serif', size: 20 } },
      xaxis: {
        range: [-1.1, 1.1],
        zeroline: true,
        zerolinewidth: 4,
        zerolinecolor: 'black',
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickvals: [-1.1, 0, 1.1],
        ticktext: ['negative', 'undefined', 'positive']
      },
      yaxis: {
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        automargin: true
      },
      showlegend: false
    },
    config: {
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_combo',
        width: 800,
        // height: 600,
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']    
    }
  }
  constructor(
    public prediction: Prediction,
    private commonService: CommonService,
    public commonFunctions: CommonFunctions
  ) {}

  ngOnInit(): void {
    this.commonService.molIndex$.subscribe((index) => {
      this.molIndex = index;
      this.renderData();
    });
  }

  drawReportHeader() {
    const options = { width: 600, height: 300 };
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(
      this.prediction.profileSummary.SMILES[this.molIndex],
      function (tree) {
        // Draw to the canvas
        smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      },
      function (err) {
        console.log(err);
      }
    );
  }

  renderData() {
    this.prediction.molSelected = this.prediction.profileSummary.obj_nam[this.molIndex];
    this.commonService.getDocumentation(this.prediction.modelName ,this.prediction.modelVersion,'JSON').subscribe((res) => {
      this.prediction.modelDocumentation = res;
    },error => {
      console.log(error)
    })
    this.drawReportHeader();
    this.getInfo();

  }

  updatePlotCombo() {
    const xi = this.prediction.predictionSelected.xmatrix[this.molIndex];
    // console.log (xi);
     
    // the results are shown using plotComboQ but in the case
    // of majority. only in this case we are using qualitative low level models
    // as qualitative variables
    if (!this.isMajority) {
      this.plotComboQ.data[0].x = [];
      this.plotComboQ.data[1].x = [];
      this.plotComboQ.data[2].x = [];
      this.plotComboQ.data[0].y = [];
      this.plotComboQ.data[1].y = [];
      this.plotComboQ.data[2].y = [];
      this.plotComboQ.data[0].error_x.array = [];
      this.plotComboQ.data[0].error_x.arrayminus = [];

      this.plotComboQ.data[0].x = xi;
      for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
        const varlist=String(this.prediction.predictionSelected.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];

        if (this.isQuantitative){
          this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboQ.data[1].x[i] = this.prediction.predictionSelected.values[this.molIndex];
        }

      }
      var drawCI = false;
      if (this.prediction.predictionSelected['ensemble_ci']){
        drawCI = true
        var cilist = this.prediction.predictionSelected.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.prediction.predictionSelected['ensemble_confidence']){
          drawCI = true
          var cilist = this.prediction.predictionSelected.ensemble_confidence[this.molIndex];
         }
      }
      if (drawCI){
        for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
          var cia = cilist[1+(i*2)] - xi[i];
          var cib = xi[i] - cilist[i*2];

          // avoid using c0 and c1 as CI ranges. c0/c1 are integers -1, 0 or 1
          if (!this.isInteger(cia) && !this.isInteger(cib) ) {
            this.plotComboQ.data[0].error_x.array[i] = cia;
            this.plotComboQ.data[0].error_x.arrayminus[i] = cib;
          }
        }

        if (this.isQuantitative && this.prediction.predictionSelected['upper_limit']){
          for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
            const varlist=String(this.prediction.predictionSelected.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[i] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[i] = this.prediction.predictionSelected.upper_limit[this.molIndex];
          }
          let j = this.prediction.predictionSelected.var_nam.length;
          for (let i=this.prediction.predictionSelected.var_nam.length-1; i>-1; i--) {
            const varlist=String(this.prediction.predictionSelected.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[j] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[j] = this.prediction.predictionSelected.lower_limit[this.molIndex];
            j++;
          }
        }
      }
    }
    // Qualitative
    // TODO: show ensemble prediction
    else {
      this.plotComboC.data[0].x = [];
      this.plotComboC.data[1].x = [];
      this.plotComboC.data[0].y = [];
      this.plotComboC.data[1].y = [];

      // Conformal, add classes
      var drawCI = false;
      if (this.prediction.predictionSelected['ensemble_ci']){
        drawCI = true
        var class_list = this.prediction.predictionSelected.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.prediction.predictionSelected['ensemble_confidence']){
          drawCI = true
          var class_list = this.prediction.predictionSelected.ensemble_confidence[this.molIndex];
         }
      }

      if (drawCI) {

        for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
          const varlist=String(this.prediction.predictionSelected.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          
          this.plotComboC.data[0].x[i] = 0;
          this.plotComboC.data[1].x[i] = 0;
        }
        for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
          if (class_list[i*2]===1) {
            this.plotComboC.data[0].x[i] += -1;
          }
          if (class_list[1+(i*2)]===1) {
            this.plotComboC.data[1].x[i] += 1;
          }
        }

      }
      // non-conformal, just show final result (including uncertain)
      else {

        for (let i=0; i<this.prediction.predictionSelected.var_nam.length; i++) {
          const varlist=String(this.prediction.predictionSelected.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
  
          if (xi[i]===0) {
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 0;
          } else if (xi[i]===1) {
            this.plotComboC.data[0].x[i] = 0;
            this.plotComboC.data[1].x[i] = 1;
          } else {
            this.plotComboC.data[0].x[i] = -1;
            this.plotComboC.data[1].x[i] = 0;
          }
        }
      }
    }
  }

  isInteger(value) {
    return value % 1 == 0;
  }
  getInfo(): void {

    this.commonService.getModel(this.prediction.modelName, this.prediction.modelVersion).subscribe(
      result => {
        for (const info of result) {
          this.modelBuildInfo[info[0]] = info[2];
        }

        //support for legacy models using significance instead of confidence
        if (this.modelBuildInfo['conformal_significance']!=undefined){
          this.modelBuildInfo['conformal_confidence'] = 1.0 - this.modelBuildInfo["conformal_significance"];
        }

        this.modelPresent = true;

        this.modelMatch = (this.modelBuildInfo['modelID'] === this.prediction.modelID);

        this.isQuantitative = this.modelBuildInfo['quantitative'];
        this.isMajority = this.modelBuildInfo['model'] == 'combination:majority voting' || 
                          this.modelBuildInfo['model'] == 'combination:logical OR' ;

        if (this.modelBuildInfo['ensemble']) {

          let version = '0';
          this.submodels = [];
          this.modelBuildInfo['ensemble_names'].forEach((submodel, index) => {

            if (this.modelBuildInfo['ensemble_names']) {
              version = this.modelBuildInfo['ensemble_versions'][index];
            } else {
              version = '0';
            }
            this.submodels[index] = {};
            this.submodels[index]['name'] = submodel;
            this.submodels[index]['version'] = version;
            this.commonService.getModel(submodel, version).subscribe(
              result3 => {
                for (const info of result3) {
                  this.submodels[index][info[0]] = info[2];
                }
              },
              error => {
              }
            );
          });
        }
      },
      error => {
        this.modelPresent = false;
        this.modelMatch = true; // prevent showing also this error!
      }
    );
    console.log(this.modelBuildInfo)
  }

}
