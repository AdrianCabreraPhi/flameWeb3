import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Model, Prediction, Globals, Compound } from './Globals';
import { ModelListComponent } from './model-list/model-list.component';
import { CompoundsComponent } from './compounds/compounds.component';
import { ValidationsComponent } from './validations/validations.component';
import { QualitConformalComponent } from './qualit-conformal/qualit-conformal.component';
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';
import { ConfusionMatrixComponent } from './confusion-matrix/confusion-matrix.component';
import { QuantitConformalComponent } from './quantit-conformal/quantit-conformal.component';
import { SketchStructureComponent } from './sketch-structure/sketch-structure.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ModelSelectedInfoComponent } from './model-selected-info/model-selected-info.component';
import { CompoundsInfoComponent } from './compounds-info/compounds-info.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    ModelListComponent,
    CompoundsComponent,
    ValidationsComponent,
    QualitConformalComponent,
    ConfusionMatrixComponent,
    QuantitConformalComponent,
    SketchStructureComponent,
    ModelSelectedInfoComponent,
    CompoundsInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [Model, Prediction, Globals,Compound],
  bootstrap: [AppComponent]
})
export class AppModule { }
