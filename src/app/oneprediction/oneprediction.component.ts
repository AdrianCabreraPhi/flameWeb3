import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import * as SmilesDrawer from 'smiles-drawer';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { CustomHTMLElement, Prediction } from '../Globals';
import { PredictorService } from '../manage-models/predictor.service';
import { CommonService } from '../common.service';
declare var $:any;
@Component({
  selector: 'app-oneprediction',
  templateUrl: './oneprediction.component.html',
  styleUrls: ['./oneprediction.component.scss']
})
export class OnepredictionComponent implements OnInit {
  @ViewChildren('cmp') components: QueryList<ElementRef>;
  objectKeys = Object.keys;
  predictionVisible = false;
  isVisible = false;
  modelMatch = true;
  modelPresent = true;
  dmodx = false;
  q_measures = ['TP', 'FP', 'TN', 'FN'];
  table: any = undefined;
  info = [];
  head = [];
  predictionResult: any;
  modelDocumentation: any = undefined;
  molIndex = 0;
  noNextMol = false;
  noPreviousMol = true;
  noNextModel = false;
  noPreviousModel = true;
  modelBuildInfo = {};
  modelValidationInfo = {};
  submodels = [];
  submodelsIndex = 0;
  predictionError = '';
  isQuantitative = false;
  isMajority = false;
  showConcentration = false;

  predictData = [{
    offset: 45, 
    r: [],
    theta: ["TP", "FN", "TN", "FP"],
    meta: ["TP", "FN", "TN", "FP"],
    marker: {
      opacity: 0.8,
      color: ["#468FB8", "#F2B90F", "#9CC6DD", "#F9DB84"]
    },
    type: "barpolar",
    hovertemplate: "%{meta}: %{r}<extra></extra>"
  }]

  plotCommon = {
    layout :{
      width: 350,
      height: 350,
      // margin: {r: 10, t: 30, b:0, pad: 0 },
      polar: {
        bargap: 0,
        gridcolor: "grey",
        gridwidth: 1,
        radialaxis: {
          angle: 90,
          ticks: '', 
          tickfont: { size: 12, fontStyle: 'Barlow Semi Condensed, sans-serif' },
        },
        angularaxis: {
          showticklabels: false, 
          ticks:'',
        }
      }
    },
    config: {
      // responsive: true,
        displayModeBar: false
      }
    };  
    
    bwcolorscale = [
      [0.0, 'rgb(160, 160, 160)'],
      [0.5, 'rgb(160, 160, 160)'],
      [1.0, 'rgb(160, 160, 160)'],
    ];
  
    greencolorscale = [
      [0.0, 'rgb(107, 232, 49)'],
      [0.5, 'rgb(107, 232, 49)'],
      [1.0, 'rgb(107, 232, 49)'],
    ];

    redcolorscale = [
      [0.0, 'rgb(255, 0, 0)'],
      [0.5, 'rgb(255, 0, 0)'],
      [1.0, 'rgb(255, 0, 0)'],
    ];

    // [0.1, '#6be831'],


  plotScores = {
    data: [
      { x: [], 
        y: [], 
        text: [],
        meta: [],
        type: 'scatter', 
        mode: 'markers', 
        marker: {
          color: [],
          opacity: 0.6,
          size: 10,
          colorscale: 'RdBu', 
          showscale: true, 
          cauto: true,
          colorbar: {
            tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18 }
          }
        },
        hovertemplate:'<b>%{text}</b><br>%{marker.color:.2f}<extra></extra>',
      },
      { x: [], 
        y: [], 
        text: [],
        meta: [],
        type: 'scatter', 
        mode: 'markers+text', 
        textfont : {
          fontStyle: 'Barlow Semi Condensed, sans-serif',
          color: '#59c427',
          size: 16
        },
        textposition: 'top right',
        marker: {
          color: [],
          symbol: 'circle-open',
          colorscale: this.greencolorscale, 
          showscale: false, 
          opacity: 1,
          size: 14,
          line: {
            color: '#6be831',
            width: 3
          }
        },
        hovertemplate:'<b>%{text}</b><br>%{meta:.2f}<extra></extra>',
      },
    ],
    layout: { 
      width: 800,
      height: 600,
      hovermode: 'closest',
      margin: {r: 10, t: 30, pad: 0 },
      showlegend: false,
      showtitle: true,
      titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 18 },
      title: 'Prediction projected on training series (using model X matrix)',
      xaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC1',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18},
      },
      yaxis: {
        zeroline: true,
        showgrid: true,
        showline: true,
        gridwidth: 1,
        linecolor: 'rgb(200,200,200)',
        linewidth: 2,
        title: 'PCA PC2',
        titlefont: { family: 'Barlow Semi Condensed, sans-serif', size: 20 },
        tickfont: {family: 'Barlow Semi Condensed, sans-serif', size: 18},
      },
    },
    config: {
      // responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'svg', // one of png, svg, jpeg, webp
        filename: 'flame_prediction',
        width: 800,
        height: 600,
        scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
      },
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d','hoverCompareCartesian']
    }
  };

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
    private service: PredictorService,
    private prediction: Prediction,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    //servicio que cuando das click a una prediccion le envie el nombre y el resto de datos.
    this.commonService.predictionActive$.subscribe( name => { 
      console.log("Service:")
      console.log(name)
      this.getPrediction(name);
    });
    

  }
  getPrediction(name: string) {
    this.predictionVisible = false;
    this.predictionResult = undefined;
    $('#prediction').DataTable().destroy();
    //$('#predictionOne').DataTable().destroy();
    this.modelValidationInfo = {};
    this.service.getPrediction(name).subscribe(
      result => {
        if (result['error']) {
          this.predictionError = result['error']; 
        }
        
          if ('PC1proj' in result) {
            this.plotScores.data[1].x = result['PC1proj'];
            this.plotScores.data[1].y = result['PC2proj'];
            this.plotScores.data[1].text = result['obj_nam'];
            this.plotScores.data[1].meta = result['values'];
            if ('PCDMODX' in result) {
              this.plotScores.data[1].marker.color = result['PCDMODX'];
              this.dmodx = true;
            }
            else {
              for (var i=0; i<result['obj_nam'].length; i++) {
                this.plotScores.data[1].marker.color[i] = 0.0;
              }
              this.dmodx = false;
            }

          };

        this.predictionResult = result;
        this.updatePlotCombo();

        if ('external-validation' in this.predictionResult) {
          for (const modelInfo of this.predictionResult['external-validation']) {
            if (typeof modelInfo[2] === 'number') {
              modelInfo[2] = parseFloat(modelInfo[2].toFixed(3));
            }
            if (typeof modelInfo[2] !== 'object') {
              this.modelValidationInfo [modelInfo[0]] = [modelInfo[1], modelInfo[2]];
            }
          }
        }
        if ('TP' in this.modelValidationInfo) {
          this.predictData[0].r = [this.modelValidationInfo['TP'][1], 
          this.modelValidationInfo['FN'][1],
          this.modelValidationInfo['TN'][1], 
          this.modelValidationInfo['FP'][1]];
        }
        
        
        const options_list = {'width': 300, 'height': 150};
        const smilesDrawer = new SmilesDrawer.Drawer(options_list);
        
        // use a long timeout because this can take a lot of time
        setTimeout(() => {
          this.components.forEach((child) => {
            SmilesDrawer.parse(child.nativeElement.textContent, function (tree) {
              smilesDrawer.draw(tree, child.nativeElement.id, 'light', false);
              }, function (err) {
                console.log(err);
              });
          });
          
          const settingsObj: any = {
            dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
            '<"row"<"col-sm-12"tr>>' +
            '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            buttons: [
              { 'extend': 'copy', 'text': 'Copy', 'className': 'btn-primary' , title: ''},
              { 'extend': 'excel', 'text': 'Excel', 'className': 'btn-primary' , title: ''},
              { 'extend': 'pdf', 'text': 'Pdf', 'className': 'btn-primary' , title: ''},
              { 'extend': 'print', 'text': 'Print', 'className': 'btn-primary' , title: ''}
            ],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
              const self = this;
              $('td', row).unbind('click');
              $('td', row).bind('click', () => {
                this.tabClickHandler(data);
              });
              return row;
            },
            destroy: true,
            deferRender: true,
            // order: []
          };

          $('#prediction').DataTable(settingsObj);

          const me = this;
          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (e.target.id === 'pills-one-tab') {
              me.drawReportHeader();
              me.drawSimilars();
            }
          });

          if (this.modelMatch){

            const options = {'width': 300, 'height': 300};
            const smilesDrawerScores = new SmilesDrawer.Drawer(options);    
    
            const canvas_ref = <HTMLCanvasElement>document.getElementById('scores_canvas_ref');
            const context_ref = canvas_ref.getContext('2d');
    
            const canvas = <HTMLCanvasElement>document.getElementById('scores_canvas_pre');
            const context = canvas.getContext('2d');
            
            PlotlyJS.newPlot('scoresPreDIV', this.plotScores.data, this.plotScores.layout, this.plotScores.config);
            
            let myPlot = <CustomHTMLElement>document.getElementById('scoresPreDIV');
            
            // on hover, draw the molecule
            myPlot.on('plotly_hover', function(eventdata){ 
              var points = eventdata.points[0];
              // console.log (points)
              if (points.curveNumber === 1) {
                SmilesDrawer.parse(result['SMILES'][points.pointNumber], function(tree) {
                  smilesDrawerScores.draw(tree, 'scores_canvas_ref', 'light', false);
                });   
                context_ref.font = "30px Barlow Semi Condensed";
                context_ref.fillText(result['obj_nam'][points.pointNumber], 20, 50); 
              }
              else {
                SmilesDrawer.parse(points.meta, function(tree) {
                  smilesDrawerScores.draw(tree, 'scores_canvas_pre', 'light', false);
                });
              }
            });
            // on onhover, clear the canvas
            myPlot.on('plotly_unhover', function(eventdata){
              var points = eventdata.points[0];
              if (points.curveNumber === 0) {
                context.clearRect(0, 0, canvas.width, canvas.height);
              }
            });
            myPlot.on('plotly_click', function(eventdata){
              var points = eventdata.points[0];
              if (points.curveNumber === 1) {
                context_ref.clearRect(0, 0, canvas_ref.width, canvas_ref.height);
              }
            });
          }
          this.predictionVisible = true;
            
          }, 500);
        }
    );
  }
  updatePlotCombo() {

    const xi = this.predictionResult.xmatrix[this.molIndex];
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
      for (let i=0; i<this.predictionResult.var_nam.length; i++) {
        const varlist=String(this.predictionResult.var_nam[i]).split(':');
        this.plotComboQ.data[0].y[i] = varlist[1]+'.v'+varlist[2];

        if (this.isQuantitative){
          this.plotComboQ.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboQ.data[1].x[i] = this.predictionResult.values[this.molIndex];
        }

      }
      var drawCI = false;
      if (this.predictionResult['ensemble_ci']){
        drawCI = true
        var cilist = this.predictionResult.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.predictionResult['ensemble_confidence']){
          drawCI = true
          var cilist = this.predictionResult.ensemble_confidence[this.molIndex];
         }
      }
      if (drawCI){
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          var cia = cilist[1+(i*2)] - xi[i];
          var cib = xi[i] - cilist[i*2];

          // avoid using c0 and c1 as CI ranges. c0/c1 are integers -1, 0 or 1
          if (!this.isInteger(cia) && !this.isInteger(cib) ) {
            this.plotComboQ.data[0].error_x.array[i] = cia;
            this.plotComboQ.data[0].error_x.arrayminus[i] = cib;
          }
        }

        if (this.isQuantitative && this.predictionResult['upper_limit']){
          for (let i=0; i<this.predictionResult.var_nam.length; i++) {
            const varlist=String(this.predictionResult.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[i] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[i] = this.predictionResult.upper_limit[this.molIndex];
          }
          let j = this.predictionResult.var_nam.length;
          for (let i=this.predictionResult.var_nam.length-1; i>-1; i--) {
            const varlist=String(this.predictionResult.var_nam[i]).split(':');
            this.plotComboQ.data[2].y[j] = varlist[1]+'.v'+varlist[2];
            this.plotComboQ.data[2].x[j] = this.predictionResult.lower_limit[this.molIndex];
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
      if (this.predictionResult['ensemble_ci']){
        drawCI = true
        var class_list = this.predictionResult.ensemble_ci[this.molIndex];
      }
      else {  // support for legacy models where we used ensemble_confidence
         if (this.predictionResult['ensemble_confidence']){
          drawCI = true
          var class_list = this.predictionResult.ensemble_confidence[this.molIndex];
         }
      }

      if (drawCI) {

        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          const varlist=String(this.predictionResult.var_nam[i]).split(':');
          this.plotComboC.data[0].y[i] = varlist[1]+'.v'+varlist[2];
          this.plotComboC.data[1].y[i] = varlist[1]+'.v'+varlist[2];
          
          this.plotComboC.data[0].x[i] = 0;
          this.plotComboC.data[1].x[i] = 0;
        }
        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
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

        for (let i=0; i<this.predictionResult.var_nam.length; i++) {
          const varlist=String(this.predictionResult.var_nam[i]).split(':');
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

  tabClickHandler(info: any): void {
    
    this.molIndex=parseInt(info[0])-1;

    this.noPreviousMol = false;
    this.noNextMol = false;
    if (this.molIndex == 0) {
      this.noPreviousMol = true;
    }
    if (this.molIndex == (this.predictionResult.SMILES.length - 1)) {
      this.noNextMol = true;
    }
    
    // var b = document.querySelector("#pills-all"); 
    // b.setAttribute('aria-selected', 'false');
    // b.setAttribute('tabindex', "-1");
    
    $('a[aria-controls="pills-home"]').removeClass('active');
    $('#pills-all').removeClass('active');
    $('#pills-all').removeClass('show');
    
    // var tab = document.querySelector("#pills-one"); 
    // tab.setAttribute('aria-selected', 'true');
    // tab.removeAttribute('tabindex');
    
    $('a[aria-controls="pills-one"]').addClass('active');
    $('#pills-one').addClass('active'); 
    $('#pills-one').addClass('show'); 
    
    this.drawReportHeader();
    this.drawSimilars();
    this.updatePlotCombo();

  }
  drawReportHeader () {
    const options = {'width': 600, 'height': 300};
    const smilesDrawer = new SmilesDrawer.Drawer(options);
    SmilesDrawer.parse(this.predictionResult.SMILES[this.molIndex], function(tree) {
      // Draw to the canvas
      smilesDrawer.draw(tree, 'one_canvas', 'light', false);
      }, function (err) {
        console.log(err);
    });
  }
  drawSimilars () {
    setTimeout(() => {
      // draw similar compounds (if applicable)
      if (this.predictionResult.hasOwnProperty('search_results')) {
        const optionsA = {'width': 400, 'height': 150};
        const smiles = this.predictionResult.search_results[this.molIndex].SMILES;
        let iteratorCount = 0;
        for (var value of smiles) {
          const smilesDrawer = new SmilesDrawer.Drawer(optionsA);
          SmilesDrawer.parse(value, function(tree) {
            let canvasName = 'one_canvas';
            smilesDrawer.draw(tree,  canvasName.concat(iteratorCount.toString()), 'light', false);
          }, function (err) {
            console.log(err);
          });
          iteratorCount++;
        };  
      };
    },0);
  }

  backConc(value: any) {
    return (Math.pow(10,6-value).toFixed(4))
  }
  castValue(value: any) {

    if (this.modelBuildInfo['quantitative']) {
      return value.toFixed(3);
    } else {
      if (value === 0) {
        return 'Negative';
      } else if (value === 1) {
        return 'Positive';
      } else {
        return 'Uncertain';
      }
    }
  }

}
